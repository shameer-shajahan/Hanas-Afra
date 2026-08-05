(() => {
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasHover) document.body.classList.add('no-hover');

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pre = document.querySelector('.preloader');
    setTimeout(() => {
      pre.classList.add('hide');
      document.querySelector('.hero-title')?.classList.add('in-view');
    }, 600);
  });

  /* ---------- Split text into letters ---------- */
  document.querySelectorAll('.split-text').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(span);
    });
  });

  /* ---------- Custom cursor ---------- */
  if (hasHover) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('a,button,.gallery-item,.time-box').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
  }

  /* ---------- Scroll progress + nav solid + back-to-top ---------- */
  const progress = document.querySelector('.progress-bar');
  const navbar = document.querySelector('.navbar');
  const toTop = document.querySelector('.to-top');
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
  const onScroll = () => {
    const h = document.documentElement;
    const maxScroll = h.scrollHeight - h.clientHeight;
    const currentTop = Math.max(0, h.scrollTop);
    const pct = maxScroll > 0 ? (currentTop / maxScroll) * 100 : 0;
    const scrollingDown = currentTop > lastScrollTop;
    const scrollingUp = currentTop < lastScrollTop;
    progress.style.width = pct + '%';
    navbar.classList.toggle('solid', currentTop > 60);
    if (!navbar.classList.contains('menu-open')) {
      if (currentTop < 100 || scrollingDown) navbar.classList.add('nav-hidden');
      if (scrollingUp && currentTop >= 100) navbar.classList.remove('nav-hidden');
    }
    toTop.classList.toggle('show', currentTop > 700);
    lastScrollTop = currentTop;
  };
  document.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      navbar.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navbar.classList.toggle('menu-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navbar.classList.remove('nav-hidden');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (!navLinks.classList.contains('open')) return;
      if (!navbar.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroBg = document.querySelector('.hero-bg');
  const parallax = () => {
    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    document.querySelectorAll('.romantic-section .hero-bg').forEach(bg => {
      const rect = bg.parentElement.getBoundingClientRect();
      bg.style.transform = `translateY(${rect.top * 0.18}px)`;
    });
  };
  document.addEventListener('scroll', () => requestAnimationFrame(parallax), { passive: true });
  parallax();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .feature-image').forEach(el => revealObserver.observe(el));

  /* ---------- Magnetic buttons ---------- */
  if (hasHover) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- Countdown ---------- */
  const target = new Date('2026-08-16T11:00:00');
  const els = {
    d: document.querySelector('#cd-days .time-value'),
    h: document.querySelector('#cd-hours .time-value'),
    m: document.querySelector('#cd-mins .time-value'),
    s: document.querySelector('#cd-secs .time-value'),
  };
  const boxes = {
    d: document.querySelector('#cd-days'), h: document.querySelector('#cd-hours'),
    m: document.querySelector('#cd-mins'), s: document.querySelector('#cd-secs'),
  };
  let prev = {};
  const pad = n => String(n).padStart(2, '0');
  const updateCountdown = () => {
    const diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    const vals = { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
    Object.keys(vals).forEach(k => {
      if (els[k] && vals[k] !== prev[k]) {
        els[k].textContent = vals[k];
        boxes[k].classList.remove('flip');
        void boxes[k].offsetWidth;
        boxes[k].classList.add('flip');
        prev[k] = vals[k];
      }
    });
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Gallery lightbox ---------- */
  const galleryImgs = [...document.querySelectorAll('.gallery-item img')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  let currentIndex = 0;
  const openLightbox = (i) => {
    currentIndex = i;
    lightboxImg.src = galleryImgs[i].src;
    lightbox.classList.add('open');
  };
  const closeLightbox = () => lightbox.classList.remove('open');
  galleryImgs.forEach((img, i) => img.parentElement.addEventListener('click', () => openLightbox(i)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightbox.querySelector('.prev').addEventListener('click', () => openLightbox((currentIndex - 1 + galleryImgs.length) % galleryImgs.length));
  lightbox.querySelector('.next').addEventListener('click', () => openLightbox((currentIndex + 1) % galleryImgs.length));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % galleryImgs.length);
    if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + galleryImgs.length) % galleryImgs.length);
  });

  /* ---------- Falling leaves / petals / feathers ---------- */
  const fallLayer = document.querySelector('.fall-layer');
  const LEAF = '<svg viewBox="0 0 32 32" width="{s}" height="{s}"><path d="M16 2C8 8 4 16 8 26c6 2 14-2 18-10C30 8 24 2 16 2Z" fill="{c}" opacity="0.8"/><path d="M16 4v22" stroke="{c2}" stroke-width="1" opacity="0.5"/></svg>';
  const PETAL = '<svg viewBox="0 0 32 32" width="{s}" height="{s}"><path d="M16 4c6 0 10 5 10 11s-4 13-10 13S6 21 6 15 10 4 16 4Z" fill="{c}" opacity="0.85"/></svg>';
  const FEATHER = '<svg viewBox="0 0 32 40" width="{s}" height="{s}"><path d="M16 2c6 6 8 16 4 28-1 3-3 6-4 8-1-2-3-5-4-8-4-12-2-22 4-28Z" fill="{c}" opacity="0.75"/><path d="M16 6v30" stroke="{c2}" stroke-width="1" opacity="0.4"/></svg>';

  const palettes = {
    leaf: { svg: LEAF, colors: ['#7c8c6a', '#a8b896', '#4c5a3f'] },
    petal: { svg: PETAL, colors: ['#e7c6c6', '#d99a9a', '#f0d9d0'] },
    feather: { svg: FEATHER, colors: ['#e4c98a', '#f3ecdd', '#c6a15b'] },
  };
  const types = Object.keys(palettes);

  const spawnFallItem = (burst = false) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const p = palettes[type];
    const color = p.colors[Math.floor(Math.random() * p.colors.length)];
    const size = 14 + Math.random() * 16;
    const left = Math.random() * 100;
    const duration = 20 + Math.random() * 14;
    const sway = 30 + Math.random() * 50;
    const el = document.createElement('div');
    el.className = 'fall-item' + (burst ? ' burst' : '');
    el.style.left = left + 'vw';
    el.style.setProperty('--sway', sway + 'px');
    el.style.animationDuration = duration + 's';
    if (!burst) el.style.animationDelay = (-Math.random() * duration) + 's';
    el.innerHTML = p.svg.replace(/\{s\}/g, size).replace(/\{c\}/g, color).replace(/\{c2\}/g, color);
    fallLayer.appendChild(el);
    if (burst) el.addEventListener('animationend', () => el.remove());
  };

  for (let i = 0; i < 6; i++) spawnFallItem(false);

  const burstObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const count = window.innerWidth < 640 ? 2 : 3;
        for (let i = 0; i < count; i++) {
          setTimeout(() => spawnFallItem(true), i * 420);
        }
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.burst-trigger').forEach(el => burstObserver.observe(el));

  /* ---------- Background music ---------- */
  const bgm = document.getElementById('bgm');
  if (bgm) {
    const musicToggle = document.querySelector('.music-toggle');
    const musicStatus = musicToggle?.querySelector('.music-status');
    bgm.volume = 0.55;
    bgm.muted = false;

    const setMusicState = (state) => {
      if (!musicToggle) return;
      const isPlaying = state === 'playing';
      musicToggle.classList.toggle('is-playing', isPlaying);
      musicToggle.classList.toggle('needs-action', state === 'blocked');
      musicToggle.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      musicToggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
      if (musicStatus) {
        musicStatus.textContent = state === 'blocked' ? 'Tap to play song' : isPlaying ? 'Music playing' : 'Play song';
      }
    };

    const tryPlay = async (showBlocked = false) => {
      try {
        await bgm.play();
        setMusicState('playing');
        return true;
      } catch {
        setMusicState(showBlocked ? 'blocked' : 'paused');
        return false;
      }
    };

    musicToggle?.addEventListener('click', async () => {
      if (bgm.paused) {
        await tryPlay(true);
      } else {
        bgm.pause();
      }
    });

    bgm.addEventListener('play', () => setMusicState('playing'));
    bgm.addEventListener('pause', () => setMusicState('paused'));
    bgm.addEventListener('ended', () => setMusicState('paused'));

    const GESTURES = ['click', 'touchstart', 'pointerdown', 'mousedown', 'keydown'];
    const unlockOnGesture = async (event) => {
      if (event.target?.closest?.('.music-toggle')) return;
      if (bgm.paused) await tryPlay(true);
      if (!bgm.paused) {
        GESTURES.forEach(ev => document.removeEventListener(ev, unlockOnGesture));
      }
    };

    setMusicState('paused');
    tryPlay();
    window.addEventListener('load', () => tryPlay(true));
    setTimeout(() => tryPlay(true), 500);
    GESTURES.forEach(ev => document.addEventListener(ev, unlockOnGesture, { passive: true }));
  }

  /* ---------- Scroll-linked tilt (couple portrait only — rotating the gallery's
     multi-column items widens their axis-aligned bounding box and causes
     horizontal overflow on narrow screens) ---------- */
  const tiltEls = [...document.querySelectorAll('.couple-photo')];
  const tiltTick = () => {
    const vh = window.innerHeight;
    tiltEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const offset = (center - vh / 2) / vh;
      el.style.transform = `rotate(${offset * 2.2}deg)`;
    });
  };
  document.addEventListener('scroll', () => requestAnimationFrame(tiltTick), { passive: true });
  tiltTick();
})();
