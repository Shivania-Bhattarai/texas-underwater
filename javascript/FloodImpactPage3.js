const overlayClipMax = 100;
const overlayClipMin = 0;


export const updatePage3OverlayClip = (currentPage, pageElements, indicatorTop, maxTop) => {
  if (currentPage !== 2) return;

  const page3 = pageElements[2];
  const overlays = page3.querySelectorAll(".overlay");

  const maxClipScroll = maxTop * 0.65; // Full reveal at 75% scroll
  const progress = Math.min(indicatorTop / maxClipScroll, 1); // Clamp to 1
  const clipPercentage = 100 - progress * 100; // 100 → 0 as scroll increases

  overlays.forEach((overlay) => {
    overlay.style.clipPath = `inset(0 0 0 ${clipPercentage}%)`;
  });
};

