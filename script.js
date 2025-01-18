document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // Parallax scrolling effect
    window.addEventListener('scroll', function() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset - section.offsetTop;
            const parallaxBg = section.querySelector('.parallax-bg');
            
            if (parallaxBg) {
                // Adjust the speed of the parallax effect
                const speed = 0.5;
                parallaxBg.style.transform = `translateY(${distance * speed}px)`;
            }
        });
    });

    // Button Ripple Effect
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Remove existing ripple class
            this.classList.remove('ripple');
            
            // Force a reflow
            void this.offsetWidth;
            
            // Position the ripple effect
            this.style.setProperty('--ripple-x', `${x}px`);
            this.style.setProperty('--ripple-y', `${y}px`);
            
            // Add the ripple class
            this.classList.add('ripple');
        });
    });

    // Smooth scroll for navigation links
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

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Add loading state
            this.classList.add('loading');
            
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Remove loading state and show success
            this.classList.remove('loading');
            this.classList.add('success');
            
            // Reset form after delay
            setTimeout(() => {
                this.reset();
                this.classList.remove('success');
            }, 3000);
        });
    }

    // Service Card Icons Hover Effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'none';
                void icon.offsetWidth; // Force reflow
                icon.style.animation = null;
            }
        });
    });
});
