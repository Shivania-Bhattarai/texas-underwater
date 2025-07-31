import { revealPage2Layers, hidePage2Layers  } from "./GuadalupeRiverPage2.js";
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
      if (i === 0) 
        pagediv.classList.add("active");
      pagediv.innerHTML = html;

      container.appendChild(pagediv);
      pageElements.push(pagediv);
    } catch (err) {
      console.error("Failed to load:", url, err);
    }}
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
    if(isActive && currentPage===3){
      const title = element.querySelector(".title");
        const head = element.querySelector(".top-header")

      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin"); 
            head.classList.add("flyin")

    }
    //page5
     if(isActive && currentPage===4){
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin"); 
    }
    //page7
    if(isActive && currentPage===6){
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");

      title.classList.add("flyin");
      description.classList.add("flyin"); 
    }
    //page8
    if(isActive && currentPage===7){
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image=element.querySelector(".death-image")

      title.classList.add("flyin");
      description.classList.add("flyin"); 
      // image.classList.add("scale")
    }
      //page9
    if(isActive && currentPage===8){
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image=element.querySelector(".cause-image")

      title.classList.add("flyin");
      description.classList.add("flyin"); 
      // image.classList.add("scale")
    }
      //page10
    if(isActive && currentPage===9){
      const title = element.querySelector(".title");
      const description = element.querySelector(".description");
      const image=element.querySelector(".relief-image")

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
  const step = currentPage === 2 || currentPage ===1 ? 5 : 13; 

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

// MOBILE SWIPE SUPPORT
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const touchEndX = e.changedTouches[0].clientX;

  const deltaY = touchStartY - touchEndY;
  const deltaX = touchStartX - touchEndX;

  if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
    const fakeEvent = {
      deltaY: deltaY,
      preventDefault: () => {},
    };
    handleScroll(fakeEvent);
  }
}, { passive: true });


// MOUSE SCROLL SUPPORT
window.addEventListener("wheel", handleScroll, { passive: false });


window.onload = () => loadPageSequentially();
