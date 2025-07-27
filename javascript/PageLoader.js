import * as page2 from "./GuadalupeRiverPage2.js";

const indicator = document.getElementById("indicator");
const container = document.getElementById("page-container");

const pagesToLoad = [
  "./pages/UnderwaterPage1.html",
  "./pages/GuadalupeRiverPage2.html",
  "./pages/ClimateChangePage3.html",
  "./pages/FloodImpactPage4.html",
  "./pages/FloodRiskPage5.html",
  "./pages/CampMysticPage6.html",
  "./pages/HumanCostPage7.html",
  "./pages/DamagePage8.html",
  "./pages/FloodReliefPage9.html",
  "./pages/LastPage.html",
];
let currentPage = 0;
let indicatorTop = 0;
const indicatorHeight = 25;
const step = 10;
const stepPage4 = 3;
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
  });

  indicatorTop = 0;
  indicator.style.top = `${indicatorTop}px`;
  if (index === 1) {
    page2.initPage(indicatorTop, maxTop, indicator, 2); // ✅
  }

  //show 1st image imidiately
  // if (index === 3) {
  //   indicatorTop = 0; // Reset scroll
  //   updatePage4Background(0, maxTop);
  // }
};

const handleScroll = (e) => {
  e.preventDefault();
  if (pageElements.length === 0) return;
  const delta = Math.sign(e.deltaY);

  // Handle special behavior for Page 2
  if (currentPage === 1) {
    const result = page2.handleScroll(delta, indicatorTop, maxTop, 5);
    indicatorTop = result.updatedTop;
    currentPage = result.updatedPage;
    indicator.style.top = `${indicatorTop}px`;
    if (result.pageChanged) showPage(currentPage);
    return;
  }

  // Page 5 behavior (index 4)
  if (currentPage === 4) {
    handlePage5Scroll(delta, 10);
    return;
  }

  //for page4 changing Bg
  // const onPage4 = currentPage === 3;
  // if (onPage4) {
  //   indicatorTop += delta * stepPage4;
  //   indicatorTop = Math.max(0, Math.min(indicatorTop, maxTop));
  //   indicator.style.top = `${indicatorTop}px`;
  //   updatePage4Background(indicatorTop, maxTop);
  //   //goto page5
  //   if (
  //     delta > 0 &&
  //     indicatorTop >= maxTop &&
  //     currentPage < pageElements.length - 1
  //   ) {
  //     currentPage++;
  //     showPage(currentPage);
  //     indicatorTop = 0;
  //     return;
  //   }

  //   //goto page3
  //   if (delta < 0 && indicatorTop <= 0 && currentPage > 0) {
  //     currentPage--;
  //     showPage(currentPage);
  //     indicatorTop = maxTop;
  //     return;
  //   }
  //   return;
  // }

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
};

// page5 v1
const handlePage5Scroll = (delta, pg5step = 10) => {
  const currentElement = pageElements[4]; // page-5
  indicatorTop += delta * pg5step;
  indicatorTop = Math.max(0, Math.min(indicatorTop, maxTop));
  indicator.style.top = `${indicatorTop}px`;

  const halfway = 25;
  if (indicatorTop >= halfway) {
    currentElement.classList.add("scrolled");
  } else {
    currentElement.classList.remove("scrolled");
  }
  // Go to next page
  if (
    delta > 0 &&
    indicatorTop >= maxTop &&
    currentPage < pageElements.length - 1
  ) {
    currentPage++;
    showPage(currentPage);
    indicatorTop = 0;
    return;
  }
  // Go to previous page
  if (delta < 0 && indicatorTop <= 0 && currentPage > 0) {
    currentPage--;
    showPage(currentPage);
    indicatorTop = maxTop;
    return;
  }
};

window.addEventListener("wheel", handleScroll, { passive: false });
window.onload = () => loadPageSequentially();
