let isDragging = false;

const comparePageIndex = 6;
let compareContainer = null;
let wrapper = null;
let divider = null;

export const initCompareSlider = () => {
  compareContainer = document.querySelector(".page-6"); // since it's page-10
  if (!compareContainer) return;

  wrapper = compareContainer.querySelector("#imgRightWrapper");
  divider = compareContainer.querySelector("#divider");

  if (!wrapper || !divider) return;

  compareContainer.addEventListener("mousedown", startDrag);
  compareContainer.addEventListener("mousemove", drag);
  compareContainer.addEventListener("mouseup", stopDrag);
  compareContainer.addEventListener("mouseleave", stopDrag);

  // Touch support
  compareContainer.addEventListener("touchstart", startDrag);
  compareContainer.addEventListener("touchmove", drag);
  compareContainer.addEventListener("touchend", stopDrag);
};

function getX(event) {
  return event.touches ? event.touches[0].clientX : event.clientX;
}

function startDrag(e) {
  isDragging = true;
  drag(e);
}

function drag(e) {
  if (!isDragging || !wrapper || !divider) return;
  const containerWidth = compareContainer.offsetWidth;
  const x = getX(e) - compareContainer.getBoundingClientRect().left;
  const percent = (x / containerWidth) * 100;

  const boundedPercent = Math.max(0, Math.min(100, percent));
  wrapper.style.width = `${boundedPercent}%`;
  divider.style.left = `${boundedPercent}%`;
}

function stopDrag() {
  isDragging = false;
}
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("dragstart", (e) => e.preventDefault());
});
