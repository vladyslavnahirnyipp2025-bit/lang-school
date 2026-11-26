/* Фільтр розкладу груп за мовою. */
(function () {
  'use strict';

  const buttons = [...document.querySelectorAll('.filter')];
  const rows = [...document.querySelectorAll('#schedule tr')];
  const count = document.getElementById('schedule-count');

  buttons.forEach((button) => button.addEventListener('click', () => {
    const wanted = button.dataset.filter;
    buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));

    let visible = 0;
    rows.forEach((row) => {
      const show = wanted === 'all' || row.dataset.language === wanted;
      row.hidden = !show;
      row.classList.remove('animate-rise');
      if (show) {
        void row.offsetWidth; // перезапускає анімацію
        row.classList.add('animate-rise', 'motion-reduce:animate-none');
        visible += 1;
      }
    });
    count.textContent = `Показано груп: ${visible}.`;
  }));
})();
