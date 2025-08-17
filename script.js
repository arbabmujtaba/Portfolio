// script.js — small, dependency-free interactions (menu, theme, reveal, year)
(function () {
  const html = document.documentElement;
  // remove no-js class
  html.classList.remove('no-js');

  // ---------- YEAR ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  html.dataset.theme = initialTheme;

  function updateThemeUI() {
    const isLight = html.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    // update icons visibility via CSS (we leave the SVGs in DOM)
  }
  updateThemeUI();

  themeToggle?.addEventListener('click', () => {
    const next = html.dataset.theme === 'light' ? 'dark' : 'light';
    html.dataset.theme = next;
    localStorage.setItem('theme', next);
    updateThemeUI();
  });

  // ---------- MOBILE MENU ----------
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');

  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    // toggle nav visibility
    if (!expanded) {
      navList.style.display = 'flex';
      navList.style.flexDirection = 'column';
      navList.style.position = 'absolute';
      navList.style.right = '14px';
      navList.style.top = '64px';
      navList.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-2');
      navList.style.padding = '12px';
      navList.style.borderRadius = '12px';
      navList.style.boxShadow = '0 20px 50px rgba(0,0,0,0.45)';
    } else {
      navList.removeAttribute('style');
    }
  });

  // Auto-close menu when a nav link is clicked (mobile)
  navList?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.click();
      }
    });
  });

  // ---------- SMOOTH SCROLL (native + polyfill fallback) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (ev) {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#0') return;
      const target = document.querySelector(href);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      window.setTimeout(() => target.removeAttribute('tabindex'), 1200);
    });
  });

  // ---------- REVEAL ON SCROLL ----------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    // reveal all immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
  }

})();
