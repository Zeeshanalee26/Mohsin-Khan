document.addEventListener('DOMContentLoaded', function() {
  const serviceItems = document.querySelectorAll('.service-item');
  const serviceImageContainer = document.querySelector('.service-image');
  const SLIDE_DURATION = 5000;
  let currentIndex = 0;
  let slideInterval;
  let isHovered = false;

  function initialize() {
      const firstImage = createImage(serviceItems[0].getAttribute('data-image'));
      firstImage.classList.add('active');
      serviceImageContainer.appendChild(firstImage);
      serviceItems[0].classList.add('active');
      startTimer(0);
  }

  function createImage(src) {
      const img = document.createElement('img');
      img.src = src;
      return img;
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
      resetTimer(currentIndex);
      serviceItems[currentIndex].classList.remove('active');

      const currentImage = serviceImageContainer.querySelector('img.active');
      const newImage = createImage(serviceItems[newIndex].getAttribute('data-image'));
      serviceImageContainer.appendChild(newImage);

      if (!immediate) {
          void newImage.offsetWidth; 
          currentImage.style.opacity = '0';
          currentImage.style.transform = 'translateY(-20px)'; 
      }
      newImage.classList.add('active');

      serviceItems[newIndex].classList.add('active');
      startTimer(newIndex);

      setTimeout(() => {
          if (currentImage) serviceImageContainer.removeChild(currentImage);
      }, 500);

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
              const currentImage = serviceImageContainer.querySelector('img.active');
              if (currentImage) {
                  currentImage.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; 
                  currentImage.style.transform = 'translateY(-20px)'; 
                  currentImage.style.opacity = '0'; 
              }
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

  initialize();
  startAutoplay();
});