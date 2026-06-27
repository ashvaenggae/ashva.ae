/* Ashva site — interactions */
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!window.location.hash) window.scrollTo(0, 0);

  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const heroCanvas = document.getElementById('heroCanvas');
  const toggle = document.querySelector('.nav__toggle');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scrolled state */
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll-led hero scene */
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const structureFrameCount = 120;
  const slowArchitectureFrames = 16;
  const slowArchitectureFactor = 2.5;
  const zoomOneFrameCount = 57;
  const zoomTwoFrames = [
    ...Array.from({ length: 66 }, (_, index) => index + 23),
    ...Array.from({ length: 10 }, (_, index) => index + 111)
  ];
  const zoomTwoFrameCount = zoomTwoFrames.length;
  const interiorFrameCount = 240;
  const frameCount = 1 + structureFrameCount + zoomOneFrameCount + zoomTwoFrameCount + interiorFrameCount;
  const structureStartFrame = 2;
  const structureEndFrame = structureStartFrame + structureFrameCount - 1;
  const zoomOneStartFrame = structureEndFrame + 1;
  const zoomTwoStartFrame = zoomOneStartFrame + zoomOneFrameCount;
  const mepEndFrame = zoomTwoStartFrame + zoomTwoFrameCount - 1;
  const interiorStartFrame = mepEndFrame + 1;
  const introHoldProgress = 0.1;
  const textRevealFrames = 15;
  const introTextHoldFrames = 24;
  const structureTextHoldFrames = 44;
  const mepTextHoldFrames = 58;
  const interiorTextHoldFrames = 60;
  const introTextStartFrame = 2;
  const introTextFadeFrames = 26;
  const introFrameSrc = 'assets/images/ashva-opening-frame.jpg';
  const frameBase = 'assets/images/RB69_arch_to_structure_120_frames';
  const zoomFrameBase = 'assets/images/RB69_smooth_zoom_direct_to_Z2_frames';
  const interiorFrameBase = 'assets/images/RB69_finishes_furnishing_240_frames/RB69_finishes_furnishing_240_frames';
  const frames = new Array(frameCount + 1);
  const loadingFrames = new Set();
  const heroCtx = heroCanvas?.getContext('2d');
  let currentFrame = 0;
  let wantedFrame = 1;
  let heroTicking = false;
  let canvasWidth = 0;
  let canvasHeight = 0;
  const frameSrc = frame => {
    if (frame === 1) return introFrameSrc;
    if (frame <= structureEndFrame) {
      return `${frameBase}/frame_${String(frame - 1).padStart(3, '0')}.jpg`;
    }
    if (frame < zoomTwoStartFrame) {
      const zoomOneFrame = frame - zoomOneStartFrame + 1;
      return `${zoomFrameBase}/1/frame_${String(zoomOneFrame).padStart(3, '0')}.jpg`;
    }
    if (frame < interiorStartFrame) {
      const zoomTwoFrame = zoomTwoFrames[frame - zoomTwoStartFrame];
      return `${zoomFrameBase}/2/frame_${String(zoomTwoFrame).padStart(3, '0')}.jpg`;
    }

    const interiorFrame = frame - interiorStartFrame + 1;
    return `${interiorFrameBase}/frame_${String(interiorFrame).padStart(3, '0')}.jpg`;
  };

  const easedFrameFromProgress = progress => {
    const totalUnits = frameCount - 2;
    const slowUnits = slowArchitectureFrames * slowArchitectureFactor;
    const normalUnits = totalUnits - slowArchitectureFrames;
    const weightedTotal = slowUnits + normalUnits;
    const weightedProgress = progress * weightedTotal;

    if (weightedProgress <= slowUnits) {
      return 2 + Math.round(weightedProgress / slowArchitectureFactor);
    }

    return 2 + slowArchitectureFrames + Math.round(weightedProgress - slowUnits);
  };

  const drawCover = img => {
    if (!heroCanvas || !heroCtx || !img) return;

    const canvasRatio = canvasWidth / canvasHeight;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    if (imageRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    heroCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    heroCtx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
  };

  const nearestLoadedFrame = frame => {
    if (frames[frame]) return frame;

    for (let offset = 1; offset < frameCount; offset += 1) {
      const before = frame - offset;
      const after = frame + offset;
      if (before >= 1 && frames[before]) return before;
      if (after <= frameCount && frames[after]) return after;
    }

    return 0;
  };

  const renderHeroFrame = frame => {
    const loadedFrame = nearestLoadedFrame(frame);
    if (!loadedFrame || loadedFrame === currentFrame) return;

    currentFrame = loadedFrame;
    drawCover(frames[loadedFrame]);
  };

  const loadFrame = frame => {
    const safeFrame = clamp(frame, 1, frameCount);
    if (frames[safeFrame] || loadingFrames.has(safeFrame)) return Promise.resolve();

    loadingFrames.add(safeFrame);
    const img = new Image();
    img.decoding = 'async';
    img.src = frameSrc(safeFrame);

    return new Promise(resolve => {
      img.onload = () => {
        frames[safeFrame] = img;
        loadingFrames.delete(safeFrame);
        if (Math.abs(safeFrame - wantedFrame) <= 1 || !currentFrame) {
          renderHeroFrame(wantedFrame);
        }
        resolve();
      };
      img.onerror = () => {
        loadingFrames.delete(safeFrame);
        resolve();
      };
    });
  };

  const loadFrames = (start, end, concurrency = 8) => {
    let next = start;
    const worker = async () => {
      while (next <= end) {
        const frame = next;
        next += 1;
        await loadFrame(frame);
      }
    };

    for (let i = 0; i < concurrency; i += 1) worker();
  };

  const sizeHeroCanvas = () => {
    if (!heroCanvas) return;

    const rect = heroCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (nextWidth === canvasWidth && nextHeight === canvasHeight) return;

    canvasWidth = nextWidth;
    canvasHeight = nextHeight;
    heroCanvas.width = canvasWidth;
    heroCanvas.height = canvasHeight;
    renderHeroFrame(wantedFrame);
  };

  const updateHero = () => {
    if (!hero || !heroCanvas || !heroCtx) return;

    const rect = hero.getBoundingClientRect();
    const scrollRange = Math.max(1, rect.height - window.innerHeight);
    const progress = reduceMotion ? 0 : clamp(-rect.top / scrollRange, 0, 1);
    const animationProgress = clamp((progress - introHoldProgress) / (1 - introHoldProgress), 0, 1);
    const canvasOpacity = clamp((progress - introHoldProgress) / 0.025, 0, 1);
    const nextFrame = progress <= introHoldProgress
      ? 1
      : clamp(easedFrameFromProgress(animationProgress), 2, frameCount);
    const structureTextStartFrame = structureEndFrame - structureTextHoldFrames + 1;
    const structureTextInEndFrame = structureTextStartFrame + textRevealFrames - 1;
    const structureTextIn = clamp((nextFrame - structureTextStartFrame) / (textRevealFrames - 1), 0, 1);
    const structureTextOut = clamp(1 - ((nextFrame - structureEndFrame) / textRevealFrames), 0, 1);
    const structureTextProgress = nextFrame <= structureTextInEndFrame
      ? structureTextIn
      : nextFrame <= structureEndFrame
        ? 1
        : structureTextOut;
    const mepTextStartFrame = mepEndFrame - mepTextHoldFrames + 1;
    const mepTextInEndFrame = mepTextStartFrame + textRevealFrames - 1;
    const mepTextIn = clamp((nextFrame - mepTextStartFrame) / (textRevealFrames - 1), 0, 1);
    const mepTextOut = clamp(1 - ((nextFrame - mepEndFrame) / textRevealFrames), 0, 1);
    const mepTextProgress = nextFrame <= mepTextInEndFrame
      ? mepTextIn
      : nextFrame <= mepEndFrame
        ? 1
        : mepTextOut;
    const interiorTextStartFrame = frameCount - interiorTextHoldFrames + 1;
    const interiorTextProgress = clamp((nextFrame - interiorTextStartFrame) / (textRevealFrames - 1), 0, 1);
    const introTextProgress = nextFrame < introTextStartFrame
      ? 0
      : nextFrame <= introTextStartFrame + introTextHoldFrames
        ? 1
        : clamp(1 - ((nextFrame - introTextStartFrame - introTextHoldFrames) / introTextFadeFrames), 0, 1);

    hero.style.setProperty('--hero-progress', progress.toFixed(3));
    hero.style.setProperty('--hero-canvas-opacity', canvasOpacity.toFixed(3));
    hero.style.setProperty('--hero-intro-text-progress', introTextProgress.toFixed(3));
    hero.style.setProperty('--hero-structure-text-progress', structureTextProgress.toFixed(3));
    hero.style.setProperty('--hero-mep-text-progress', mepTextProgress.toFixed(3));
    hero.style.setProperty('--hero-interior-text-progress', interiorTextProgress.toFixed(3));
    wantedFrame = nextFrame;
    loadFrame(wantedFrame);
    renderHeroFrame(wantedFrame);
  };
  const requestHeroUpdate = () => {
    if (heroTicking) return;
    heroTicking = true;
    window.requestAnimationFrame(() => {
      updateHero();
      heroTicking = false;
    });
  };

  sizeHeroCanvas();
  loadFrame(1).then(() => renderHeroFrame(1));
  loadFrames(2, frameCount);
  window.addEventListener('scroll', requestHeroUpdate, { passive: true });
  window.addEventListener('resize', () => {
    sizeHeroCanvas();
    requestHeroUpdate();
  });
  updateHero();

  /* Mobile menu */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  mobileLinks.forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    })
  );

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll(
    '.section .eyebrow, .h2, .lede, .value, .step, .service, .sector, .sector-card, .project, .contact__form, .cta-strip__inner, .milestone, .about__media, .authorities__list li'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* Footer year */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Contact form — client-side only demo handler */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('cf-note');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      if (!name || !email || !msg) {
        note.textContent = 'Please fill out name, email and a brief message.';
        note.style.color = '#8a5a32';
        return;
      }
      // Fallback: compose a mailto so submissions reach the studio even without a backend.
      const subject = encodeURIComponent(`New enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${form.phone.value}\nType: ${form.type.value}\n\n${msg}`
      );
      window.location.href = `mailto:info@ashva.ae?subject=${subject}&body=${body}`;
      note.textContent = 'Opening your email client to send this enquiry…';
      note.style.color = '#3a4048';
      form.reset();
    });
  }
})();
