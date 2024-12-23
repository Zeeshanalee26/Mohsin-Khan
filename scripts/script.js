document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImageContainer = document.querySelector('.service-image');
    const SLIDE_DURATION = 5000; // 5 seconds per slide
    let currentIndex = 0;
    let slideInterval;
    let isHovered = false;

    function createImage(src) {
        const img = document.createElement('img');
        img.src = src;
        return img;
    }

    function initializeSlideshow() {
        // Create and set first image
        const firstImage = createImage(serviceItems[0].getAttribute('data-image'));
        firstImage.classList.add('current');
        serviceImageContainer.appendChild(firstImage);
        serviceItems[0].classList.add('active');
        startTimer(0);
    }

    function startTimer(index) {
        const timerFill = serviceItems[index].querySelector('.timer-fill');
        timerFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
        timerFill.style.width = '100%';
    }

    function resetTimer(index) {
        const timerFill = serviceItems[index].querySelector('.timer-fill');
        timerFill.style.transition = 'none';
        timerFill.style.width = '0';
        void timerFill.offsetWidth; // Force reflow
    }

    function switchSlide(newIndex, immediate = false) {
        // Reset current timer and active state
        resetTimer(currentIndex);
        serviceItems[currentIndex].classList.remove('active');

        // Setup new image
        const currentImage = serviceImageContainer.querySelector('img.current');
        const newImage = createImage(serviceItems[newIndex].getAttribute('data-image'));
        
        currentImage.classList.add('sliding-out');
        newImage.classList.add('next');
        serviceImageContainer.appendChild(newImage);

        // Trigger animation
        setTimeout(() => {
            newImage.classList.remove('next');
            newImage.classList.add('current');
            
            // Cleanup after animation
            setTimeout(() => {
                if (currentImage && currentImage.parentNode) {
                    serviceImageContainer.removeChild(currentImage);
                }
            }, 800);
        }, 50);

        // Update active states
        serviceItems[newIndex].classList.add('active');
        startTimer(newIndex);

        currentIndex = newIndex;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % serviceItems.length;
        switchSlide(nextIndex);
    }

    function startAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (!isHovered) nextSlide();
        }, SLIDE_DURATION);
    }

    // Event Listeners
    serviceItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            isHovered = true;
            clearInterval(slideInterval);
            if (currentIndex !== index) {
                switchSlide(index, true);
            }
        });

        item.addEventListener('mouseleave', () => {
            isHovered = false;
            resetTimer(currentIndex);
            startTimer(currentIndex);
            startAutoplay();
        });
    });

    // Initialize and start
    initializeSlideshow();
    startAutoplay();
});