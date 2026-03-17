// --- Global State ---
let mosaicBar = null;
let fullscreenHost = null;
let isEnabled = false; // Local state of the toggle
let isResizeLocked = false;
let isDragging = false;
let dragStartX, dragStartY;
let resizeMode = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartLeft = 0;
let resizeStartTop = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;

// --- Core Functions ---

function createMosaicBar() {
  if (document.getElementById('subtitle-blocker-mosaic-bar')) return;

  mosaicBar = document.createElement('div');
  mosaicBar.id = 'subtitle-blocker-mosaic-bar';
  mosaicBar.style.position = 'fixed';
  mosaicBar.style.bottom = '10%';
  mosaicBar.style.left = '50%';
  mosaicBar.style.transform = 'translateX(-50%)';
  mosaicBar.style.width = '80%';
  mosaicBar.style.height = '10%';
  mosaicBar.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
  mosaicBar.style.backdropFilter = 'blur(12px)';
  mosaicBar.style.webkitBackdropFilter = 'blur(12px)';
  mosaicBar.style.cursor = 'move';
  mosaicBar.style.boxSizing = 'border-box';
  mosaicBar.style.overflow = 'auto';

  mosaicBar.addEventListener('mousedown', (e) => {
    if (e.target.dataset.resizeHandle) {
      return;
    }

    const rect = mosaicBar.getBoundingClientRect();

    // Convert the initial bottom/translate layout into explicit coordinates
    // before dragging so movement stays stable across normal and fullscreen modes.
    mosaicBar.style.left = `${rect.left}px`;
    mosaicBar.style.top = `${rect.top}px`;
    mosaicBar.style.bottom = 'auto';
    mosaicBar.style.transform = 'none';

    isDragging = true;
    dragStartX = e.clientX - rect.left;
    dragStartY = e.clientY - rect.top;
    e.preventDefault();
    e.stopPropagation();
  });

  const topHandle = createResizeHandle('top');
  const bottomHandle = createResizeHandle('bottom');
  const leftHandle = createResizeHandle('left');
  const rightHandle = createResizeHandle('right');
  mosaicBar.appendChild(topHandle);
  mosaicBar.appendChild(bottomHandle);
  mosaicBar.appendChild(leftHandle);
  mosaicBar.appendChild(rightHandle);

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      mosaicBar.style.left = `${e.clientX - dragStartX}px`;
      mosaicBar.style.top = `${e.clientY - dragStartY}px`;
    }

    if (resizeMode === 'top') {
      const deltaY = e.clientY - resizeStartY;
      const nextTop = resizeStartTop + deltaY;
      const nextHeight = resizeStartHeight - deltaY;
      if (nextHeight >= 24) {
        mosaicBar.style.top = `${nextTop}px`;
        mosaicBar.style.height = `${nextHeight}px`;
      }
    }

    if (resizeMode === 'bottom') {
      const deltaY = e.clientY - resizeStartY;
      const nextHeight = resizeStartHeight + deltaY;
      if (nextHeight >= 24) {
        mosaicBar.style.height = `${nextHeight}px`;
      }
    }

    if (resizeMode === 'left') {
      const deltaX = e.clientX - resizeStartX;
      const nextLeft = resizeStartLeft + deltaX;
      const nextWidth = resizeStartWidth - deltaX;
      if (nextWidth >= 60) {
        mosaicBar.style.left = `${nextLeft}px`;
        mosaicBar.style.width = `${nextWidth}px`;
      }
    }

    if (resizeMode === 'right') {
      const deltaX = e.clientX - resizeStartX;
      const nextWidth = resizeStartWidth + deltaX;
      if (nextWidth >= 60) {
        mosaicBar.style.width = `${nextWidth}px`;
      }
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    resizeMode = null;
  });

  updateResizeHandleState();

  // Initial placement is handled by the enforcement loop
}

function createResizeHandle(position) {
  const handle = document.createElement('div');
  handle.dataset.resizeHandle = position;
  handle.style.position = 'absolute';
  handle.style.background = 'rgba(255, 255, 255, 0.22)';
  handle.style.border = '1px solid rgba(255, 255, 255, 0.35)';
  handle.style.boxSizing = 'border-box';
  handle.style.zIndex = '1';
  handle.style.pointerEvents = 'auto';

  if (position === 'top') {
    handle.style.left = '0';
    handle.style.width = '100%';
    handle.style.height = '12px';
    handle.style.top = '-6px';
    handle.style.borderRadius = '999px';
    handle.style.cursor = 'ns-resize';
  } else if (position === 'bottom') {
    handle.style.left = '0';
    handle.style.width = '100%';
    handle.style.height = '12px';
    handle.style.bottom = '-6px';
    handle.style.borderRadius = '999px';
    handle.style.cursor = 'ns-resize';
  } else if (position === 'left') {
    handle.style.top = '0';
    handle.style.left = '-6px';
    handle.style.width = '12px';
    handle.style.height = '100%';
    handle.style.borderRadius = '999px';
    handle.style.cursor = 'ew-resize';
  } else if (position === 'right') {
    handle.style.top = '0';
    handle.style.right = '-6px';
    handle.style.width = '12px';
    handle.style.height = '100%';
    handle.style.borderRadius = '999px';
    handle.style.cursor = 'ew-resize';
  }

  handle.addEventListener('mousedown', (e) => {
    if (isResizeLocked) {
      return;
    }

    const rect = mosaicBar.getBoundingClientRect();

    mosaicBar.style.left = `${rect.left}px`;
    mosaicBar.style.top = `${rect.top}px`;
    mosaicBar.style.bottom = 'auto';
    mosaicBar.style.transform = 'none';

    resizeMode = position;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartLeft = rect.left;
    resizeStartTop = rect.top;
    resizeStartWidth = rect.width;
    resizeStartHeight = rect.height;
    e.preventDefault();
    e.stopPropagation();
  });

  return handle;
}

function updateResizeHandleState() {
  if (!mosaicBar) return;

  const handles = mosaicBar.querySelectorAll('[data-resize-handle]');
  handles.forEach((handle) => {
    handle.style.opacity = isResizeLocked ? '0.2' : '1';
    handle.style.pointerEvents = isResizeLocked ? 'none' : 'auto';
  });
}

function createFullscreenHost() {
  if (fullscreenHost) return;

  fullscreenHost = document.createElement('div');
  fullscreenHost.id = 'subtitle-blocker-fullscreen-host';
  fullscreenHost.setAttribute('popover', 'manual');
  fullscreenHost.style.position = 'fixed';
  fullscreenHost.style.inset = '0';
  fullscreenHost.style.width = '100vw';
  fullscreenHost.style.height = '100vh';
  fullscreenHost.style.margin = '0';
  fullscreenHost.style.padding = '0';
  fullscreenHost.style.border = 'none';
  fullscreenHost.style.background = 'transparent';
  fullscreenHost.style.overflow = 'visible';
  fullscreenHost.style.pointerEvents = 'auto';
  fullscreenHost.style.zIndex = '2147483647';

  document.body.appendChild(fullscreenHost);
}

function supportsPopoverTopLayer() {
  return typeof HTMLElement !== 'undefined'
    && typeof HTMLElement.prototype.showPopover === 'function';
}

function getFullscreenElement() {
  return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement;
}

function canCurrentFrameHostOverlay() {
  const hostname = window.location.hostname;

  if (window.top !== window) {
    if (!document.querySelector('video')) {
      return false;
    }

    return Boolean(getFullscreenElement());
  }

  if (hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    return Boolean(
      document.querySelector('.html5-video-player')
        || document.getElementById('movie_player')
    );
  }

  if (hostname === 'www.bilibili.com' || hostname === 'bilibili.com') {
    return Boolean(
      document.querySelector('.bpx-player-container')
        || document.getElementById('bilibili-player')
    );
  }

  return true;
}

function getSiteSpecificFullscreenParent(fullscreenElement) {
  const hostname = window.location.hostname;

  if (hostname === 'www.bilibili.com' || hostname === 'bilibili.com') {
    return document.querySelector('.bpx-player-container[data-screen="web"]')
      || document.querySelector('.bpx-player-container[data-screen="full"]')
      || document.querySelector('#bilibili-player.mode-webscreen')
      || document.querySelector('#bilibili-player.mode-fullscreen');
  }

  if (hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    return document.querySelector('.html5-video-player.ytp-fullscreen')
      || document.querySelector('#movie_player.ytp-fullscreen')
      || document.getElementById('movie_player');
  }

  return null;
}

function shouldUseFullscreenHost(fullscreenElement) {
  if (!fullscreenElement || !supportsPopoverTopLayer()) {
    return false;
  }

  if (getSiteSpecificFullscreenParent(fullscreenElement)) {
    return false;
  }

  // If the site fullscreened a container, keep the bar inside that container
  // so pointer interaction still works. Only fall back to top-layer hosting for
  // elements like <video> that can't reliably host arbitrary overlay children.
  return fullscreenElement.tagName === 'VIDEO';
}

function setBarState(shouldBeEnabled) {
  isEnabled = shouldBeEnabled;
  if (isEnabled) {
    enforceBarPosition(); // Run check immediately
  } else {
    if (mosaicBar) {
      mosaicBar.style.display = 'none';
    }
    if (fullscreenHost && fullscreenHost.matches(':popover-open')) {
      fullscreenHost.hidePopover();
    }
  }
}

function setResizeLocked(shouldBeLocked) {
  isResizeLocked = shouldBeLocked;
  updateResizeHandleState();
}

// --- THE ULTIMATE SOLUTION: The State Enforcement Loop ---

function enforceBarPosition() {
  if (!isEnabled) return;
  if (!canCurrentFrameHostOverlay()) {
    if (mosaicBar) {
      mosaicBar.style.display = 'none';
    }
    return;
  }

  if (!mosaicBar) {
    createMosaicBar();
  }

  if (!mosaicBar) {
    return;
  }

  mosaicBar.style.display = 'block';

  const fullscreenElement = getFullscreenElement();
  const siteSpecificParent = getSiteSpecificFullscreenParent(fullscreenElement);
  const shouldUseTopLayer = !siteSpecificParent && shouldUseFullscreenHost(fullscreenElement);

  let expectedParent = document.body;
  if (shouldUseTopLayer) {
    createFullscreenHost();
    expectedParent = fullscreenHost;
    if (!fullscreenHost.matches(':popover-open')) {
      fullscreenHost.showPopover();
    }
  } else {
    if (fullscreenHost && fullscreenHost.matches(':popover-open')) {
      fullscreenHost.hidePopover();
    }
    expectedParent = siteSpecificParent || fullscreenElement || document.body;
  }

  // If the bar isn't in the right parent, move it.
  if (mosaicBar.parentNode !== expectedParent) {
    expectedParent.appendChild(mosaicBar);
  }

  // Enforce the z-index to stay on top.
  const expectedZIndex = fullscreenElement ? '2147483647' : '9999';
  if (mosaicBar.style.zIndex !== expectedZIndex) {
    mosaicBar.style.zIndex = expectedZIndex;
  }
}

// Run the enforcer every 500ms to catch all edge cases and weird site implementations.
setInterval(enforceBarPosition, 500);
document.addEventListener('fullscreenchange', enforceBarPosition);
document.addEventListener('webkitfullscreenchange', enforceBarPosition);
document.addEventListener('mozfullscreenchange', enforceBarPosition);
document.addEventListener('MSFullscreenChange', enforceBarPosition);

// --- Chrome Listeners & Initializer ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'toggle':
      setBarState(request.value);
      break;
    case 'setHeight':
      if (mosaicBar) mosaicBar.style.height = `${request.value}px`;
      break;
    case 'setPosition':
      if (mosaicBar) mosaicBar.style.bottom = `${request.value}%`;
      break;
    case 'setResizeLocked':
      setResizeLocked(request.value);
      break;
  }
  return true;
});

chrome.storage.local.get(['isEnabled', 'height', 'position', 'isResizeLocked'], (result) => {
  setResizeLocked(Boolean(result.isResizeLocked));
  if (result.isEnabled) {
    setBarState(true);
    if (mosaicBar) {
      if (result.height) mosaicBar.style.height = `${result.height}px`;
      if (result.position) mosaicBar.style.bottom = `${result.position}%`;
    }
  }
});
