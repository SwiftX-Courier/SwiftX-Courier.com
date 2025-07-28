 let currentIndex = 0;
    const comboSlides = document.querySelectorAll(".slides-services  .slide");

    function showComboSlides (index) {
        comboSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index)
        });
    };

    function nextSlide ()  {
        currentIndex = (currentIndex + 1) % comboSlides.length;
        showComboSlides(currentIndex);
    };

    function prevSlide () {
        currentIndex = (currentIndex - 1 + comboSlides.length) % comboSlides.length;
        showComboSlides(currentIndex);
    }

    setInterval ( nextSlide, 1000)