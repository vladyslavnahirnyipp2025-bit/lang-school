/* Загальна поведінка сторінки: меню, шапка, поява блоків, шлях навчання, картки, FAQ, відгуки. */
(function () {
  'use strict';

  // --- Мобільне меню ---
  const menuButton = document.getElementById('menu-button');
  const nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', String(open));
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  // --- Прокручування: шапка, смужка прогресу, лінія шляху ---
  const header = document.getElementById('header');
  const progress = document.getElementById('scroll-progress');
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timeline-fill');
  const steps = [...timeline.querySelectorAll('.step')];
  let waiting = false;

  function onScroll() {
    waiting = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;

    ['bg-white/90', 'shadow-lg', 'backdrop-blur'].forEach((name) => header.classList.toggle(name, window.scrollY > 20));

    // Лінія «доходить» до точки на 65 % висоти екрана
    const box = timeline.getBoundingClientRect();
    const line = window.innerHeight * 0.65;
    timelineFill.style.transform = `scaleY(${Math.min(1, Math.max(0, (line - box.top) / box.height))})`;
    steps.forEach((step) => step.classList.toggle('is-active', step.getBoundingClientRect().top < line));
  }
  window.addEventListener('scroll', () => {
    if (!waiting) {
      waiting = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // --- Поява блоків ---
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  // --- Картки мов ---
  document.querySelectorAll('.flip').forEach((card) => {
    const [front, back] = card.querySelectorAll('.flip-face');
    function sync() {
      const flipped = card.getAttribute('aria-pressed') === 'true';
      // Невидимий бік ховаємо від програм читання з екрана
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
    }
    card.addEventListener('click', () => {
      card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
      sync();
    });
    sync();
  });

  // --- Поширені запитання ---
  document.querySelectorAll('.faq button').forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      document.getElementById(button.getAttribute('aria-controls')).classList.toggle('is-open', open);
    });
  });

  // --- Слайдер відгуків (бібліотека Swiper) ---
  if (window.Swiper) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    new window.Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      rewind: true,
      grabCursor: true,
      autoplay: reduced ? false : { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
  }
})();
