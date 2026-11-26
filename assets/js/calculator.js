/* Калькулятор вартості. Обчислення — у logic.js. */
(function () {
  'use strict';

  const { calculatePrice } = window.Logic;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = new Intl.NumberFormat('uk-UA');

  // ---------- Калькулятор ----------
  const calc = document.getElementById('calc');
  const output = (id) => document.getElementById(id);
  const signupLink = output('calc-signup');
  const shown = new Map(); // поточне значення кожного лічильника

  // Число плавно «добігає» до нового значення
  function animateNumber(element, target) {
    const previous = shown.get(element) || { value: 0, frame: 0 };
    cancelAnimationFrame(previous.frame);
    const from = previous.value;
    const start = performance.now();
    const state = { value: from, frame: 0 };
    shown.set(element, state);

    function tick(now) {
      const part = reduced ? 1 : Math.min(1, Math.max(0, (now - start) / 500));
      state.value = from + (target - from) * (1 - (1 - part) ** 3);
      element.textContent = money.format(Math.round(state.value));
      if (part < 1) state.frame = requestAnimationFrame(tick);
    }
    if (reduced) tick(start);
    else state.frame = requestAnimationFrame(tick);
  }

  function readCalc() {
    const data = new FormData(calc);
    return {
      language: data.get('language'),
      format: data.get('format'),
      perWeek: Number(data.get('perWeek')),
      months: Number(data.get('months'))
    };
  }

  function updateCalc() {
    const input = readCalc();
    const result = calculatePrice(input);
    output('per-week-out').textContent = input.perWeek;
    output('months-out').textContent = input.months;
    animateNumber(output('r-monthly'), result.monthly);
    animateNumber(output('r-total'), result.total);
    animateNumber(output('r-lesson'), result.perLesson);
    animateNumber(output('r-lessons'), result.lessons);

    const saved = output('r-saved');
    saved.classList.toggle('hidden', result.saved === 0);
    saved.textContent = result.saved
      ? `Знижка ${result.discount * 100} %: ви заощаджуєте ${money.format(result.saved)} грн.`
      : '';

    // Кнопка запису передає обрані умови на сторінку з формою
    signupLink.href = `signup.html?${new URLSearchParams(input)}`;
  }
  calc.addEventListener('input', updateCalc);
  calc.addEventListener('submit', (event) => event.preventDefault());

  // Мову можна передати в адресі: prices.html?language=de
  const wanted = new URLSearchParams(window.location.search).get('language');
  const radio = [...calc.querySelectorAll('input[name="language"]')].find((input) => input.value === wanted);
  if (radio) radio.checked = true;
  updateCalc();
})();
