let isDragging = false;
let dragStart = null;
let hasMovedEnough = false;
const DRAG_THRESHOLD = 5;
const comparePageIndex = 6;
let compareContainer = null;
let wrapper = null;
let divider = null;
let circle = null;
let isVertical = false;
let scrollListener = null; // Track scroll listener for cleanup

export const initCompareSlider = () => {
  compareContainer = document.querySelector(".page-6");
  if (!compareContainer) return;

  wrapper = compareContainer.querySelector("#imgRightWrapper");
  divider = compareContainer.querySelector("#divider");
  circle = compareContainer.querySelector(".circle");

  if (!wrapper || !divider || !circle) return;
  // Determine layout direction based on screen width
  updateLayoutDirection();

  // Always sync divider with scroll
  syncDividerWithScroll();

  // Add event listeners ONLY to the circle
  circle.addEventListener("mousedown", startDrag);
  circle.addEventListener("touchstart", startDrag, { passive: false });

  // Add global listeners for move and end events
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", stopDrag);

  // Prevent default drag behavior for images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Update layout direction on resize
  window.addEventListener("resize", () => {
    updateLayoutDirection();
    // Re-initialize scroll sync after layout change
    setTimeout(() => {
      syncDividerWithScroll();
    }, 100);
  });
};

function syncDividerWithScroll() {
  if (!compareContainer || !divider) {
    return;
  }

  // Remove existing scroll listener if it exists
  if (scrollListener) {
    compareContainer.removeEventListener("scroll", scrollListener);
    if (wrapper) wrapper.removeEventListener("scroll", scrollListener);
  }

  // Only add scroll sync for mobile (vertical layout)
  if (!isVertical) {
    return;
  }

  // Create new scroll listener for mobile only
  scrollListener = () => {
    // Don't sync during drag operations
    if (isDragging) {
      return;
    }
    // Mobile: sync divider horizontal position with container's horizontal scroll
    const scrollLeft = compareContainer.scrollLeft;
    const containerWidth = compareContainer.offsetWidth;
    const scrollWidth = compareContainer.scrollWidth;
    const maxScroll = scrollWidth - containerWidth;
    if (maxScroll > 0) {
      // Calculate percentage of scroll (0 to 100)
      const scrollPercent = (scrollLeft / maxScroll) * 100;
      // Use percentage positioning for consistency with drag
      divider.style.left = `${scrollPercent}%`;
      divider.style.transform = `translate(-50%, -50%)`; // Center both ways
    }
  };

  // Add scroll listener only for mobile
  compareContainer.addEventListener("scroll", scrollListener);

  // Initial positioning for mobile
  scrollListener();
}

function updateLayoutDirection() {
  const wasVertical = isVertical;
  isVertical = window.innerWidth <= 900;
  // Re-sync when layout changes
  if (wasVertical !== isVertical) {
    setTimeout(() => {
      syncDividerWithScroll();
    }, 100);
  }
}

function getCoord(event) {
  const touch = event.touches ? event.touches[0] : event;
  return isVertical ? touch.clientY : touch.clientX;
}

function startDrag(e) {
  // Only start dragging if the circle was clicked
  if (!e.target.closest(".circle")) return;
  isDragging = true;
  hasMovedEnough = false;
  dragStart = getCoord(e);

  // Prevent default behavior and stop event propagation
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  // Add visual feedback
  circle.style.cursor = "grabbing";
  document.body.style.userSelect = "none";

  // Disable page scrolling during compare slider interaction
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}

function drag(e) {
  if (!isDragging || !wrapper || !divider || dragStart === null) return;

  const currentCoord = getCoord(e);
  const delta = Math.abs(currentCoord - dragStart);

  // Only start actual dragging after threshold is met
  if (!hasMovedEnough && delta < DRAG_THRESHOLD) return;

  hasMovedEnough = true;

  // Prevent default behavior and stop propagation
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const containerRect = compareContainer.getBoundingClientRect();
  const size = isVertical
    ? compareContainer.offsetHeight
    : compareContainer.offsetWidth;
  const position = isVertical
    ? currentCoord - containerRect.top
    : currentCoord - containerRect.left;

  const percent = (position / size) * 100;
  const boundedPercent = Math.max(0, Math.min(100, percent));
  // Apply the movement based on layout direction
  if (isVertical) {
    // Mobile: vertical drag controls height, maintain horizontal scroll sync
    wrapper.style.height = `${boundedPercent}%`;
    divider.style.top = `${boundedPercent}%`;
    divider.style.transform = `translate(-50%, -50%)`;
  } else {
    // Desktop: horizontal drag controls width
    wrapper.style.width = `${boundedPercent}%`;
    divider.style.left = `${boundedPercent}%`;
    divider.style.transform = `translateX(-50%)`;
  }
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  dragStart = null;
  hasMovedEnough = false;

  // Remove visual feedback
  circle.style.cursor = "grab";
  document.body.style.userSelect = "";

  // Re-enable page scrolling
  document.body.style.overflow = "";
  document.body.style.touchAction = "";

  // Re-sync with scroll after drag ends
  setTimeout(() => {
    if (scrollListener) scrollListener();
  }, 50);
}

// Export function to check if compare slider is dragging (for pageloader.js)
export const isCompareSliderDragging = () => isDragging;

// Cleanup function (optional)
export const destroyCompareSlider = () => {
  if (circle) {
    circle.removeEventListener("mousedown", startDrag);
    circle.removeEventListener("touchstart", startDrag);
  }

  if (scrollListener) {
    compareContainer?.removeEventListener("scroll", scrollListener);
    wrapper?.removeEventListener("scroll", scrollListener);
  }

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
  window.removeEventListener("resize", updateLayoutDirection);
};
