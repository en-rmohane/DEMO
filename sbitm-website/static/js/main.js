// Advanced JavaScript for SBITM Website

class SBITMWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.setupScrollEffects();
        this.createInteractiveElements();
    }

    setupEventListeners() {
        // Form handling
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Modal handling
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
            trigger.addEventListener('click', this.handleModalTrigger.bind(this));
        });
    }

    initAnimations() {
        // GSAP animations if available
        if (typeof gsap !== 'undefined') {
            this.initGSAPAnimations();
        }

        // Parallax effect
        window.addEventListener('scroll', this.handleParallax.bind(this));
    }

    setupScrollEffects() {
        // Sticky elements
        window.addEventListener('scroll', this.handleStickyElements.bind(this));

        // Scroll-triggered animations
        this.setupScrollAnimations();
    }

    createInteractiveElements() {
        // Interactive stats
        this.createInteractiveStats();

        // Mouse follower effect
        this.createMouseFollower();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Add loading state
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            this.showToast('Form submitted successfully!', 'success');

            // Reset form
            form.reset();
        }, 2000);
    }

    handleModalTrigger(e) {
        const modalId = e.target.getAttribute('data-bs-target');
        const modal = document.querySelector(modalId);

        if (modal) {
            // Add animation to modal
            modal.classList.add('fade-in');
        }
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleStickyElements() {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset > 100;

        if (header && scrolled) {
            header.classList.add('sticky');
        } else if (header) {
            header.classList.remove('sticky');
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    createInteractiveStats() {
        const stats = document.querySelectorAll('.interactive-stat');

        stats.forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                stat.classList.add('pulse');
            });

            stat.addEventListener('mouseleave', () => {
                stat.classList.remove('pulse');
            });

            stat.addEventListener('click', () => {
                const value = stat.getAttribute('data-value');
                this.showStatDetails(value);
            });
        });
    }

    createMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.left = `${e.clientX}px`;
            follower.style.top = `${e.clientY}px`;
        });

        // Add follower styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .mouse-follower {
                position: fixed;
                width: 20px;
                height: 20px;
                background: var(--gradient-secondary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.2s ease;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(style);
    }

    initGSAPAnimations() {
        // Animate hero section
        gsap.from('.hero-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });

        // Animate floating elements
        gsap.to('.floating-1', {
            duration: 3,
            y: -20,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });

        gsap.to('.floating-2', {
            duration: 4,
            y: -30,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 1
        });

        gsap.to('.floating-3', {
            duration: 2.5,
            y: -15,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 2
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(toast);

        // Add toast styles
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease forwards;
                }

                .toast-success {
                    border-left: 4px solid #10b981;
                }

                .toast-info {
                    border-left: 4px solid #3b82f6;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showStatDetails(value) {
        // Create modal for stat details
        const modal = document.createElement('div');
        modal.className = 'stat-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <h3>Stat Details</h3>
                <p>Detailed information about: ${value}</p>
                <button class="btn btn-primary close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sbitmWebsite = new SBITMWebsite();
});

// Add service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
            registration => {
                console.log('ServiceWorker registration successful');
            },
            error => {
                console.log('ServiceWorker registration failed: ', error);
            }
        );
    });
}

// Handle offline functionality
window.addEventListener('online', () => {
    document.documentElement.classList.remove('offline');
    window.sbitmWebsite?.showToast('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    document.documentElement.classList.add('offline');
    window.sbitmWebsite?.showToast('You are offline. Some features may not work.', 'warning');
});