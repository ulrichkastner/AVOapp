document.addEventListener('DOMContentLoaded', () => {
  const swipeEl = document.getElementById("swipe-area");
  if (!swipeEl || !('ontouchstart' in window || navigator.maxTouchPoints > 0)) return;

  let startX = 0;
  let isSwiping = false;

  swipeEl.style.transition = "transform 0.2s ease";
  swipeEl.style.willChange = "transform";

  swipeEl.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
    isSwiping = true;
  });

  swipeEl.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const currentX = e.changedTouches[0].screenX;
    const offset = currentX - startX;
    swipeEl.style.transform = `translateX(${offset * 0.3}px)`; // sanfter Effekt
  });

  swipeEl.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const endX = e.changedTouches[0].screenX;
    const delta = endX - startX;

    // Rücksetzen der Position
    swipeEl.style.transform = "translateX(0)";

    if (Math.abs(delta) < 40) return;

    const direction = delta > 0 ? 'prev' : 'next';
    const target = swipeEl.dataset[direction];
    if (target) {
      setTimeout(() => window.location.href = target, 150); // kleine Verzögerung für Animation
    }
  });

  // Optional: Tastaturnavigation
  document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft" && swipeEl.dataset.prev) {
      window.location.href = swipeEl.dataset.prev;
    }
    if (e.key === "ArrowRight" && swipeEl.dataset.next) {
      window.location.href = swipeEl.dataset.next;
    }
  });
});