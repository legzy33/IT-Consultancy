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

// Enhanced achievement number counter animation with easing
const animateNumber = (element, start, end, duration) => {
    let startTimestamp = null;
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4); // Smooth easing function
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * (end - start) + start);
        
        // Add plus sign for numbers over 10
        element.textContent = current >= 10 ? `${current}+` : current;
        
        // Add scale animation class
        if (progress < 1) {
            element.style.transform = `scale(${1 + (1 - easedProgress) * 0.1})`;
            window.requestAnimationFrame(step);
        } else {
            element.style.transform = '';
        }
    };
    window.requestAnimationFrame(step);
};

// Enhanced achievement observer with staggered animations
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const finalValue = parseInt(element.textContent);
            element.classList.add('counting');
            
            // Add staggered delay based on index
            setTimeout(() => {
                animateNumber(element, 0, finalValue, 2500); // Increased duration for smoother animation
            }, index * 200); // 200ms delay between each number
            
            achievementObserver.unobserve(element);
        }
    });
}, {
    ...observerOptions,
    threshold: 0.5 // Increased threshold for better timing
});

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

// Parallax scrolling effect
const parallaxSections = document.querySelectorAll('.parallax-section');
let ticking = false;
let lastScrollY = window.pageYOffset;

// Initialize parallax backgrounds
parallaxSections.forEach(section => {
    const bg = section.querySelector('.parallax-bg');
    if (bg && bg.dataset.background) {
        bg.style.backgroundImage = `url(${bg.dataset.background})`;
    }
});

// Throttle function for performance
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Handle parallax scroll effect
const handleParallax = () => {
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const speed = 0.15; // Reduced for smoother movement
        
        // Only animate if section is in view with buffer
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            // Calculate relative scroll position for the section
            const sectionScrolled = (scrolled + rect.top) * speed;
            const relativeY = Math.round(sectionScrolled * 10) / 10; // Round to 1 decimal for performance
            
            // Parallax background with eased movement
            const bg = section.querySelector('.parallax-bg');
            if (bg) {
                const bgTransform = `translateZ(-15px) scale(2.5) translateY(${relativeY * 0.5}px)`;
                bg.style.transform = bgTransform;
            }
            
            // Parallax content elements with different speeds and easing
            if (section.id === 'home') {
                const h1 = section.querySelector('h1');
                const p = section.querySelector('p');
                const button = section.querySelector('.cta-button');
                
                if (h1) h1.style.transform = `translateZ(5px) scale(0.95) translateY(${relativeY * 0.2}px)`;
                if (p) p.style.transform = `translateZ(3px) scale(0.97) translateY(${relativeY * 0.15}px)`;
                if (button) button.style.transform = `translateZ(8px) scale(0.92) translateY(${relativeY * 0.25}px)`;
            } else if (section.id === 'about') {
                const content = section.querySelector('.about-content');
                const achievements = section.querySelector('.achievements');
                
                if (content) content.style.transform = `translateZ(4px) scale(0.96) translateY(${relativeY * 0.18}px)`;
                if (achievements) achievements.style.transform = `translateZ(6px) scale(0.94) translateY(${relativeY * 0.22}px)`;
            }
        }
    });
    
    ticking = false;
};

// Optimize scroll performance with requestAnimationFrame
window.addEventListener('scroll', () => {
    lastScrollY = window.pageYOffset;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleParallax();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Mobile device check
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Disable intensive animations on mobile
if (isMobile) {
    document.querySelectorAll('.service-card, .parallax-section, .parallax-bg').forEach(element => {
        element.style.transform = 'none';
        element.style.transition = 'transform 0.3s ease';
    });
}

// Initial parallax calculation
handleParallax();
