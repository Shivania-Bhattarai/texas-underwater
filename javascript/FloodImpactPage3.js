const overlayClipMax = 100; // Maximum % for full reveal
const overlayClipMin = 0;

export const updatePage3OverlayClip = (currentPage, pageElements, indicatorTop, maxTop) => {
  if (currentPage !== 2) return;
  const page3 = pageElements[2];
  const overlay = page3.querySelector(".overlay");
  const blinker=page3.querySelector(".blink")

  // Calculate how much of the overlay should be revealed
  const clipPercentage = 100 - (indicatorTop / maxTop) * 100;
  console.log(clipPercentage)
  if (clipPercentage >= 80.5 && clipPercentage <= 81.5) {
  blinker.style.visibility = "visible";
}
  const clamped = Math.max(overlayClipMin, Math.min(overlayClipMax, clipPercentage));

  overlay.style.clipPath = `inset(0 0 0 ${clamped}%)`;
};
