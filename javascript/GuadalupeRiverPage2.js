// GuadalupeRiverPage2.js

export function revealPage2Layers() {
  const container = document.querySelector(".page-2 .left-container");
  if (!container) return;

  const layers = [
    ".scale-img1",
    ".scale-img2",
    ".scale-img3",
    ".scale-img4",
  ];

  layers.forEach((selector, index) => {
    const el = container.querySelector(selector);
    if (el) {
      setTimeout(() => {
        el.style.opacity = "1";
      }, 600 * (index + 1));
    }
  });
}

export function hidePage2Layers() {
  const container = document.querySelector(".page-2 .left-container");
  if (!container) return;

  const layers = [
    ".scale-img1",
    ".scale-img2",
    ".scale-img3",
    ".scale-img4",
  ];

  layers.forEach((selector) => {
    const el = container.querySelector(selector);
    if (el) el.style.opacity = "0";
  });
}
