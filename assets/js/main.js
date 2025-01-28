// Navbar scroll animation
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
};

const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Observe team members
document.querySelectorAll('.team-member').forEach(member => {
    observer.observe(member);
});

// Observe section headings
document.querySelectorAll('.section-heading').forEach(heading => {
    observer.observe(heading);
});

// Achievement number counter animation
const animateNumber = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe achievement numbers
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const finalValue = parseInt(element.textContent);
            element.classList.add('counting');
            animateNumber(element, 0, finalValue, 2000); // 2 second duration
            achievementObserver.unobserve(element);
        }
    });
}, observerOptions);

// Start observing achievement numbers
document.querySelectorAll('.achievements li span').forEach(span => {
    achievementObserver.observe(span);
});

// Enhanced Service Card Animations
class SpringAnimation {
    constructor(stiffness = 100, damping = 10, mass = 1) {
        this.stiffness = stiffness;
        this.damping = damping;
        this.mass = mass;
        this.position = 0;
        this.velocity = 0;
    }

    update(targetPosition, deltaTime) {
        const force = (targetPosition - this.position) * this.stiffness;
        const damping = this.velocity * this.damping;
        const acceleration = (force - damping) / this.mass;
        
        this.velocity += acceleration * deltaTime;
        this.position += this.velocity * deltaTime;
        
        return this.position;
    }
}

// Service Card Tilt Effect
document.querySelectorAll('.service-card').forEach(card => {
    const springX = new SpringAnimation(100, 20, 1);
    const springY = new SpringAnimation(100, 20, 1);
    let rafId = null;
    const maxTilt = 15; // Maximum tilt in degrees

    function updateTilt() {
        const transform = `rotateX(${springX.position}deg) rotateY(${springY.position}deg)`;
        card.style.transform = transform;
        
        if (Math.abs(springX.velocity) > 0.01 || Math.abs(springY.velocity) > 0.01) {
            rafId = requestAnimationFrame(updateTilt);
        } else {
            rafId = null;
        }
    }

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate tilt angles based on mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const tiltX = ((mouseY - centerY) / (rect.height / 2)) * -maxTilt;
        const tiltY = ((mouseX - centerX) / (rect.width / 2)) * maxTilt;

        // Update spring animations
        springX.update(tiltX, 1/60);
        springY.update(tiltY, 1/60);

        if (!rafId) {
            rafId = requestAnimationFrame(updateTilt);
        }

        // Update shadow based on tilt
        const shadowX = tiltY * 0.5;
        const shadowY = tiltX * 0.5;
        const shadowBlur = Math.abs(tiltX) + Math.abs(tiltY) + 10;
        card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(37, 99, 235, 0.1)`;
    });

    card.addEventListener('mouseleave', () => {
        // Animate back to original position
        function resetPosition() {
            springX.update(0, 1/60);
            springY.update(0, 1/60);
            
            const transform = `rotateX(${springX.position}deg) rotateY(${springY.position}deg)`;
            card.style.transform = transform;
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            
            if (Math.abs(springX.position) > 0.01 || Math.abs(springY.position) > 0.01) {
                requestAnimationFrame(resetPosition);
            }
        }
        requestAnimationFrame(resetPosition);
    });

    // Icon spring animation
    const icon = card.querySelector('i');
    if (icon) {
        const iconSpring = new SpringAnimation(200, 10, 1);
        let iconRafId = null;

        function updateIcon() {
            const scale = 1 + iconSpring.position;
            icon.style.transform = `scale(${scale})`;
            
            if (Math.abs(iconSpring.velocity) > 0.001) {
                iconRafId = requestAnimationFrame(updateIcon);
            } else {
                iconRafId = null;
            }
        }

        card.addEventListener('mouseenter', () => {
            iconSpring.velocity += 0.5; // Add initial velocity for bounce effect
            if (!iconRafId) {
                iconRafId = requestAnimationFrame(updateIcon);
            }
        });

        card.addEventListener('mouseleave', () => {
            iconSpring.update(0, 1/60);
            if (!iconRafId) {
                iconRafId = requestAnimationFrame(updateIcon);
            }
        });
    }
});

// Mobile device check
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Disable intensive animations on mobile
if (isMobile) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transform = 'none';
        card.style.transition = 'transform 0.3s ease';
    });
}