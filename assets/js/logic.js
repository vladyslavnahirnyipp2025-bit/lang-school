/* Чиста логіка без DOM: калькулятор, тест рівня, перевірка форми.
   Працює і в браузері (window.Logic), і в Node.js (для тестів). */
(function (root) {
  'use strict';

  // Ціна одного заняття (60 хв) у гривнях. Ціни демонстраційні.
  const FORMAT_PRICE = { group: 280, pair: 420, solo: 600 };
  const LANGUAGE_RATE = { en: 1, de: 1.1, es: 1.05, pl: 0.95 };
  const WEEKS_PER_MONTH = 4;

  // Знижка залежить від тривалості курсу.
  function discountFor(months) {
    if (months >= 12) return 0.15;
    if (months >= 6) return 0.1;
    if (months >= 3) return 0.05;
    return 0;
  }

  function calculatePrice({ language, format, perWeek, months }) {
    if (!Object.hasOwn(LANGUAGE_RATE, language)) throw new RangeError('Невідома мова');
    if (!Object.hasOwn(FORMAT_PRICE, format)) throw new RangeError('Невідомий формат');
    if (!Number.isInteger(perWeek) || perWeek < 1 || perWeek > 4) throw new RangeError('Занять на тиждень: від 1 до 4');
    if (!Number.isInteger(months) || months < 1 || months > 12) throw new RangeError('Місяців: від 1 до 12');

    const perLesson = Math.round(FORMAT_PRICE[format] * LANGUAGE_RATE[language]);
    const lessons = perWeek * WEEKS_PER_MONTH * months;
    const full = perLesson * lessons;
    const discount = discountFor(months);
    const total = Math.round(full * (1 - discount));

    return { perLesson, lessons, full, discount, total, saved: full - total, monthly: Math.round(total / months) };
  }

  // Рівні від вищого до нижчого: min — мінімум правильних відповідей із 9.
  const LEVELS = [
    { min: 9, code: 'C1', text: 'Ви впевнено володієте складними конструкціями. Далі варто шліфувати живе мовлення.' },
    { min: 7, code: 'B2', text: 'Сильний рівень. Далі працюємо над швидкістю та природністю мовлення.' },
    { min: 5, code: 'B1', text: 'База є. Час говорити довше й братися за складніші теми.' },
    { min: 3, code: 'A2', text: 'Ви розумієте прості фрази. Наступна ціль: підтримувати коротку розмову.' },
    { min: 0, code: 'A1', text: 'Це точка старту. Почнемо з фраз, які знадобляться вже на першому тижні.' }
  ];

  function levelFor(score) {
    return LEVELS.find((level) => score >= level.min);
  }

  // Повертає об'єкт помилок. Порожній об'єкт означає, що заявка правильна.
  function validateForm({ name = '', phone = '', email = '', language = '', consent = false }) {
    const errors = {};
    if (!/^\p{L}[\p{L}' ’ʼ-]{1,49}$/u.test(name.trim())) {
      errors.name = 'Введіть ім’я: щонайменше 2 літери, без цифр.';
    }
    if (!/^\+380\d{9}$/.test(phone.replace(/[\s()-]/g, ''))) {
      errors.phone = 'Введіть номер у форматі +380 XX XXX XX XX.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errors.email = 'Введіть пошту на зразок name@example.com.';
    }
    if (!Object.hasOwn(LANGUAGE_RATE, language)) {
      errors.language = 'Оберіть мову.';
    }
    if (!consent) {
      errors.consent = 'Позначте згоду, щоб надіслати заявку.';
    }
    return errors;
  }

  const FORMAT_NAME = { group: 'у групі', pair: 'у парі', solo: 'індивідуально' };

  // Читає вибір, переданий із калькулятора, тесту чи сторінки мов.
  // Приймає лише відомі значення: довільний текст з адреси у форму не потрапляє.
  function prefillFromQuery(search) {
    const query = new URLSearchParams(search);

    const rawScore = query.get('score');
    if (/^[0-9]$/.test(rawScore)) {
      const score = Number(rawScore);
      return { language: 'en', comment: `Результат тесту: ${levelFor(score).code} (${score} з 9).` };
    }

    const language = query.get('language');
    if (!Object.hasOwn(LANGUAGE_RATE, language)) return null;

    const format = query.get('format');
    const perWeek = Number(query.get('perWeek'));
    const months = Number(query.get('months'));
    try {
      calculatePrice({ language, format, perWeek, months });
    } catch {
      return { language, comment: '' };
    }
    return { language, comment: `Цікавить курс ${FORMAT_NAME[format]}, занять на тиждень: ${perWeek}, тривалість: ${months} міс.` };
  }

  const api = { calculatePrice, discountFor, levelFor, validateForm, prefillFromQuery };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Logic = api;
})(this);
