/* ================= ANIMATIONS JS ================= */
/* Scroll-based reveal animations for SBITM Betul */

document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        ".program-card, .facility-card, .faculty-card, .admission-box, " +
        ".stat-box, .placement-box, .campus-card, .gallery-item, " +
        ".section-title, .page-header, .cta-section"
    );

    const revealOnScroll = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    animatedElements.forEach(el => revealOnScroll.observe(el));

});
