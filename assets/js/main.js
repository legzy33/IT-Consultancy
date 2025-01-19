// Utility Functions
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

// Lazy Load Images
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                if (img.dataset.background) {
                    img.style.backgroundImage = `url('${img.dataset.background}')`;
                    img.removeAttribute('data-background');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe images
    document.querySelectorAll('[data-src], [data-background]').forEach(img => {
        imageObserver.observe(img);
    });
};

// Scroll Progress
const initScrollProgress = () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const updateProgress = throttle(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }, 100);

    window.addEventListener('scroll', updateProgress);
};

// Parallax Effect
const initParallax = () => {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    const handleParallax = throttle(() => {
        requestAnimationFrame(() => {
            parallaxSections.forEach(section => {
                const distance = window.pageYOffset - section.offsetTop;
                const parallaxBg = section.querySelector('.parallax-bg');
                
                if (parallaxBg && isElementInViewport(section)) {
                    const speed = 0.5;
                    parallaxBg.style.transform = `translateY(${distance * speed}px)`;
                }
            });
        });
    }, 16);

    window.addEventListener('scroll', handleParallax);
};

// Utility to check if element is in viewport
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
};

// Button Ripple Effect
const initRippleEffect = () => {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.classList.remove('ripple');
            void this.offsetWidth;
            
            this.style.setProperty('--ripple-x', `${x}px`);
            this.style.setProperty('--ripple-y', `${y}px`);
            
            this.classList.add('ripple');
        });
    });
};

// Smooth Scroll
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Contact Form
const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            this.classList.add('loading');
            
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.classList.remove('loading');
            this.classList.add('success');
            
            setTimeout(() => {
                this.reset();
                this.classList.remove('success');
            }, 3000);
        });
    }
};

// Service Card Animation
const initServiceCards = () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const icon = entry.target.querySelector('i');
                if (icon) {
                    icon.style.animation = 'none';
                    void icon.offsetWidth;
                    icon.style.animation = null;
                }
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, {
        threshold: 0.1
    });

    serviceCards.forEach(card => observer.observe(card));
};

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    initScrollProgress();
    initParallax();
    initRippleEffect();
    initSmoothScroll();
    initContactForm();
    initServiceCards();

    // Add resource hints
    const addResourceHint = (url, type) => {
        const link = document.createElement('link');
        link.rel = type;
        link.href = url;
        document.head.appendChild(link);
    };

    // Preconnect to external resources
    addResourceHint('https://cdnjs.cloudflare.com', 'preconnect');
    addResourceHint('https://fonts.gstatic.com', 'preconnect');
});