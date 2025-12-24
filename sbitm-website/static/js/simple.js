// Simple JavaScript for SBITM Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const simpleNav = document.querySelector('.simple-nav');

    if (mobileMenuBtn && simpleNav) {
        mobileMenuBtn.addEventListener('click', function() {
            simpleNav.classList.toggle('active');
            mobileMenuBtn.innerHTML = simpleNav.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header-content') && simpleNav.classList.contains('active')) {
                simpleNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Smooth scrolling for anchor links
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

    // Simple counter animation
    const counters = document.querySelectorAll('h3');
    counters.forEach(counter => {
        const text = counter.textContent;
        if (text.includes('+') || text.includes('%')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter);
                        observer.unobserve(counter);
                    }
                });
            });
            observer.observe(counter);
        }
    });

    function animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
            const target = parseInt(match[0]);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = text;
                    clearInterval(timer);
                } else {
                    const newText = text.replace(target, Math.floor(current));
                    element.textContent = newText;
                }
            }, 30);
        }
    }

    // Add active class to current page
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath ||
            (currentPath === '/' && linkPath === '{{ url_for("home") }}')) {
            link.classList.add('active');
        }
    });

    // Simple form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple validation
            let valid = true;
            const required = this.querySelectorAll('[required]');
            required.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (valid) {
                // Show success message
                alert('Thank you! Your message has been sent.');
                this.reset();
            }
        });
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});