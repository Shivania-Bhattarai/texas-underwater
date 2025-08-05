import { revealPage2Layers, hidePage2Layers } from "./GuadalupeRiverPage2.js";
import * as compare from "./Compare.js";
import * as page3 from "./FloodImpactPage3.js";

const indicator = document.querySelector("#indicator");
const container = document.getElementById("page-container");

const pagesToLoad = [
  "./pages/UnderwaterPage1.html",
  "./pages/GuadalupeRiverPage2.html",
  "./pages/FloodImpactPage3.html",
  "./pages/ClimateChangePage4.html",
  "./pages/FloodRiskPage5.html",
  "./pages/BeforeAndAfter.html",
  "./pages/CampMysticPage7.html",
  "./pages/HumanCostPage8.html",
  "./pages/DamagePage9.html",
  "./pages/FloodReliefPage10.html",
  "./pages/LastPage.html",
];

let currentPage = 0;
let indicatorTop = 0;
const indicatorHeight = 20;
const step = 15;
const stepPage4 = 5;
const maxTop = window.innerHeight - indicatorHeight;
let pageElements = [];

const loadPageSequentially = async () => {
  for (let i = 0; i < pagesToLoad.length; i++) {
    const url = pagesToLoad[i];
    try {
      const res = await fetch(url);
      const html = await res.text();

      const pagediv = document.createElement("section");
      pagediv.classList.add("page", `page-${i + 1}`);
      if (i === 0) pagediv.classList.add("active");
      pagediv.innerHTML = html;

      container.appendChild(pagediv);
      pageElements.push(pagediv);
    } catch (err) {
      console.error("Failed to load:", url, err);
    }
  }
};

const showPage = (index) => {
  pageElements.forEach((element, i) => {
    element.classList.toggle("active", i === index);
    const isActive = i === index;

    // Page-specific animations
    if (isActive && currentPage === 1) {
      const title = document.querySelector(".title-text");
      const description = document.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
      revealPage2Layers();
    } else {
      hidePage2Layers();
    }

    // Initialize compare slider for page 6 (index 5)
    if (isActive && currentPage === 5) {
      setTimeout(() => {
        compare.initCompareSlider();
      }, 100);
    }

    // Other page animations...
    if (isActive && currentPage === 2) {
      const title = element.querySelector(".content-header");
      const description = element.querySelector(".content-body");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
      const overlay = element.querySelector(".overlay");
      if (overlay) {
        overlay.style.clipPath = "inset(0 0 0 100%)";
      }
    }

    if (isActive && currentPage === 3) {
      const title = element.querySelector(".title");
      const head = element.querySelector(".top-header");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
      if (head) head.classList.add("flyin");
    }

    if (isActive && currentPage === 4) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
    }

    if (isActive && currentPage === 6) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
    }

    if (isActive && currentPage === 7) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
    }

    if (isActive && currentPage === 8) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
    }

    if (isActive && currentPage === 9) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      if (title) title.classList.add("flyin");
      if (description) description.classList.add("flyin");
    }
  });
};

let lastScrollTime = 0;
let allowScroll = true;

const handleScroll = (e) => {
  e.preventDefault();

  // Do nothing if not enough time has passed since the last scroll
  if (!allowScroll) return;

  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  if (pageElements.length === 0) return;

  const deltaY = e.deltaY;
  const delta = Math.sign(deltaY);
  const now = Date.now();

  // Trackpad vs Mouse detection
  const isTrackpad = Math.abs(deltaY) < 50 && e.deltaMode === 0;
   // Step logic
  let stepSize;
  if (isTrackpad) {
    stepSize = currentPage === 1 || currentPage === 2 ? 5 : 11;
  } else {
    // Mouse scroll → jump fast
    stepSize = currentPage === 1 || currentPage === 2 ? 25 : 55;
  }

  if (delta > 0) {
    if (currentPage < pageElements.length - 1) {
      indicatorTop += stepSize;
      if (indicatorTop >= maxTop) {
        currentPage++;
        showPage(currentPage);
        indicatorTop = 0;
        allowScroll = false;
        setTimeout(() => (allowScroll = true), 200); // delay before next scroll
      }
    } else {
      indicatorTop = Math.min(indicatorTop + stepSize, maxTop);
    }
  } else {
    if (currentPage > 0) {
      indicatorTop -= stepSize;
      if (indicatorTop <= 0) {
        currentPage--;
        showPage(currentPage);
        indicatorTop = maxTop;
        allowScroll = false;
        setTimeout(() => (allowScroll = true), 200); // delay before next scroll
      }
    } else {
      indicatorTop = Math.max(indicatorTop - stepSize, 0);
    }
  }

  if (indicator) {
    indicator.style.top = `${indicatorTop}px`;
  }

  if (page3 && page3.updatePage3OverlayClip) {
    page3.updatePage3OverlayClip(
      currentPage,
      pageElements,
      indicatorTop,
      maxTop
    );
  }
};

// Enhanced touch handling with compare slider awareness
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

// Function to check if touch target is specifically the compare slider circle
function isTouchOnCompareSliderCircle(target) {
  return target && target.closest(".page-6 .circle") !== null;
}

// Function to check if we should ignore this touch event
function shouldIgnoreTouch(target) {
  // Only ignore if actively dragging the compare slider OR touching the circle specifically
  return (
    (compare.isCompareSliderDragging && compare.isCompareSliderDragging()) ||
    isTouchOnCompareSliderCircle(target)
  );
}

window.addEventListener(
  "touchstart",
  (e) => {
    // Don't handle touch if it's on the compare slider
    if (shouldIgnoreTouch(e.target)) {
      isTouching = false;
      return;
    }

    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isTouching = true;
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    // Skip if not touching
    if (!isTouching) return;

    // Only skip if compare slider is actively being dragged
    if (compare.isCompareSliderDragging && compare.isCompareSliderDragging()) {
      isTouching = false;
      return;
    }

    const touchCurrentY = e.touches[0].clientY;
    const touchCurrentX = e.touches[0].clientX;

    const deltaY = touchStartY - touchCurrentY;
    const deltaX = touchStartX - touchCurrentX;

    // Only handle vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      // Don't prevent default if touching compare slider circle
      if (!isTouchOnCompareSliderCircle(e.target)) {
        // e.preventDefault();

        // Create smoother movement with smaller steps
        const steps = Math.ceil(Math.abs(deltaY) / 30);
        const stepDelta = deltaY / steps;
        for (let i = 0; i < steps; i++) {
          setTimeout(() => {
            const fakeEvent = {
              deltaY: stepDelta,
              preventDefault: () => {},
            };
            handleScroll(fakeEvent);
          }, i * 16);
        }

        // Reset for continuous scrolling
        touchStartY = touchCurrentY;
        touchStartX = touchCurrentX;
      }
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    // Don't handle if compare slider was actively being dragged
    if (
      !isTouching ||
      (compare.isCompareSliderDragging && compare.isCompareSliderDragging())
    ) {
      isTouching = false;
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    // Handle swipe gesture
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      const scaledDelta = deltaY * 0.5;

      const fakeEvent = {
        deltaY: scaledDelta,
        preventDefault: () => {},
      };
      handleScroll(fakeEvent);
    }

    isTouching = false;
  },
  { passive: true }
);

// Mouse wheel support
window.addEventListener(
  "wheel",
  (e) => {
    // Don't handle wheel events if compare slider is being dragged
    if (compare.isCompareSliderDragging && compare.isCompareSliderDragging()) {
      return;
    }
    // Don't handle if mouse is specifically over the compare slider circle
    if (isTouchOnCompareSliderCircle(e.target)) {
      return;
    }
    handleScroll(e);
  },
  { passive: false }
);

window.onload = () => loadPageSequentially();
