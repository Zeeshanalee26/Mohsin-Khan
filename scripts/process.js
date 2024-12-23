document.addEventListener('DOMContentLoaded', function() {
  const processSection = document.querySelector('.process-section');
  const processGrid = document.querySelector('.process-grid');
  const cards = document.querySelectorAll('.process-card');
  const cursorLeft = document.querySelector('.custom-cursor.left');
  const cursorRight = document.querySelector('.custom-cursor.right');

  let scrollPosition = 0;
  let animation = null;
  const cardWidth = cards[0].offsetWidth + 24;
  let maxScroll = (cards.length * cardWidth) - processGrid.offsetWidth;

  processSection.style.userSelect = 'none';
  processSection.style.webkitUserSelect = 'none';
  processSection.style.msUserSelect = 'none';

  function updateCursor(e) {
      const sectionRect = processSection.getBoundingClientRect();
      
      const isOverSection = (
          e.clientX >= sectionRect.left &&
          e.clientX <= sectionRect.right &&
          e.clientY >= sectionRect.top &&
          e.clientY <= sectionRect.bottom
      );

      if (!isOverSection) {
          cursorLeft.style.opacity = '0';
          cursorRight.style.opacity = '0';
          document.body.style.cursor = 'default';
          return;
      }

      document.body.style.cursor = 'none';
      
      const isLeftHalf = e.clientX < (sectionRect.left + sectionRect.width / 2);

      cursorLeft.style.left = `${e.clientX}px`;
      cursorLeft.style.top = `${e.clientY}px`;
      cursorRight.style.left = `${e.clientX}px`;
      cursorRight.style.top = `${e.clientY}px`;

      if (isLeftHalf) {
          cursorLeft.style.opacity = '1';
          cursorRight.style.opacity = '0';
      } else {
          cursorRight.style.opacity = '1';
          cursorLeft.style.opacity = '0';
      }
  }

  function smoothScroll(target) {
      if (animation) {
          cancelAnimationFrame(animation);
      }

      const start = scrollPosition;
      const change = target - start;
      const duration = 300;
      let startTime = null;

      function animate(currentTime) {
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const easeProgress = 1 - Math.pow(1 - progress, 4);
          
          scrollPosition = start + (change * easeProgress);
          processGrid.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;

          if (progress < 1) {
              animation = requestAnimationFrame(animate);
          } else {
              animation = null;
          }
      }

      animation = requestAnimationFrame(animate);
  }

  cursorLeft.style.display = 'block';
  cursorRight.style.display = 'block';
  cursorLeft.style.opacity = '0';
  cursorRight.style.opacity = '0';

  processSection.addEventListener('mousemove', updateCursor);
  
  processSection.addEventListener('click', (e) => {
      const sectionRect = processSection.getBoundingClientRect();
      const isLeftHalf = e.clientX < (sectionRect.left + sectionRect.width / 2);

      if (isLeftHalf && scrollPosition > 0) {
          smoothScroll(Math.max(scrollPosition - cardWidth, 0));
      } else if (!isLeftHalf && scrollPosition < maxScroll) {
          smoothScroll(Math.min(scrollPosition + cardWidth, maxScroll));
      }
  });

  processSection.addEventListener('mouseleave', () => {
      cursorLeft.style.transition = 'none';  
      cursorRight.style.transition = 'none';
      
      document.body.style.cursor = 'default';
      cursorLeft.style.opacity = '0';
      cursorRight.style.opacity = '0';
      
      setTimeout(() => {
          cursorLeft.style.transition = '';
          cursorRight.style.transition = '';
      }, 50);
  });

  window.addEventListener('resize', () => {
      maxScroll = (cards.length * cardWidth) - processGrid.offsetWidth;
      if (scrollPosition > maxScroll) {
          scrollPosition = maxScroll;
          processGrid.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
      }
  });
});