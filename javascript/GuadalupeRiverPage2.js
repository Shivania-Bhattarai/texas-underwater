let overlay = null;
let page2El = null;

export function initPage(initialTop, maxTop, indicatorEl) {
  page2El = document.querySelector(".page-2");
  overlay = page2El?.querySelector(".mask-overlay");

  if (overlay) {
    updateMask(0); // Start fully covered
  }
}

export function handleScroll(delta, indicatorTop, maxTop) {
  const step = 10;
  indicatorTop += delta * step;
  indicatorTop = Math.max(0, Math.min(indicatorTop, maxTop));

  // Animate within first 50%
  const halfMax = maxTop / 2;
  let progress = indicatorTop / halfMax;
  progress = Math.max(0, Math.min(progress, 1));

  updateMask(progress);

  let updatedPage = 1;
  let pageChanged = false;

  if (delta > 0 && indicatorTop >= maxTop) {
    updatedPage = 2;
    indicatorTop = 0;
    pageChanged = true;
  } else if (delta < 0 && indicatorTop <= 0) {
    updatedPage = 0;
    indicatorTop = maxTop;
    pageChanged = true;
  }

  return {
    updatedTop: indicatorTop,
    updatedPage,
    pageChanged,
  };
}
function updateMask(progress) {
  if (!overlay) return;
  const size = 100 - progress * 100;
  // Adjust center: 15px left, 5px down from center
  const xOffset = -65;
  const yOffset = 45;
  overlay.style.clipPath = `circle(${size}% at calc(50% - ${xOffset}px) calc(50% + ${yOffset}px))`;
}

