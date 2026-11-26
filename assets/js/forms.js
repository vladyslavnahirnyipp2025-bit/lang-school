/* Калькулятор вартості та форма запису. Обчислення й перевірки — у logic.js. */
(function () {
  'use strict';

  const { calculatePrice, validateForm } = window.Logic;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = new Intl.NumberFormat('uk-UA');

  // ---------- Калькулятор ----------
  const calc = document.getElementById('calc');
  const output = (id) => document.getElementById(id);
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
  }
  calc.addEventListener('input', updateCalc);
  calc.addEventListener('submit', (event) => event.preventDefault());
  updateCalc();

  // ---------- Форма запису ----------
  const form = document.getElementById('signup-form');
  const dialog = document.getElementById('success');
  const FIELDS = ['name', 'phone', 'email', 'language', 'consent'];
  let submitted = false;

  function readForm() {
    return {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      email: form.elements.email.value,
      language: form.elements.language.value,
      consent: form.elements.consent.checked
    };
  }

  function showError(field, message) {
    form.elements[field].setAttribute('aria-invalid', String(Boolean(message)));
    document.getElementById(`${field}-error`).textContent = message || '';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;
    const errors = validateForm(readForm());
    FIELDS.forEach((field) => showError(field, errors[field]));

    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      form.classList.remove('animate-shake');
      void form.offsetWidth; // перезапускає анімацію
      if (!reduced) form.classList.add('animate-shake');
      form.elements[firstInvalid].focus();
      return;
    }

    // textContent не виконує HTML, тому введене ім'я безпечно показувати
    document.getElementById('success-text').textContent =
      `Дякуємо, ${form.elements.name.value.trim()}! Дані перевірено. Це демонстрація, тому заявку нікуди не надіслано.`;
    dialog.showModal();
    form.reset();
    submitted = false;
  });

  form.addEventListener('animationend', (event) => {
    if (event.target === form) form.classList.remove('animate-shake');
  });

  // Після першої спроби помилки зникають одразу під час виправлення
  form.addEventListener('input', (event) => {
    const field = event.target.name;
    if (submitted && FIELDS.includes(field)) showError(field, validateForm(readForm())[field]);
  });

  // ---------- Перенесення вибору з калькулятора й тесту ----------
  function prefill({ language, comment }) {
    form.elements.language.value = language;
    form.elements.comment.value = comment;
    if (submitted) showError('language', '');
  }
  document.addEventListener('prefill', (event) => prefill(event.detail));

  document.getElementById('calc-signup').addEventListener('click', () => {
    const input = readCalc();
    const formats = { group: 'у групі', pair: 'у парі', solo: 'індивідуально' };
    prefill({
      language: input.language,
      comment: `Цікавить курс ${formats[input.format]}, занять на тиждень: ${input.perWeek}, тривалість: ${input.months} міс.`
    });
  });
})();
