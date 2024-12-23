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

  function updateCursor(e) {
      const rect = processGrid.getBoundingClientRect();
      
      // Check if mouse is within the process grid
      const isOverProcessArea = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
      );

      if (!isOverProcessArea) {
          cursorLeft.style.opacity = '0';
          cursorRight.style.opacity = '0';
          document.body.style.cursor = 'default';
          return;
      }

      // Always show custom cursor in process area
      document.body.style.cursor = 'none';
      
      // Determine which half we're on
      const isLeftHalf = e.clientX < (rect.left + rect.width / 2);

      // Update cursor positions
      cursorLeft.style.left = `${e.clientX}px`;
      cursorLeft.style.top = `${e.clientY}px`;
      cursorRight.style.left = `${e.clientX}px`;
      cursorRight.style.top = `${e.clientY}px`;

      // Show appropriate cursor
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
      const duration = 300; // Faster animation
      let startTime = null;

      function animate(currentTime) {
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smoother easing function
          const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic easing
          
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

  // Initialize cursors
  cursorLeft.style.display = 'block';
  cursorRight.style.display = 'block';
  cursorLeft.style.opacity = '0';
  cursorRight.style.opacity = '0';

  // Event Listeners
  processGrid.addEventListener('mousemove', updateCursor);

  processGrid.addEventListener('click', (e) => {
      const rect = processGrid.getBoundingClientRect();
      const isLeftHalf = e.clientX < (rect.left + rect.width / 2);

      // Always allow clicking in either direction
      if (isLeftHalf) {
          smoothScroll(Math.max(scrollPosition - cardWidth, 0));
      } else {
          smoothScroll(Math.min(scrollPosition + cardWidth, maxScroll));
      }
  });

  processGrid.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'default';
      cursorLeft.style.opacity = '0';
      cursorRight.style.opacity = '0';
  });

  window.addEventListener('resize', () => {
      maxScroll = (cards.length * cardWidth) - processGrid.offsetWidth;
      if (scrollPosition > maxScroll) {
          scrollPosition = maxScroll;
          processGrid.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
      }
  });
});