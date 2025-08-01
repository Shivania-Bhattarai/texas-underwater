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
let scrollListener = null;

export const initCompareSlider = () => {
  compareContainer = document.querySelector(".page-6");
  if (!compareContainer) return;

  wrapper = compareContainer.querySelector("#imgRightWrapper");
  divider = compareContainer.querySelector("#divider");
  circle = compareContainer.querySelector(".circle");

  if (!wrapper || !divider || !circle) return;
  
  // Determine layout direction based on screen width
  updateLayoutDirection();

  // Initialize with 50% position
  initializePositions();

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
    initializePositions();
    setTimeout(() => {
      syncDividerWithScroll();
    }, 100);
  });
};

function initializePositions() {
  if (!wrapper || !divider) return;
  
  if (isVertical) {
    // Mobile: Initialize at 50% from top
    setVerticalPosition(50);
  } else {
    // Desktop: Initialize at 50% from left
    setHorizontalPosition(50);
  }
}

function setVerticalPosition(percent) {
  // Clamp percent between 0 and 100
  percent = Math.max(0, Math.min(100, percent));
  
  // Get actual viewport height
  const viewportHeight = window.innerHeight;
  
  // Calculate exact pixel position for divider
  const dividerPosition = (percent / 100) * viewportHeight;
  
  // CRITICAL FIX: Container should fill from top to divider position
  // This ensures no gap between container and divider
  wrapper.style.height = `${dividerPosition}px`;
  wrapper.style.width = '100vw';
  wrapper.style.maxHeight = 'none'; // Remove any max-height constraints
  wrapper.style.minHeight = '0px';  // Allow very small heights
  wrapper.style.top = '0px';
  wrapper.style.left = '0px';
  wrapper.style.position = 'absolute';
  
  // Position divider at the exact bottom edge of the container
  divider.style.top = `${dividerPosition}px`;
  divider.style.left = '50%';
  divider.style.transform = 'translate(-50%, -50%)';
  divider.style.position = 'fixed';
  
  // Ensure the right image is positioned to show the correct portion
  const rightImg = wrapper.querySelector('.img-right');
  if (rightImg) {
    rightImg.style.top = '0px';
    rightImg.style.left = '0px';
    rightImg.style.width = '100vw';
    rightImg.style.height = '100vh'; // Full viewport height
    rightImg.style.objectFit = 'cover';
    rightImg.style.objectPosition = 'center top'; // Align to top
  }
  
  // Force repaint for Samsung browsers
  if (navigator.userAgent.includes('SamsungBrowser') || navigator.userAgent.includes('Samsung')) {
    wrapper.offsetHeight; // Trigger reflow
    if (rightImg) rightImg.offsetHeight;
  }
}

function setHorizontalPosition(percent) {
  // Clamp percent between 0 and 100
  percent = Math.max(0, Math.min(100, percent));
  
  // Desktop: horizontal positioning
  wrapper.style.width = `${percent}%`;
  wrapper.style.height = '100vh';
  wrapper.style.maxHeight = '';
  wrapper.style.top = '0px';
  wrapper.style.left = '0px';
  
  divider.style.left = `${percent}%`;
  divider.style.top = '50%';
  divider.style.transform = 'translate(-50%, -50%)';
}

function syncDividerWithScroll() {
  if (!compareContainer || !divider) return;

  // Remove existing scroll listener if it exists
  if (scrollListener) {
    compareContainer.removeEventListener("scroll", scrollListener);
  }

  // Only add scroll sync for mobile (vertical layout)
  if (!isVertical) return;

  // Create new scroll listener for mobile only
  scrollListener = () => {
    // Don't sync during drag operations
    if (isDragging) return;
    
    // Mobile: sync divider horizontal position with container's horizontal scroll
    const scrollLeft = compareContainer.scrollLeft;
    const containerWidth = compareContainer.offsetWidth;
    const scrollWidth = compareContainer.scrollWidth;
    const maxScroll = scrollWidth - containerWidth;
    
    if (maxScroll > 0) {
      // Calculate percentage of scroll (0 to 100)
      const scrollPercent = (scrollLeft / maxScroll) * 100;
      // Only update horizontal position, keep vertical position intact
      const currentTop = divider.style.top;
      divider.style.left = `${50 + (scrollPercent - 50) * 0.5}%`; // Subtle horizontal movement
      divider.style.transform = 'translate(-50%, -50%)';
    }
  };

  // Add scroll listener only for mobile  
  compareContainer.addEventListener("scroll", scrollListener);
  scrollListener();
}

function updateLayoutDirection() {
  const wasVertical = isVertical;
  isVertical = window.innerWidth <= 900;
  
  // If layout direction changed, reinitialize
  if (wasVertical !== isVertical) {
    setTimeout(() => {
      initializePositions();
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

  if (isVertical) {
    // Mobile: vertical drag from top to bottom
    const viewportHeight = window.innerHeight;
    
    // Use current touch/mouse position relative to viewport
    const relativeY = Math.max(0, Math.min(viewportHeight, currentCoord));
    
    // Calculate percentage based on viewport height
    const percent = (relativeY / viewportHeight) * 100;
    
    // Apply vertical position with container clinging to divider
    setVerticalPosition(percent);
    
  } else {
    // Desktop: horizontal drag from left to right
    const containerRect = compareContainer.getBoundingClientRect();
    const containerWidth = compareContainer.offsetWidth;
    const relativeX = currentCoord - containerRect.left;
    
    // Calculate percentage based on container width
    const percent = (relativeX / containerWidth) * 100;
    
    // Apply horizontal position
    setHorizontalPosition(percent);
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

  // Re-sync with scroll after drag ends (mobile only)
  if (isVertical) {
    setTimeout(() => {
      if (scrollListener) scrollListener();
    }, 50);
  }
}

// Export function to check if compare slider is dragging
export const isCompareSliderDragging = () => isDragging;

// Cleanup function
export const destroyCompareSlider = () => {
  if (circle) {
    circle.removeEventListener("mousedown", startDrag);
    circle.removeEventListener("touchstart", startDrag);
  }

  if (scrollListener && compareContainer) {
    compareContainer.removeEventListener("scroll", scrollListener);
  }

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
  window.removeEventListener("resize", updateLayoutDirection);
};