import { revealPage2Layers, hidePage2Layers } from "./GuadalupeRiverPage2.js";
import * as compare from "./Compare.js";
import * as page3 from "./FloodImpactPage3.js";

const indicator = document.getElementById("indicator");
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
const indicatorHeight = 25;
const step = 13;
const stepPage4 = 3;
const maxTop = window.innerHeight - indicatorHeight;
let pageElements = [];

const loadPageSequentially = async () => {
  for (let i = 0; i < pagesToLoad.length; i++) {
    const url = pagesToLoad[i];
    // if(i===5){
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
  // }
};

const showPage = (index) => {
  pageElements.forEach((element, i) => {
    element.classList.toggle("active", i === index);
    const isActive = i === index;

    //animate
    //page2
    if (isActive && currentPage === 1) {
      const title = document.querySelector(".title");
      const description = document.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin");
      revealPage2Layers();
    } else {
      hidePage2Layers();
    }
    setTimeout(() => {
      compare.initCompareSlider();
    }, 100);

    //page3
    if (isActive && currentPage === 2) {
      const title = element.querySelector(".content-header");
      const description = element.querySelector(".content-body");

      title.classList.add("flyin");
      description.classList.add("flyin");
      const overlay = element.querySelector(".overlay");
      if (overlay) {
        overlay.style.clipPath = "inset(0 0 0 100%)";
      }
    }
    //page4
    if (isActive && currentPage === 3) {
      const title = element.querySelector(".title");
      const head = element.querySelector(".top-header");

      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin");
      head.classList.add("flyin");
    }
    //page5
    if (isActive && currentPage === 4) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin");
    }
    //page7
    if (isActive && currentPage === 6) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin");
    }
    //page8
    if (isActive && currentPage === 7) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image = element.querySelector(".death-image");

      title.classList.add("flyin");
      description.classList.add("flyin");
      // image.classList.add("scale")
    }
    //page9
    if (isActive && currentPage === 8) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image = element.querySelector(".cause-image");

      title.classList.add("flyin");
      description.classList.add("flyin");
      // image.classList.add("scale")
    }
    //page10
    if (isActive && currentPage === 9) {
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image = element.querySelector(".relief-image");

      title.classList.add("flyin");
      description.classList.add("flyin");
      // image.classList.add("scale")
    }
  });
};

const handleScroll = (e) => {
  e.preventDefault();
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  if (pageElements.length === 0) return;
  const delta = Math.sign(e.deltaY);

  // Calculate step size with mobile optimization
  const isMobile = "ontouchstart" in window;

  let step;
  if (isMobile) {
    // Same step size for all pages on mobile
    step = 13;
  } else {
    // different step sizes for different pages on desktop
    step = currentPage === 2 || currentPage === 1 ? 5 : 11;
  }

  if (delta > 0) {
    if (currentPage < pageElements.length - 1) {
      indicatorTop += step;
      if (indicatorTop >= maxTop) {
        currentPage++;
        showPage(currentPage);
        indicatorTop = 0;
      }
    } else {
      indicatorTop = Math.min(indicatorTop + step, maxTop);
    }
  } else {
    if (currentPage > 0) {
      indicatorTop -= step;
      if (indicatorTop <= 0) {
        currentPage--;
        showPage(currentPage);
        indicatorTop = maxTop;
      }
    } else {
      indicatorTop = Math.max(indicatorTop - step, 0);
    }
  }
  indicator.style.top = `${indicatorTop}px`;
  page3.updatePage3OverlayClip(currentPage, pageElements, indicatorTop, maxTop);
};

// SMOOTH MOBILE SWIPE SUPPORT
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

window.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isTouching = true;
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (!isTouching) return;

    const touchCurrentY = e.touches[0].clientY;
    const touchCurrentX = e.touches[0].clientX;

    const deltaY = touchStartY - touchCurrentY;
    const deltaX = touchStartX - touchCurrentX;

    // Only handle vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      e.preventDefault(); // Prevent default scrolling

      // Create multiple smaller scroll events for smoother movement
      const steps = Math.ceil(Math.abs(deltaY) / 20);
      const stepDelta = deltaY / steps;

      for (let i = 0; i < steps; i++) {
        setTimeout(() => {
          const fakeEvent = {
            deltaY: stepDelta,
            preventDefault: () => {},
          };
          handleScroll(fakeEvent);
        }, i * 16); // 16ms intervals for smooth 60fps
      }
      // Reset touch start position for continuous scrolling
      touchStartY = touchCurrentY;
      touchStartX = touchCurrentX;
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    isTouching = false;
  },
  { passive: true }
);

// Alternative: Simplified approach with better thresholds
window.addEventListener(
  "touchend",
  (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;
    // Reduced threshold from 50px to 30px for more responsive feel
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      // Scale the delta to match mouse wheel sensitivity
      const scaledDelta = deltaY * 0.5;

      const fakeEvent = {
        deltaY: scaledDelta,
        preventDefault: () => {},
      };
      handleScroll(fakeEvent);
    }
  },
  { passive: true }
);

// MOUSE SCROLL SUPPORT
window.addEventListener("wheel", handleScroll, { passive: false });

window.onload = () => loadPageSequentially();
