/* Peak Grades — Shared JS */
(function () {
  'use strict';

  /* ── Scroll-aware header ─────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Mobile nav ──────────────────────────────────── */
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    var closeLinks = document.querySelectorAll('[data-close-nav]');
    function closeMobileNav() {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    closeLinks.forEach(function (el) { el.addEventListener('click', closeMobileNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobileNav(); });
  }

  /* ── Scroll reveal ───────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── FAQ accordion ───────────────────────────────── */
  var allDetails = document.querySelectorAll('details');
  allDetails.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) allDetails.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ── Level tabs ──────────────────────────────────── */
  var tabs = document.querySelectorAll('.level-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var level = tab.dataset.level;
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('[data-level-content]').forEach(function (panel) {
        panel.style.display = panel.dataset.levelContent === level ? 'grid' : 'none';
      });
      /* homepage uses id-based panels */
      var gcse = document.getElementById('gcse-res');
      var alevel = document.getElementById('alevel-res');
      if (gcse && alevel) {
        gcse.style.display = level === 'gcse' ? 'grid' : 'none';
        alevel.style.display = level === 'alevel' ? 'grid' : 'none';
      }
    });
  });

  /* ── Newsletter form ─────────────────────────────── */
  window.handleNewsletter = function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button');
    btn.textContent = 'Subscribed ✓';
    btn.disabled = true;
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
  };

  /* ── Contact form ────────────────────────────────── */
  window.handleContact = function (e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type="submit"]');
    var successEl = document.getElementById('form-success');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(function () {
      form.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
    }, 900);
  };

  /* ── Light / dark theme toggle ───────────────────── */
  (function () {
    var root = document.documentElement;
    var btn = document.querySelector('[data-theme-toggle]');
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    function stored() { try { return localStorage.getItem('pg-theme'); } catch (e) { return null; } }
    function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function sync() {
      if (!btn) return;
      var dark = current() === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    function apply(t) { root.setAttribute('data-theme', t); sync(); }
    if (btn) {
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem('pg-theme', next); } catch (e) {}
      });
    }
    /* Follow the system setting until the visitor makes their own choice */
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); });
    }
    sync();
  })();

})();
