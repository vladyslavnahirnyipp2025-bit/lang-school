/* Форма запису. Перевірки — у logic.js. */
(function () {
  'use strict';

  const { validateForm, prefillFromQuery } = window.Logic;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ---------- Вибір, переданий з інших сторінок ----------
  const prefill = prefillFromQuery(window.location.search);
  if (prefill) {
    form.elements.language.value = prefill.language;
    form.elements.comment.value = prefill.comment;
  }
})();
