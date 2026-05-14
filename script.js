/* =============================================
   SARBAJIT GHOSH — PORTFOLIO
   script.js — Interactions & Animations
   ============================================= */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-card, .skill-card, .edu-card, .ach-item, .contact-link, .stat-block, .exp-item')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
      });
  }

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.style.background = window.scrollY > 60
        ? 'rgba(17,16,9,0.98)'
        : 'rgba(17,16,9,0.92)';
    }
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', closeMenu));
  }

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.closest('.hero')) {
        entry.target.style.animationPlayState = 'running';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up').forEach(el => {
    if (!el.closest('.hero')) {
      el.style.animationPlayState = 'paused';
      revealObserver.observe(el);
    }
  });

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id ? 'var(--cream)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe
    ? sections.forEach(sec =>
        new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              navAnchors.forEach(a => {
                a.style.color = a.getAttribute('href') === '#' + entry.target.id
                  ? 'var(--cream)' : '';
              });
            }
          });
        }, { rootMargin: '-40% 0px -55% 0px' }).observe(sec)
      )
    : null;

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 56, behavior: 'smooth' });
      }
    });
  });

  /* ── PROJECT CARD TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
      card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── STAT COUNTER ── */
  function animateCounter(el, target, suffix, decimals) {
    const start = performance.now();
    const duration = 1200;
    (function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = decimals
        ? (eased * target).toFixed(decimals) + suffix
        : Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent.trim();
      if (text === '8.61')   animateCounter(el, 8.61,  '',  2);
      if (text === '96.8%')  animateCounter(el, 96.8,  '%', 1);
      if (text === '3×')     animateCounter(el, 3,      '×', 0);
      new IntersectionObserver(() => {}).observe(el); // unobserve trick
    });
  }, { threshold: 0.6 }).observe
    ? document.querySelectorAll('.stat-num').forEach(el =>
        new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const text = el.textContent.trim();
            if (text === '8.61')  animateCounter(el, 8.61, '',  2);
            if (text === '96.8%') animateCounter(el, 96.8, '%', 1);
            if (text === '3×')    animateCounter(el, 3,    '×', 0);
          });
        }, { threshold: 0.6 }).observe(el)
      )
    : null;

  /* ── CV / RESUME VIEWER ── */
  window.toggleCV = function () {
    const wrap     = document.getElementById('cvViewerWrap');
    const btn      = document.getElementById('cvToggleBtn');
    const iframe   = document.getElementById('cvIframe');
    const fallback = document.getElementById('cvFallback');
    if (!wrap) return;
    const isOpen = wrap.classList.toggle('open');
    if (isOpen) {
      btn.textContent = 'HIDE PREVIEW ↑';
      if (!iframe.src || iframe.src === window.location.href) {
        iframe.src = iframe.dataset.src;
        iframe.onerror = () => {
          iframe.style.display = 'none';
          if (fallback) fallback.classList.add('visible');
        };
      }
      setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } else {
      btn.textContent = 'PREVIEW CV ↓';
    }
  };

})();
