// v1
// const overlayClipMax = 100; // Maximum % for full reveal
// const overlayClipMin = 0;

// export const updatePage3OverlayClip = (
//   currentPage,
//   pageElements,
//   indicatorTop,
//   maxTop
// ) => {
//   if (currentPage !== 2) return;
//   const page3 = pageElements[2];
//   const overlay = page3.querySelectorAll(".overlay");

//   // Calculate how much of the overlay should be revealed
//   const clipPercentage = 100 - (indicatorTop / maxTop) * 100;
//   const clamped = Math.max(
//     overlayClipMin,
//     Math.min(overlayClipMax, clipPercentage)
//   );

//   overlay.style.clipPath = `inset(0 0 0 ${clamped}%)`;
// };

export const updatePage3OverlayClip = (currentPage, pageElements, indicatorTop, maxTop) => {
  if (currentPage !== 2) return;

  const page3 = pageElements[2];
  const overlays = page3.querySelectorAll(".overlay"); // Get both images

  const clipPercentage = 100 - (indicatorTop / maxTop) * 100;
  const clamped = Math.max(0, Math.min(100, clipPercentage));

  // Apply clip-path to both overlays (PNG + GIF)
  overlays.forEach((overlay) => {
    overlay.style.clipPath = `inset(0 0 0 ${clamped}%)`;
  });
};
