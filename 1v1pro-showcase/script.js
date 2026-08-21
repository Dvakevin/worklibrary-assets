const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

const syncViewportSectionScale = () => {
  const scale = window.innerWidth > 1180
    ? Math.min(1, window.innerWidth / 1440, window.innerHeight / 960)
    : 1;
  document.documentElement.style.setProperty('--screen-scale', String(scale));
};

window.addEventListener('resize', syncViewportSectionScale);
syncViewportSectionScale();

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('mobile-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('mobile-open');
    });
  });
}

const faqItems = Array.from(document.querySelectorAll('.faq-list details'));
const faqHover = window.matchMedia('(hover: hover) and (pointer: fine)');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((openItem) => {
      if (openItem !== item) openItem.open = false;
    });
  });

  item.addEventListener('pointerenter', () => {
    if (faqHover.matches) item.open = true;
  });

  item.addEventListener('pointerleave', () => {
    if (faqHover.matches) item.open = false;
  });

  item.querySelector('summary')?.addEventListener('click', (event) => {
    if (!faqHover.matches || !item.matches(':hover') || event.detail === 0) return;
    event.preventDefault();
    item.open = true;
  });
});

const hero = document.querySelector('.hero');
const siteHeader = document.querySelector('.site-header');
const heroAmbient = document.querySelector('.hero-ambient');
const heroVideo = hero?.querySelector('.video-main');

if (heroAmbient && 'IntersectionObserver' in window) {
  let ambientInView = true;
  const syncAmbientPlayback = () => {
    heroAmbient.classList.toggle('is-paused', document.hidden || !ambientInView);
  };
  const ambientObserver = new IntersectionObserver(([entry]) => {
    ambientInView = entry.isIntersecting;
    syncAmbientPlayback();
  });

  ambientObserver.observe(heroAmbient);
  document.addEventListener('visibilitychange', syncAmbientPlayback);
}

if (hero) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = window.matchMedia('(min-width: 1181px)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (value) => value * value * (3 - 2 * value);
  let frameRequested = false;
  let videoMotionProgress = 0;
  let videoSwitchState = null;
  let videoTransition = null;

  const stopHeroVideo = () => {
    if (!heroVideo) return;
    if (!heroVideo.paused) heroVideo.pause();
    if (heroVideo.currentTime > 0) {
      try {
        heroVideo.currentTime = 0;
      } catch {
        // The poster remains visible until the media metadata is available.
      }
    }
  };

  const syncHeroVideoPlayback = (shouldPlay) => {
    if (!heroVideo) return;
    if (!shouldPlay) {
      stopHeroVideo();
      return;
    }

    if (heroVideo.paused) {
      const playRequest = heroVideo.play();
      if (playRequest?.catch) playRequest.catch(() => {});
    }
  };

  const resetHeroMotion = () => {
    hero.classList.remove('is-animating');
    hero.classList.remove('is-video-expanded');
    videoMotionProgress = 0;
    videoSwitchState = null;
    videoTransition = null;
    hero.style.setProperty('--hero-copy-opacity', '1');
    hero.style.setProperty('--hero-copy-scale', '1');
    hero.style.setProperty('--hero-copy-y', '0px');
    hero.style.setProperty('--hero-video-radius', '20px');
    hero.style.setProperty('--hero-video-scale', '1');
    hero.style.setProperty('--hero-video-y', '0px');
    syncHeroVideoPlayback(false);
  };

  const updateHeroMotion = (timestamp) => {
    frameRequested = false;

    if (reducedMotion.matches || !desktopMotion.matches) {
      resetHeroMotion();
      return;
    }

    const maxScroll = Math.max(1, hero.offsetHeight - window.innerHeight);
    const scrolledDistance = clamp(-hero.getBoundingClientRect().top, 0, maxScroll);
    const progress = scrolledDistance / maxScroll;

    // Preserve the original lead-in distances; the added scroll length becomes an expanded-video dwell.
    const copyProgress = smoothstep(clamp((scrolledDistance - 33) / (640 - 33)));
    const videoSwitchDistance = 312;
    const videoCollapseDistance = 262;
    const videoLeadProgress = smoothstep(clamp((scrolledDistance - 8) / (videoSwitchDistance - 8)));
    const videoLeadAmount = 0.28;
    const videoScrollProgress = videoLeadProgress * videoLeadAmount;
    const shouldExpandVideo = videoSwitchState === true
      ? scrolledDistance > videoCollapseDistance
      : scrolledDistance >= videoSwitchDistance;
    const headerHeight = siteHeader?.offsetHeight ?? 65;
    const availableHeight = Math.max(1, window.innerHeight - headerHeight);
    const targetWidthScale = (Math.min(hero.clientWidth, 1440) - 48) / 1018;
    const targetHeightScale = (availableHeight * 0.9) / 601;
    const targetScale = Math.min(targetWidthScale, targetHeightScale);
    const targetCenterY = headerHeight + availableHeight / 2;
    const videoStartCenterY = 651 + 601 / 2;
    const targetVideoY = targetCenterY - videoStartCenterY;

    if (videoSwitchState === null) {
      videoSwitchState = shouldExpandVideo;
      videoMotionProgress = shouldExpandVideo ? 1 : videoScrollProgress;
    } else if (shouldExpandVideo !== videoSwitchState) {
      videoSwitchState = shouldExpandVideo;
      videoTransition = {
        duration: shouldExpandVideo ? 460 : 360,
        from: videoMotionProgress,
        startTime: timestamp
      };
    }

    if (videoTransition) {
      const transitionProgress = clamp((timestamp - videoTransition.startTime) / videoTransition.duration);
      const easedTransition = 1 - Math.pow(1 - transitionProgress, 4);
      const transitionTarget = videoSwitchState ? 1 : videoScrollProgress;
      videoMotionProgress = videoTransition.from + (transitionTarget - videoTransition.from) * easedTransition;

      if (transitionProgress >= 1) videoTransition = null;
    } else {
      videoMotionProgress = videoSwitchState ? 1 : videoScrollProgress;
    }

    hero.classList.toggle('is-animating', progress > 0 && (progress < 1 || Boolean(videoTransition)));
    hero.classList.toggle('is-video-expanded', videoSwitchState);
    hero.style.setProperty('--hero-copy-opacity', String(1 - copyProgress));
    hero.style.setProperty('--hero-copy-scale', String(1 - copyProgress * 0.18));
    hero.style.setProperty('--hero-copy-y', `${-72 * copyProgress}px`);
    hero.style.setProperty('--hero-video-radius', `${20 - videoMotionProgress * 12}px`);
    hero.style.setProperty('--hero-video-scale', String(1 + (targetScale - 1) * videoMotionProgress));
    hero.style.setProperty('--hero-video-y', `${targetVideoY * videoMotionProgress}px`);

    syncHeroVideoPlayback(
      videoSwitchState === true
      && videoTransition === null
      && videoMotionProgress >= 0.999
      && !document.hidden
    );

    if (videoTransition) requestHeroUpdate();
  };

  const requestHeroUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateHeroMotion);
  };

  window.addEventListener('scroll', requestHeroUpdate, { passive: true });
  window.addEventListener('resize', requestHeroUpdate);
  reducedMotion.addEventListener('change', requestHeroUpdate);
  desktopMotion.addEventListener('change', requestHeroUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopHeroVideo();
    else requestHeroUpdate();
  });
  requestHeroUpdate();
}

const sectionRevealConfigs = [
  {
    section: '.people-section',
    heading: '.section-heading',
    content: ['.filter-tabs', '.people-viewport', '.text-link']
  },
  {
    section: '.ways-section',
    heading: '.section-heading',
    content: ['.ways-grid']
  },
  {
    section: '.world-section',
    heading: '.section-heading',
    content: ['.world-grid']
  },
  {
    section: '.conversation-section',
    heading: '.section-heading',
    content: ['.round-button', '.conversation-wall']
  },
  {
    section: '.steps-section',
    heading: '.section-heading',
    content: ['.steps-experience']
  },
  {
    section: '.faq-section',
    heading: '.section-heading',
    content: ['.faq-list']
  },
  {
    section: '.cta-section',
    heading: '.cta-copy',
    content: ['.avatar-cluster', '.cta-button']
  }
];

const revealMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealSections = sectionRevealConfigs.flatMap(({ section, heading, content }) => {
  const sectionElement = document.querySelector(section);
  if (!sectionElement) return [];

  const headingElement = sectionElement.querySelector(heading);
  const contentElements = content
    .map((selector) => sectionElement.querySelector(selector))
    .filter(Boolean);

  sectionElement.classList.add('js-reveal-section');
  headingElement?.classList.add('reveal-heading');
  contentElements.forEach((element, index) => {
    element.classList.add('reveal-content');
    element.style.setProperty('--reveal-delay', `${140 + index * 70}ms`);
  });

  return [sectionElement];
});

if (revealSections.length) {
  let sectionRevealObserver = null;

  const revealSection = (section) => {
    section.classList.add('is-revealed');
    sectionRevealObserver?.unobserve(section);
  };

  const revealAllSections = () => {
    revealSections.forEach(revealSection);
    sectionRevealObserver?.disconnect();
  };

  if (revealMotionPreference.matches || !('IntersectionObserver' in window)) {
    revealAllSections();
  } else {
    sectionRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealSection(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -14% 0px'
    });

    // Commit the hidden state before enabling transitions to prevent a load-time fade-out.
    void document.documentElement.offsetHeight;
    revealSections.forEach((section) => section.classList.add('is-reveal-ready'));

    window.requestAnimationFrame(() => {
      revealSections.forEach((section) => sectionRevealObserver.observe(section));
    });
  }

  revealSections.forEach((section) => {
    section.addEventListener('focusin', () => revealSection(section), { once: true });
  });

  revealMotionPreference.addEventListener('change', (event) => {
    if (event.matches) revealAllSections();
  });
}

const worldGrid = document.querySelector('.world-grid');

if (worldGrid) {
  const worldSection = worldGrid.closest('.world-section');
  const worldMessage = worldGrid.querySelector('.world-message');
  const worldPhotos = Array.from(worldGrid.querySelectorAll('img:not(.world-bg)'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopWorldMotion = window.matchMedia('(min-width: 1181px)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (value) => value * value * (3 - 2 * value);
  const worldEntryVectors = [
    { x: -620, y: -420, z: -210, rx: 15, ry: -18, rz: -13, delay: 0.00, scale: 0.76 },
    { x: -260, y: -580, z: -180, rx: -13, ry: -8, rz: 10, delay: 0.04, scale: 0.80 },
    { x: 360, y: 500, z: -230, rx: 14, ry: 16, rz: 12, delay: 0.08, scale: 0.74 },
    { x: -640, y: 70, z: -160, rx: -9, ry: -20, rz: -10, delay: 0.02, scale: 0.82 },
    { x: 620, y: 20, z: -220, rx: 8, ry: 22, rz: 11, delay: 0.09, scale: 0.76 },
    { x: 330, y: -520, z: -250, rx: -16, ry: 15, rz: 9, delay: 0.05, scale: 0.72 },
    { x: 650, y: -430, z: -190, rx: 12, ry: 21, rz: 14, delay: 0.01, scale: 0.79 },
    { x: 0, y: -590, z: -240, rx: -18, ry: 5, rz: -8, delay: 0.06, scale: 0.73 },
    { x: 650, y: 340, z: -170, rx: 11, ry: 19, rz: 13, delay: 0.03, scale: 0.81 },
    { x: -580, y: 470, z: -230, rx: 16, ry: -17, rz: -14, delay: 0.10, scale: 0.74 },
    { x: -300, y: 540, z: -200, rx: -14, ry: -10, rz: 9, delay: 0.07, scale: 0.78 },
    { x: -670, y: -140, z: -190, rx: 10, ry: -22, rz: -12, delay: 0.035, scale: 0.79 },
    { x: 90, y: 590, z: -260, rx: -18, ry: 9, rz: 10, delay: 0.085, scale: 0.70 }
  ];
  let photoGeometry = [];
  let gridGeometry = null;
  let latestPointer = null;
  let tiltFrame = null;
  let worldScrollFrame = null;
  let worldScrollProgress = 0;

  const canUseScrollMotion = () => desktopWorldMotion.matches && !reducedMotion.matches;
  const canTilt = () => finePointer.matches && !reducedMotion.matches && worldScrollProgress >= 0.985;

  const setWorldPhotoProgress = (photo, vector, progress) => {
    const eased = smoothstep(progress);
    const remaining = 1 - eased;
    const opacity = smoothstep(clamp(progress / 0.28));
    const startScale = vector.scale ?? 0.76;

    photo.style.setProperty('--world-scroll-x', `${(vector.x * remaining).toFixed(2)}px`);
    photo.style.setProperty('--world-scroll-y', `${(vector.y * remaining).toFixed(2)}px`);
    photo.style.setProperty('--world-scroll-z', `${(vector.z * remaining).toFixed(2)}px`);
    photo.style.setProperty('--world-scroll-rx', `${(vector.rx * remaining).toFixed(2)}deg`);
    photo.style.setProperty('--world-scroll-ry', `${(vector.ry * remaining).toFixed(2)}deg`);
    photo.style.setProperty('--world-scroll-rz', `${(vector.rz * remaining).toFixed(2)}deg`);
    photo.style.setProperty('--world-scroll-scale', (startScale + (1 - startScale) * eased).toFixed(4));
    photo.style.setProperty('--world-scroll-opacity', opacity.toFixed(4));
    photo.style.setProperty('--world-scroll-blur', `${(10 * remaining).toFixed(2)}px`);
  };

  const setWorldMessageProgress = (progress) => {
    if (!worldMessage) return;
    const eased = smoothstep(progress);
    const remaining = 1 - eased;
    worldMessage.style.setProperty('--world-message-opacity', eased.toFixed(4));
    worldMessage.style.setProperty('--world-message-y', `${(82 * remaining).toFixed(2)}px`);
    worldMessage.style.setProperty('--world-message-z', `${(-100 * remaining).toFixed(2)}px`);
    worldMessage.style.setProperty('--world-message-rotate-x', `${(10 * remaining).toFixed(2)}deg`);
    worldMessage.style.setProperty('--world-message-scale', (0.92 + 0.08 * eased).toFixed(4));
    worldMessage.style.setProperty('--world-message-blur', `${(8 * remaining).toFixed(2)}px`);
  };

  const settleWorldScene = () => {
    worldScrollProgress = 1;
    worldPhotos.forEach((photo, index) => {
      setWorldPhotoProgress(photo, worldEntryVectors[index] ?? worldEntryVectors[0], 1);
    });
    setWorldMessageProgress(1);
    worldSection?.classList.remove('is-world-scrolling');
  };

  const updateWorldScrollMotion = () => {
    worldScrollFrame = null;

    if (!canUseScrollMotion()) {
      worldSection?.classList.remove('is-scroll-driven', 'is-world-scrolling');
      settleWorldScene();
      return;
    }

    worldSection?.classList.add('is-scroll-driven');
    const gridBounds = worldGrid.getBoundingClientRect();
    const startLine = window.innerHeight * 0.94;
    const endLine = Math.max((siteHeader?.offsetHeight ?? 65) + 28, window.innerHeight * 0.12);
    worldScrollProgress = clamp((startLine - gridBounds.top) / Math.max(1, startLine - endLine));
    worldSection?.classList.toggle('is-world-scrolling', worldScrollProgress > 0.001 && worldScrollProgress < 0.985);

    worldPhotos.forEach((photo, index) => {
      const vector = worldEntryVectors[index] ?? worldEntryVectors[0];
      const photoEnd = 0.82;
      const localProgress = clamp((worldScrollProgress - vector.delay) / Math.max(0.01, photoEnd - vector.delay));
      setWorldPhotoProgress(photo, vector, localProgress);
    });

    // Let the message settle while the portrait block is still centered in the viewport,
    // rather than waiting for the final few pixels of the scroll choreography.
    setWorldMessageProgress(clamp((worldScrollProgress - 0.62) / 0.16));

    if (worldScrollProgress < 0.985 && worldGrid.classList.contains('is-tilting')) {
      resetWorldTilt();
    }
  };

  const requestWorldScrollUpdate = () => {
    if (worldScrollFrame !== null) return;
    worldScrollFrame = window.requestAnimationFrame(updateWorldScrollMotion);
  };

  const cacheWorldGeometry = () => {
    gridGeometry = worldGrid.getBoundingClientRect();
    photoGeometry = worldPhotos.map((photo) => {
      const bounds = photo.getBoundingClientRect();
      return {
        photo,
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2
      };
    });
  };

  const resetWorldTilt = () => {
    if (tiltFrame !== null) window.cancelAnimationFrame(tiltFrame);
    tiltFrame = null;
    latestPointer = null;
    gridGeometry = null;
    photoGeometry = [];
    worldGrid.classList.remove('is-tilting');
    worldGrid.style.setProperty('--world-scene-x', '50%');
    worldGrid.style.setProperty('--world-scene-y', '50%');

    worldPhotos.forEach((photo) => {
      photo.style.setProperty('--world-depth', '1');
      photo.style.setProperty('--world-lift', '0px');
      photo.style.setProperty('--world-pointer-x', '0px');
      photo.style.setProperty('--world-pointer-y', '0px');
      photo.style.setProperty('--world-scale', '1');
      photo.style.setProperty('--world-tilt-x', '0deg');
      photo.style.setProperty('--world-tilt-y', '0deg');
      photo.style.setProperty('--world-light', '1');
      photo.style.setProperty('--world-saturation', '1');
    });
  };

  const renderWorldTilt = () => {
    tiltFrame = null;
    if (!latestPointer || !gridGeometry || !canTilt()) return;

    const influenceRadius = Math.min(520, Math.max(340, gridGeometry.width * 0.42));
    const sceneX = Math.min(100, Math.max(0, (latestPointer.x - gridGeometry.left) / gridGeometry.width * 100));
    const sceneY = Math.min(100, Math.max(0, (latestPointer.y - gridGeometry.top) / gridGeometry.height * 100));
    worldGrid.style.setProperty('--world-scene-x', `${sceneX.toFixed(2)}%`);
    worldGrid.style.setProperty('--world-scene-y', `${sceneY.toFixed(2)}%`);

    photoGeometry.forEach(({ photo, centerX, centerY }) => {
      const deltaX = latestPointer.x - centerX;
      const deltaY = latestPointer.y - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const proximity = Math.max(0, 1 - distance / influenceRadius);
      const influence = proximity * proximity * (3 - 2 * proximity);
      const inverseDistance = distance > 0.5 ? 1 / distance : 0;
      const tiltX = -deltaY * inverseDistance * 7 * influence;
      const tiltY = deltaX * inverseDistance * 7 * influence;
      const attractX = (latestPointer.x - gridGeometry.left - gridGeometry.width / 2) / gridGeometry.width * 14 * influence;
      const attractY = (latestPointer.y - gridGeometry.top - gridGeometry.height / 2) / gridGeometry.height * 10 * influence;

      photo.style.setProperty('--world-depth', String(1 + Math.round(influence * 9)));
      photo.style.setProperty('--world-lift', `${(influence * 16).toFixed(2)}px`);
      photo.style.setProperty('--world-pointer-x', `${attractX.toFixed(2)}px`);
      photo.style.setProperty('--world-pointer-y', `${attractY.toFixed(2)}px`);
      photo.style.setProperty('--world-scale', (1 + influence * 0.012).toFixed(4));
      photo.style.setProperty('--world-tilt-x', `${tiltX.toFixed(2)}deg`);
      photo.style.setProperty('--world-tilt-y', `${tiltY.toFixed(2)}deg`);
      photo.style.setProperty('--world-light', (1 + influence * 0.045).toFixed(3));
      photo.style.setProperty('--world-saturation', (1 + influence * 0.06).toFixed(3));
    });
  };

  const requestWorldTilt = () => {
    if (tiltFrame !== null) return;
    tiltFrame = window.requestAnimationFrame(renderWorldTilt);
  };

  const updateWorldPointer = (event) => {
    if (!canTilt()) return;
    if (!gridGeometry) cacheWorldGeometry();
    latestPointer = { x: event.clientX, y: event.clientY };
    worldGrid.classList.add('is-tilting');
    requestWorldTilt();
  };

  worldGrid.addEventListener('pointerenter', (event) => {
    if (!canTilt()) return;
    cacheWorldGeometry();
    updateWorldPointer(event);
  });
  worldGrid.addEventListener('pointermove', updateWorldPointer, { passive: true });
  worldGrid.addEventListener('pointerleave', resetWorldTilt);
  worldGrid.addEventListener('pointercancel', resetWorldTilt);
  window.addEventListener('scroll', () => {
    if (worldGrid.classList.contains('is-tilting')) resetWorldTilt();
    requestWorldScrollUpdate();
  }, { passive: true });
  window.addEventListener('resize', () => {
    resetWorldTilt();
    requestWorldScrollUpdate();
  });
  finePointer.addEventListener('change', resetWorldTilt);
  reducedMotion.addEventListener('change', () => {
    resetWorldTilt();
    requestWorldScrollUpdate();
  });
  desktopWorldMotion.addEventListener('change', requestWorldScrollUpdate);
  requestWorldScrollUpdate();
}

const conversationWall = document.querySelector('[data-conversation-wall]');

if (conversationWall) {
  const conversationTiles = Array.from(conversationWall.querySelectorAll('.conversation-tile'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wallBounds = null;
  let tileGeometry = [];
  let latestPointer = null;
  let wallFrame = null;

  const canAttract = () => finePointer.matches && !reducedMotion.matches;

  const cacheWallGeometry = () => {
    wallBounds = conversationWall.getBoundingClientRect();
    tileGeometry = conversationTiles.map((tile) => {
      const bounds = tile.getBoundingClientRect();
      return { tile, centerX: bounds.left + bounds.width / 2, centerY: bounds.top + bounds.height / 2 };
    });
  };

  const resetWallAttraction = () => {
    if (wallFrame !== null) window.cancelAnimationFrame(wallFrame);
    wallFrame = null;
    wallBounds = null;
    tileGeometry = [];
    latestPointer = null;
    conversationWall.classList.remove('is-attracting');
    conversationTiles.forEach((tile) => {
      tile.style.setProperty('--conversation-x', '0px');
      tile.style.setProperty('--conversation-y', '0px');
      tile.style.setProperty('--conversation-rx', '0deg');
      tile.style.setProperty('--conversation-ry', '0deg');
      tile.style.setProperty('--conversation-scale', '1');
    });
  };

  const renderWallAttraction = () => {
    wallFrame = null;
    if (!latestPointer || !wallBounds || !canAttract()) return;
    const influenceRadius = Math.min(360, Math.max(230, wallBounds.width * 0.28));

    tileGeometry.forEach(({ tile, centerX, centerY }) => {
      const deltaX = latestPointer.x - centerX;
      const deltaY = latestPointer.y - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const proximity = Math.max(0, 1 - distance / influenceRadius);
      const influence = proximity * proximity * (3 - 2 * proximity);
      tile.style.setProperty('--conversation-x', `${(deltaX * influence * 0.018).toFixed(2)}px`);
      tile.style.setProperty('--conversation-y', `${(deltaY * influence * 0.014).toFixed(2)}px`);
      tile.style.setProperty('--conversation-rx', `${(-deltaY * influence * 0.018).toFixed(2)}deg`);
      tile.style.setProperty('--conversation-ry', `${(deltaX * influence * 0.018).toFixed(2)}deg`);
      tile.style.setProperty('--conversation-scale', (1 + influence * 0.015).toFixed(4));
    });
  };

  const requestWallAttraction = () => {
    if (wallFrame !== null) return;
    wallFrame = window.requestAnimationFrame(renderWallAttraction);
  };

  conversationWall.addEventListener('pointerenter', (event) => {
    if (!canAttract()) return;
    cacheWallGeometry();
    latestPointer = { x: event.clientX, y: event.clientY };
    conversationWall.classList.add('is-attracting');
    requestWallAttraction();
  });

  conversationWall.addEventListener('pointermove', (event) => {
    if (!canAttract()) return;
    if (!wallBounds) cacheWallGeometry();
    latestPointer = { x: event.clientX, y: event.clientY };
    requestWallAttraction();
  }, { passive: true });

  conversationWall.addEventListener('pointerleave', resetWallAttraction);
  conversationWall.addEventListener('pointercancel', resetWallAttraction);
  window.addEventListener('scroll', resetWallAttraction, { passive: true });
  window.addEventListener('resize', resetWallAttraction);
  finePointer.addEventListener('change', resetWallAttraction);
  reducedMotion.addEventListener('change', resetWallAttraction);
}

const stepsCarousel = document.querySelector('[data-steps-carousel]');

if (stepsCarousel) {
  const stepItems = Array.from(stepsCarousel.querySelectorAll('[data-step-item]'));
  const stepCards = stepsCarousel.querySelector('[data-step-cards]');
  const fineStepPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let expandTimer = null;

  const clearExpandTimer = () => {
    if (expandTimer === null) return;
    window.clearTimeout(expandTimer);
    expandTimer = null;
  };

  const setExpandedStep = (index = null) => {
    if (!stepCards) return;
    if (index === null) stepCards.removeAttribute('data-expanded');
    else stepCards.setAttribute('data-expanded', String(index));
  };

  const scheduleExpandedStep = (index) => {
    clearExpandTimer();
    expandTimer = window.setTimeout(() => {
      setExpandedStep(index);
      expandTimer = null;
    }, 130);
  };

  stepItems.forEach((item, index) => {
    item.addEventListener('pointerenter', (event) => {
      if (fineStepPointer.matches && (event.pointerType === 'mouse' || event.pointerType === 'pen')) {
        scheduleExpandedStep(index);
      } else {
        clearExpandTimer();
        setExpandedStep(index);
      }
    });
    item.addEventListener('pointerleave', clearExpandTimer);
    item.addEventListener('focusin', () => {
      clearExpandTimer();
      setExpandedStep(index);
    });
  });

  stepCards?.addEventListener('pointerleave', () => {
    clearExpandTimer();
    setExpandedStep();
  });
  stepCards?.addEventListener('focusout', (event) => {
    if (stepCards.contains(event.relatedTarget)) return;
    clearExpandTimer();
    setExpandedStep();
  });
}

const peopleCarousel = document.querySelector('[data-people-carousel]');
const peopleTabs = Array.from(document.querySelectorAll('.filter-tabs [role="tab"]'));

if (peopleCarousel && peopleTabs.length) {
  const peopleScroller = peopleCarousel.querySelector('.people-scroller');
  const peopleTrack = peopleCarousel.querySelector('.people-track');
  const previousButton = peopleCarousel.querySelector('.people-arrow-left');
  const nextButton = peopleCarousel.querySelector('.people-arrow-right');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const profiles = [
    { image: 'assets/figma/imgCard.png', name: 'John Smith' },
    { image: 'assets/figma/imgCard1.png', name: 'Amanda White' },
    { image: 'assets/figma/imgCard2.png', name: 'Jennifer Lee' },
    { image: 'assets/figma/imgCard3.png', name: 'Jessica Martinez' },
    { image: 'assets/figma/imgCard4.png', name: 'Matthew Wilson' },
    { image: 'assets/figma/imgCard5.png', name: 'Daniel Kim' },
    { image: 'assets/figma/imgRectangle2278.png', name: 'Naomi Brooks' },
    { image: 'assets/figma/imgRectangle2281.png', name: 'Ethan Clark' },
    { image: 'assets/figma/imgRectangle2283.png', name: 'Mia Chen' },
    { image: 'assets/figma/imgRectangle2299.png', name: 'Oliver Stone' },
    { image: 'assets/figma/imgRectangle2285.png', name: 'Sofia Rivera' },
    { image: 'assets/figma/imgRectangle2287.png', name: 'Lucas Martin' },
    { image: 'assets/figma/imgRectangle2300.png', name: 'Ava Johnson' },
    { image: 'assets/figma/imgRectangle2324.png', name: 'Noah Williams' },
    { image: 'assets/figma/imgRectangle2330.png', name: 'Chloe Davis' }
  ];
  const gameCovers = [
    'assets/figma/game-cover-01.png',
    'assets/figma/game-cover-02.png',
    'assets/figma/game-cover-03.png',
    'assets/figma/game-cover-04.png',
    'assets/figma/game-cover-05.png',
    'assets/figma/game-cover-06.png'
  ];
  const categories = {
    video: {
      label: 'Video chat',
      order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      status: 'online',
      countLabel: 'Call',
      counts: ['3.8k', '5.2k', '2.9k', '4.6k', '3.1k', '2.4k', '5.8k', '3.6k', '4.1k', '2.7k', '4.4k', '3.3k', '5.5k', '2.6k', '4.9k'],
      tags: [['Game', 'Travel', 'Cute'], ['Music', 'Travel', 'Art'], ['Movies', 'Style', 'Fun'], ['Food', 'Home', 'Chat'], ['Photo', 'Travel', 'Music']]
    },
    live: {
      label: 'Live',
      order: [6, 2, 8, 1, 3, 7, 0, 9, 5, 4, 12, 14, 10, 13, 11],
      status: 'Live',
      countLabel: 'Follow',
      counts: ['3.8k', '6.7k', '5.9k', '5.2k', '4.8k', '4.1k', '8.4k', '3.3k', '2.9k', '2.4k', '7.2k', '6.1k', '4.5k', '3.6k', '2.7k'],
      tags: [['🎮Game', 'Travel', 'Cute'], ['Lifestyle', 'Q&A'], ['Travel', 'Live'], ['Cooking', 'Friends'], ['Culture', 'Talk']],
      actionLabel: 'Live Room',
      actionIcon: 'assets/figma/card-live-action.svg',
      featuredProfile: { image: 'assets/figma/card-live.png', name: 'LunaTalksLunaTalks' }
    },
    game: {
      label: 'Game',
      order: [5, 4, 7, 9, 0, 2, 1, 8, 6, 3, 11, 13, 10, 14, 12],
      covers: gameCovers,
      actionLabel: 'Play Game',
      actionIcon: 'assets/figma/card-game-action.svg',
      featuredProfile: { image: gameCovers[0], name: 'FlashFlash' }
    }
  };
  const autoScrollSpeed = 18;
  const autoScrollInterval = 32;
  let edgeFrameRequested = false;
  let cardVisibilityObserver = null;
  let carouselVisibilityObserver = null;
  let autoScrollTimer = null;
  let lastAutoScrollTime = null;
  let autoScrollPosition = 0;
  let manualScrollTimer = null;
  let loopWidth = 0;
  let isCarouselVisible = true;
  let isPointerOverCarousel = false;
  let isFocusWithinCarousel = false;
  let interactionPauseUntil = 0;

  const observeCardVisibility = () => {
    cardVisibilityObserver?.disconnect();
    cardVisibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.fullyVisible = String(entry.intersectionRatio >= 0.98);
        });
      },
      {
        root: peopleScroller,
        rootMargin: '0px -12px',
        threshold: [0, 0.98, 1]
      }
    );

    peopleTrack.querySelectorAll('.person-card').forEach((card) => {
      card.dataset.fullyVisible = 'false';
      cardVisibilityObserver.observe(card);
    });
  };

  const updateCarouselEdges = () => {
    edgeFrameRequested = false;
    const canLoop = loopWidth > 0;

    peopleCarousel.classList.toggle('can-scroll-left', canLoop);
    peopleCarousel.classList.toggle('can-scroll-right', canLoop);
    previousButton.disabled = !canLoop;
    nextButton.disabled = !canLoop;
  };

  const requestEdgeUpdate = () => {
    if (edgeFrameRequested) return;
    edgeFrameRequested = true;
    window.requestAnimationFrame(updateCarouselEdges);
  };

  const normalizeCarouselPosition = () => {
    if (!loopWidth) return;

    if (peopleScroller.scrollLeft >= loopWidth) {
      peopleScroller.scrollLeft %= loopWidth;
    } else if (peopleScroller.scrollLeft < 0) {
      peopleScroller.scrollLeft += loopWidth;
    }

    autoScrollPosition = peopleScroller.scrollLeft;
  };

  const syncLoopWidth = () => {
    const firstCard = peopleTrack.querySelector('.person-card:not([data-carousel-clone])');
    const firstClone = peopleTrack.querySelector('[data-carousel-clone]');
    loopWidth = firstCard && firstClone ? firstClone.offsetLeft - firstCard.offsetLeft : 0;
    normalizeCarouselPosition();
    requestEdgeUpdate();
  };

  const shouldAutoScroll = () => (
    !reducedMotion.matches
    && isCarouselVisible
    && !document.hidden
    && !isPointerOverCarousel
    && !isFocusWithinCarousel
    && performance.now() >= interactionPauseUntil
  );

  const stopAutoScroll = () => {
    if (autoScrollTimer !== null) window.clearInterval(autoScrollTimer);
    autoScrollTimer = null;
    lastAutoScrollTime = null;
  };

  const updateAutoScroll = () => {
    if (!shouldAutoScroll()) {
      stopAutoScroll();
      return;
    }

    if (autoScrollTimer === null) {
      lastAutoScrollTime = performance.now();
      autoScrollPosition = peopleScroller.scrollLeft;
      autoScrollTimer = window.setInterval(runAutoScroll, autoScrollInterval);
    }
  };

  const runAutoScroll = () => {
    if (!shouldAutoScroll()) {
      stopAutoScroll();
      return;
    }

    if (lastAutoScrollTime !== null && loopWidth) {
      const timestamp = performance.now();
      const elapsed = Math.min(timestamp - lastAutoScrollTime, 250);
      autoScrollPosition = (autoScrollPosition + autoScrollSpeed * elapsed / 1000) % loopWidth;
      peopleScroller.scrollLeft = autoScrollPosition;
      lastAutoScrollTime = timestamp;
    }
  };

  const pauseAfterInteraction = (duration = 1600) => {
    interactionPauseUntil = performance.now() + duration;
    stopAutoScroll();
    window.setTimeout(updateAutoScroll, duration + 20);
  };

  const renderPeople = (categoryKey, animate = true) => {
    const category = categories[categoryKey];
    const createCard = (profileIndex, index, isClone = false) => {
      const baseProfile = index === 0 && category.featuredProfile
        ? category.featuredProfile
        : profiles[profileIndex];
      const profile = category.covers?.length
        ? { ...baseProfile, image: category.covers[index % category.covers.length] }
        : baseProfile;
      const tags = category.tags?.[index % category.tags.length] ?? [];
      const isLiveCard = categoryKey === 'live';
      const isGameCard = categoryKey === 'game';
      const actionLabel = category.actionLabel ?? 'Start Chat';
      const actionIcon = category.actionIcon ?? 'assets/figma/imgUnion1.svg';
      const actionAriaLabel = isGameCard
        ? `Play ${profile.name}`
        : isLiveCard
          ? `Enter ${profile.name}'s live room`
          : `Start chat with ${profile.name}`;
      const cloneAttributes = isClone
        ? 'data-carousel-clone aria-hidden="true" tabindex="-1"'
        : `tabindex="0" aria-posinset="${index + 1}" aria-setsize="${category.order.length}"`;
      const imageAlt = isClone ? '' : profile.name;
      const linkTabIndex = isClone ? ' tabindex="-1"' : '';
      const statusMarkup = isGameCard
        ? ''
        : `<span class="status">${isLiveCard ? '<span class="status-dot" aria-hidden="true"></span>' : '<img src="assets/figma/imgGroup2147228530.svg" alt="" />'}${category.status}</span>`;
      const countMarkup = isGameCard
        ? ''
        : `<span class="call-count">${category.counts[index]} ${category.countLabel}</span>`;
      const genderMarkup = isGameCard
        ? ''
        : ' <span class="gender-icon"><img src="assets/figma/imgUnion.svg" alt="" /></span>';
      const tagsMarkup = isGameCard
        ? ''
        : `<small>${tags.map((tag) => `<em>${tag}</em>`).join('')}</small>`;

      return `
        <article class="person-card person-card-${categoryKey}" data-card-category="${categoryKey}" ${cloneAttributes}>
          <img src="${profile.image}" alt="${imageAlt}" loading="lazy" />
          ${statusMarkup}
          ${countMarkup}
          <a class="start-card" href="#cta" aria-label="${actionAriaLabel}"${linkTabIndex}><img src="${actionIcon}" alt="" />${actionLabel}</a>
          <div class="person-card-meta">
            <strong>${profile.name}${genderMarkup}</strong>
            ${tagsMarkup}
          </div>
        </article>`;
    };
    const cards = category.order.map((profileIndex, index) => createCard(profileIndex, index));
    const cloneCards = category.order.map((profileIndex, index) => createCard(profileIndex, index, true));

    stopAutoScroll();
    peopleTrack.innerHTML = [...cards, ...cloneCards].join('');
    peopleTrack.setAttribute('aria-label', `${category.label} people, 15 profiles`);
    peopleScroller.setAttribute('aria-label', `${category.label} people, 15 profiles`);
    peopleScroller.scrollTo({ left: 0, behavior: 'auto' });
    observeCardVisibility();
    window.requestAnimationFrame(() => {
      syncLoopWidth();
      updateAutoScroll();
    });

    if (animate && !reducedMotion.matches) {
      peopleTrack.animate(
        [
          { opacity: 0.35, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }

  };

  const activateTab = (tab) => {
    if (tab.getAttribute('aria-selected') === 'true') return;

    peopleTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    renderPeople(tab.dataset.category);
  };

  peopleTabs.forEach((tab, index) => {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + peopleTabs.length) % peopleTabs.length;
      peopleTabs[nextIndex].focus();
      activateTab(peopleTabs[nextIndex]);
    });
  });

  const scrollCarousel = (direction) => {
    const distance = Math.max(254, peopleScroller.clientWidth * 0.82);
    if (direction < 0 && peopleScroller.scrollLeft < distance) {
      peopleScroller.scrollLeft += loopWidth;
    }
    pauseAfterInteraction();
    peopleScroller.scrollBy({
      left: direction * distance,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  };

  previousButton.addEventListener('click', () => scrollCarousel(-1));
  nextButton.addEventListener('click', () => scrollCarousel(1));
  peopleCarousel.addEventListener('pointerenter', () => {
    isPointerOverCarousel = true;
    stopAutoScroll();
  });
  peopleCarousel.addEventListener('pointerleave', () => {
    isPointerOverCarousel = false;
    updateAutoScroll();
  });
  peopleScroller.addEventListener('pointerdown', () => pauseAfterInteraction(2200));
  peopleScroller.addEventListener('wheel', () => pauseAfterInteraction(1800), { passive: true });
  peopleScroller.addEventListener('scroll', () => {
    window.clearTimeout(manualScrollTimer);
    manualScrollTimer = window.setTimeout(normalizeCarouselPosition, 140);
  }, { passive: true });
  peopleTrack.addEventListener('focusin', (event) => {
    isFocusWithinCarousel = true;
    stopAutoScroll();
    const card = event.target.closest('.person-card');
    if (!card || card.dataset.fullyVisible === 'true') return;
    card.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  });
  peopleTrack.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      isFocusWithinCarousel = peopleCarousel.contains(document.activeElement);
      updateAutoScroll();
    });
  });
  document.addEventListener('visibilitychange', updateAutoScroll);
  reducedMotion.addEventListener('change', updateAutoScroll);
  window.addEventListener('resize', () => window.requestAnimationFrame(syncLoopWidth));

  if ('IntersectionObserver' in window) {
    carouselVisibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isCarouselVisible = entry.isIntersecting;
        updateAutoScroll();
      },
      { threshold: 0.05 }
    );
    carouselVisibilityObserver.observe(peopleCarousel);
  }

  renderPeople('video', false);
}
