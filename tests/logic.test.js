const test = require('node:test');
const assert = require('node:assert/strict');
const { calculatePrice, discountFor, levelFor, validateForm } = require('../assets/js/logic.js');

test('груповий курс англійської: 2 рази на тиждень, 1 місяць без знижки', () => {
  const r = calculatePrice({ language: 'en', format: 'group', perWeek: 2, months: 1 });
  assert.equal(r.lessons, 8);
  assert.equal(r.total, 2240);
  assert.equal(r.discount, 0);
});

test('за 6 місяців діє знижка 10 %', () => {
  const r = calculatePrice({ language: 'de', format: 'solo', perWeek: 1, months: 6 });
  assert.equal(r.perLesson, 660);
  assert.equal(r.full, 15840);
  assert.equal(r.total, 14256);
  assert.equal(r.saved, 1584);
  assert.equal(r.monthly, 2376);
});

test('межі знижок', () => {
  assert.deepEqual([2, 3, 5, 6, 11, 12].map(discountFor), [0, 0.05, 0.05, 0.1, 0.1, 0.15]);
});

test('некоректні дані калькулятора відхиляються', () => {
  const base = { language: 'en', format: 'group', perWeek: 2, months: 3 };
  assert.throws(() => calculatePrice({ ...base, language: 'toString' }), RangeError);
  assert.throws(() => calculatePrice({ ...base, perWeek: 0 }), RangeError);
  assert.throws(() => calculatePrice({ ...base, months: 13 }), RangeError);
});

test('рівень за кількістю правильних відповідей', () => {
  assert.deepEqual(
    [0, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => levelFor(s).code),
    ['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1']
  );
});

test('правильна заявка не має помилок', () => {
  const errors = validateForm({ name: 'Мар’яна', phone: '+380 67 123 45 67', email: 'test@example.com', language: 'pl', consent: true });
  assert.deepEqual(errors, {});
});

test('порожня заявка має помилку в кожному полі', () => {
  assert.deepEqual(Object.keys(validateForm({})).sort(), ['consent', 'email', 'language', 'name', 'phone']);
});

test('цифри в імені, короткий номер і пошта без домену не проходять', () => {
  const errors = validateForm({ name: 'Іван2', phone: '067123', email: 'a@b', language: 'en', consent: true });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'name', 'phone']);
});
