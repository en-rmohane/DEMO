/* ================= SLIDERS JS ================= */
/* Hero slider for SBITM Betul */

document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".hero-section");
    let currentSlide = 0;

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove("active");

            currentSlide = (currentSlide + 1) % slides.length;

            slides[currentSlide].classList.add("active");
        }, 5000);
    }

});
