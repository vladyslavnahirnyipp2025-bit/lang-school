/* Тест рівня англійської: 9 запитань від A1 до C1. */
(function () {
  'use strict';

  // correct — номер правильної відповіді (рахунок від 0)
  const QUESTIONS = [
    { text: 'My sister ___ a teacher.', options: ['are', 'is', 'am'], correct: 1 },
    { text: 'I ___ coffee every morning.', options: ['drinks', 'am drink', 'drink'], correct: 2 },
    { text: 'We ___ to London last summer.', options: ['went', 'go', 'have gone'], correct: 0 },
    { text: 'This book is ___ than that one.', options: ['most interesting', 'more interesting', 'interestinger'], correct: 1 },
    { text: 'I have lived here ___ 2019.', options: ['for', 'from', 'since'], correct: 2 },
    { text: 'If it rains tomorrow, we ___ at home.', options: ['will stay', 'would stay', 'stayed'], correct: 0 },
    { text: 'If I ___ more free time, I would learn Spanish.', options: ['will have', 'had', 'would have'], correct: 1 },
    { text: 'By the time we arrived, the film ___.', options: ['has already started', 'already started to', 'had already started'], correct: 2 },
    { text: 'Hardly ___ the room when the phone rang.', options: ['had I entered', 'I had entered', 'did I entered'], correct: 0 }
  ];

  const quiz = document.getElementById('quiz');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let score = 0;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(className, text, onClick) {
    const node = el('button', className, text);
    node.type = 'button';
    node.addEventListener('click', onClick);
    return node;
  }

  // Новий екран тесту виїжджає знизу. moveFocus не потрібен під час завантаження сторінки.
  function show(nodes, moveFocus) {
    const screen = el('div', 'animate-rise motion-reduce:animate-none');
    screen.append(...nodes);
    quiz.replaceChildren(screen);
    if (moveFocus) screen.querySelector('[tabindex="-1"]')?.focus({ preventScroll: true });
  }

  function showStart(moveFocus) {
    const title = el('h3', 'font-display text-2xl font-bold', 'Дізнайтеся, з чого почати');
    title.tabIndex = -1;
    show([
      title,
      el('p', 'mt-3 text-night/75', 'Оберіть одну відповідь на кожне запитання. Складність поступово зростає.'),
      button('btn btn-primary mt-6', 'Почати тест', () => {
        current = 0;
        score = 0;
        showQuestion();
      })
    ], moveFocus);
  }

  function showQuestion() {
    const question = QUESTIONS[current];

    const track = el('div', 'h-3 overflow-hidden rounded-full bg-night/10');
    const bar = el('div', 'h-full rounded-full bg-ultra transition-all duration-700');
    bar.style.width = `${(current / QUESTIONS.length) * 100}%`;
    track.append(bar);

    const title = el('h3', 'mt-6 font-display text-xl font-bold sm:text-2xl', question.text);
    title.tabIndex = -1;
    title.lang = 'en';

    const list = el('div', 'mt-6 grid gap-3');
    question.options.forEach((option, i) => {
      const answer = button('answer', option, () => choose(i, list, bar));
      answer.lang = 'en';
      list.append(answer);
    });

    show([el('p', 'mb-3 text-sm font-semibold text-night/70', `Запитання ${current + 1} з ${QUESTIONS.length}`), track, title, list], true);
  }

  function choose(picked, list, bar) {
    const { correct } = QUESTIONS[current];
    const answers = [...list.children];
    answers.forEach((answer) => { answer.disabled = true; });
    answers[correct].classList.add('is-right');
    answers[correct].append(' ✓');
    if (picked === correct) {
      score += 1;
    } else {
      answers[picked].classList.add('is-wrong');
      answers[picked].append(' ✗');
    }
    current += 1;
    bar.style.width = `${(current / QUESTIONS.length) * 100}%`;
    setTimeout(current < QUESTIONS.length ? showQuestion : showResult, 1100);
  }

  function confetti() {
    if (reduced) return;
    const colors = ['#3141C8', '#FFD23F', '#FF7A6B', '#3DD6B0', '#8EB8FF'];
    const box = quiz.parentElement;
    for (let i = 0; i < 60; i += 1) {
      const piece = el('span', 'confetti');
      piece.setAttribute('aria-hidden', 'true');
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--x', `${(Math.random() - 0.5) * 600}px`);
      piece.style.setProperty('--y', `${(Math.random() - 0.35) * 500}px`);
      piece.addEventListener('animationend', () => piece.remove());
      box.append(piece);
    }
  }

  function showResult() {
    const level = window.Logic.levelFor(score);
    const title = el('h3', 'text-lg font-semibold', `Правильних відповідей: ${score} з ${QUESTIONS.length}. Ваш орієнтовний рівень:`);
    title.tabIndex = -1;

    const signup = el('a', 'btn btn-primary', 'Записатися на пробний урок');
    signup.href = `signup.html?score=${score}`;

    const actions = el('div', 'mt-6 flex flex-wrap gap-3');
    actions.append(signup, button('btn btn-ghost', 'Пройти ще раз', showQuestionFromStart));

    show([
      title,
      el('p', 'my-4 animate-pop font-display text-7xl font-extrabold text-ultra motion-reduce:animate-none', level.code),
      el('p', 'text-lg', level.text),
      actions
    ], true);
    confetti();
  }

  function showQuestionFromStart() {
    current = 0;
    score = 0;
    showQuestion();
  }

  showStart(false);
})();
