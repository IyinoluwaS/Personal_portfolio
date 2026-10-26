// Shared by every page. Each feature checks that its elements exist first.
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Theme toggle ----------
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function storedTheme() {
  try { return localStorage.getItem('theme'); } catch { return null; }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

applyTheme(storedTheme() || (darkQuery.matches ? 'dark' : 'light'));
darkQuery.addEventListener('change', (event) => {
  if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

function wireThemeToggle(button) {
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* private mode: theme lasts for this page only */ }
  });
}
document.querySelectorAll('.theme-toggle').forEach(wireThemeToggle);

// ---------- Hamburger menu (home page) ----------
const menuButton = document.querySelector('.iconbtn');
const menu = document.getElementById('site-menu');

if (menuButton && menu) {
  const openIcon = menuButton.querySelector('.icon-open');
  const closeIcon = menuButton.querySelector('.icon-close');

  function setMenuOpen(isOpen) {
    menu.hidden = !isOpen;
    openIcon.hidden = isOpen;
    closeIcon.hidden = !isOpen;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  menuButton.addEventListener('click', () => setMenuOpen(menu.hidden));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

// ---------- Sticky nav that appears after the hero (home page) ----------
const hero = document.querySelector('.hero');
const topLinks = document.querySelector('.topbar .nav-links');

if (hero && topLinks) {
  const floatNav = document.createElement('nav');
  floatNav.className = 'float-nav';
  floatNav.setAttribute('aria-label', 'Sections');
  floatNav.inert = true;
  floatNav.append(document.querySelector('.topbar .logo').cloneNode(true), topLinks.cloneNode(true));
  const toggle = document.querySelector('.topbar .theme-toggle');
  if (toggle) {
    const toggleCopy = toggle.cloneNode(true);
    floatNav.append(toggleCopy);
    wireThemeToggle(toggleCopy);
  }
  document.body.append(floatNav);

  new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting;
    floatNav.classList.toggle('is-visible', show);
    floatNav.inert = !show;
  }, { rootMargin: '-120px 0px 0px 0px' }).observe(hero);
}

// ---------- Highlight the section being read ----------
function watchSections(sections, onActive) {
  const visible = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
    const current = sections.find((section) => visible.get(section));
    if (current) onActive(current.id);
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

const navSections = ['about', 'projects', 'experience', 'skills', 'contact']
  .map((id) => document.getElementById(id)).filter(Boolean);

if (navSections.length) {
  watchSections(navSections, (id) => {
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}

// ---------- Case-study section bar with reading progress ----------
const toc = document.querySelector('.case-toc');

if (toc) {
  const inner = toc.querySelector('.toc-inner');
  const sections = [...document.querySelectorAll('main section[id]')];

  sections.forEach((section) => {
    const eyebrow = section.querySelector('.eyebrow');
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = eyebrow ? eyebrow.textContent.split('—').pop().trim() : section.id;
    inner.append(link);
  });
  const progress = document.createElement('span');
  progress.className = 'toc-progress';
  progress.setAttribute('aria-hidden', 'true');
  inner.append(progress);
  toc.hidden = false;

  watchSections(sections, (id) => {
    inner.querySelectorAll('a').forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'true');
        inner.scrollTo({ left: link.offsetLeft - inner.clientWidth / 2 + link.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });

  const main = document.querySelector('main');
  const updateProgress = () => {
    const start = main.offsetTop;
    const span = main.offsetHeight - window.innerHeight;
    const ratio = Math.min(Math.max((window.scrollY - start) / Math.max(span, 1), 0), 1);
    progress.style.setProperty('--progress', ratio.toFixed(3));
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// ---------- Fade sections in as they scroll into view ----------
if (!reduceMotion && 'IntersectionObserver' in window) {
  root.classList.add('js-reveal');
  const targets = document.querySelectorAll('.sec-head, .sec-body, .sec-wide:not(.projects), .case-hero');
  targets.forEach((el) => el.classList.add('reveal'));
  document.querySelectorAll('.projects .proj').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.setProperty('--delay', `${i * 90}ms`);
  });

  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-in');
      revealer.unobserve(el);
      // Drop the reveal classes once done so hover transitions aren't delayed.
      setTimeout(() => {
        el.classList.remove('reveal', 'is-in');
        el.style.removeProperty('--delay');
      }, 1000);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-drawn');
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.bars').forEach((chart) => chartObserver.observe(chart));
}

// ---------- Copy email ----------
document.querySelectorAll('.copy-btn').forEach((button) => {
  if (!navigator.clipboard) return;
  button.hidden = false;
  const label = button.querySelector('.copy-label');
  const status = document.getElementById(button.dataset.status);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.classList.add('is-done');
      label.textContent = 'Copied';
      if (status) status.textContent = 'Email address copied to clipboard';
      setTimeout(() => {
        button.classList.remove('is-done');
        label.textContent = 'Copy';
        if (status) status.textContent = '';
      }, 2000);
    } catch {
      label.textContent = 'Copy failed';
    }
  });
});
