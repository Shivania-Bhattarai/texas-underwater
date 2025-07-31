// let isDragging = false;

// const comparePageIndex = 6;
// let compareContainer = null;
// let wrapper = null;
// let divider = null;

// export const initCompareSlider = () => {
//   compareContainer = document.querySelector(".page-6"); // since it's page-10
//   if (!compareContainer) return;

//   wrapper = compareContainer.querySelector("#imgRightWrapper");
//   divider = compareContainer.querySelector("#divider");

//   if (!wrapper || !divider) return;

//   compareContainer.addEventListener("mousedown", startDrag);
//   compareContainer.addEventListener("mousemove", drag);
//   compareContainer.addEventListener("mouseup", stopDrag);
//   compareContainer.addEventListener("mouseleave", stopDrag);

//   // Touch support
//   compareContainer.addEventListener("touchstart", startDrag);
//   compareContainer.addEventListener("touchmove", drag);
//   compareContainer.addEventListener("touchend", stopDrag);
// };

// function getX(event) {
//   return event.touches ? event.touches[0].clientX : event.clientX;
// }

// function startDrag(e) {
//   isDragging = true;
//   drag(e);
// }

// function drag(e) {
//   if (!isDragging || !wrapper || !divider) return;
//   const containerWidth = compareContainer.offsetWidth;
//   const x = getX(e) - compareContainer.getBoundingClientRect().left;
//   const percent = (x / containerWidth) * 100;

//   const boundedPercent = Math.max(0, Math.min(100, percent));
//   wrapper.style.width = `${boundedPercent}%`;
//   divider.style.left = `${boundedPercent}%`;
// }

// function stopDrag() {
//   isDragging = false;
// }
// document.querySelectorAll("img").forEach((img) => {
//   img.addEventListener("dragstart", (e) => e.preventDefault());
// });


// let isDragging = false;
// let dragStartY = null; 
// let hasMovedEnough = false; 
// const DRAG_THRESHOLD = 5; 
// const comparePageIndex = 6;
// let compareContainer = null;
// let wrapper = null;
// let divider = null;

// export const initCompareSlider = () => {
//   compareContainer = document.querySelector(".page-6");
//   if (!compareContainer) return;
//   wrapper = compareContainer.querySelector("#imgRightWrapper");
//   divider = compareContainer.querySelector("#divider");
//   if (!wrapper || !divider) return;
  
//   compareContainer.addEventListener("mousedown", startDrag);
//   compareContainer.addEventListener("mousemove", drag);
//   compareContainer.addEventListener("mouseup", stopDrag);
//   compareContainer.addEventListener("mouseleave", stopDrag);
  
//   // Touch support
//   compareContainer.addEventListener("touchstart", startDrag, { passive: false });
//   compareContainer.addEventListener("touchmove", drag, { passive: false });
//   compareContainer.addEventListener("touchend", stopDrag);
// };

// function getY(event) {
//   return event.touches ? event.touches[0].clientY : event.clientY;
// }

// function startDrag(e) {
//   isDragging = true;
//   hasMovedEnough = false;
//   dragStartY = getY(e);
  
//   // Prevent default behavior for touch events
//   if (e.touches) {
//     e.preventDefault();
//   }
// }

// function drag(e) {
//   if (!isDragging || !wrapper || !divider || dragStartY === null) return;
  
//   const currentY = getY(e);
//   const deltaY = Math.abs(currentY - dragStartY);
  
//   // Only start dragging if user has moved enough
//   if (!hasMovedEnough && deltaY < DRAG_THRESHOLD) {
//     return;
//   }
  
//   hasMovedEnough = true;
  
//   // Prevent default behavior for touch events
//   if (e.touches) {
//     e.preventDefault();
//   }
  
//   const containerHeight = compareContainer.offsetHeight;
//   const y = currentY - compareContainer.getBoundingClientRect().top;
//   const percent = (y / containerHeight) * 100;
//   const boundedPercent = Math.max(0, Math.min(100, percent));
  
//   wrapper.style.height = `${boundedPercent}%`;
//   divider.style.top = `${boundedPercent}%`;
// }

// function stopDrag() {
//   isDragging = false;
//   dragStartY = null;
//   hasMovedEnough = false;
// }

// // Prevent default drag behavior for images
// document.querySelectorAll("img").forEach((img) => {
//   img.addEventListener("dragstart", (e) => e.preventDefault());
// });


let isDragging = false;
let dragStart = null;
let hasMovedEnough = false;
const DRAG_THRESHOLD = 5;
const comparePageIndex = 6;
let compareContainer = null;
let wrapper = null;
let divider = null;
let isVertical = false;

export const initCompareSlider = () => {
  compareContainer = document.querySelector(".page-6"); // Or `.page-10` if needed
  if (!compareContainer) return;

  wrapper = compareContainer.querySelector("#imgRightWrapper");
  divider = compareContainer.querySelector("#divider");
  if (!wrapper || !divider) return;

  // Decide direction based on screen width
  isVertical = window.innerWidth < 1122;

  // Mouse events
  compareContainer.addEventListener("mousedown", startDrag);
  compareContainer.addEventListener("mousemove", drag);
  compareContainer.addEventListener("mouseup", stopDrag);
  compareContainer.addEventListener("mouseleave", stopDrag);

  // Touch events
  compareContainer.addEventListener("touchstart", startDrag, { passive: false });
  compareContainer.addEventListener("touchmove", drag, { passive: false });
  compareContainer.addEventListener("touchend", stopDrag);

  // Prevent default drag behavior for images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Optional: Recalculate on resize
  window.addEventListener("resize", () => {
    isVertical = window.innerWidth < 1122;
  });
};

function getCoord(event) {
  const touch = event.touches ? event.touches[0] : event;
  return isVertical ? touch.clientY : touch.clientX;
}

function startDrag(e) {
  isDragging = true;
  hasMovedEnough = false;
  dragStart = getCoord(e);
  if (e.touches) e.preventDefault();
}

function drag(e) {
  if (!isDragging || !wrapper || !divider || dragStart === null) return;

  const currentCoord = getCoord(e);
  const delta = Math.abs(currentCoord - dragStart);

  if (!hasMovedEnough && delta < DRAG_THRESHOLD) return;
  hasMovedEnough = true;
  if (e.touches) e.preventDefault();

  const containerRect = compareContainer.getBoundingClientRect();
  const size = isVertical ? compareContainer.offsetHeight : compareContainer.offsetWidth;
  const position = isVertical
    ? currentCoord - containerRect.top
    : currentCoord - containerRect.left;

  const percent = (position / size) * 100;
  const boundedPercent = Math.max(0, Math.min(100, percent));

  if (isVertical) {
    wrapper.style.height = `${boundedPercent}%`;
    divider.style.top = `${boundedPercent}%`;
  } else {
    wrapper.style.width = `${boundedPercent}%`;
    divider.style.left = `${boundedPercent}%`;
  }
}

function stopDrag() {
  isDragging = false;
  dragStart = null;
  hasMovedEnough = false;
}
