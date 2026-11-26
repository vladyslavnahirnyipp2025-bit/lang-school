/* Живий діалог у першому екрані. */
(function () {
  'use strict';

  const TRANSLATIONS = [
    'Привіт! Що тебе до нас привело?',
    'Хочу говорити без страху.',
    'Чудово. Почнімо вже сьогодні.'
  ];
  const DIALOGUES = {
    en: ['Hi! What brings you here?', 'I want to speak without fear.', 'Great. Let’s start today.'],
    de: ['Hallo! Was führt dich zu uns?', 'Ich möchte ohne Angst sprechen.', 'Super. Fangen wir heute an.'],
    es: ['¡Hola! ¿Qué te trae por aquí?', 'Quiero hablar sin miedo.', 'Genial. Empecemos hoy.'],
    pl: ['Cześć! Co cię do nas sprowadza?', 'Chcę mówić bez strachu.', 'Świetnie. Zaczynamy dziś.']
  };
  const ORDER = Object.keys(DIALOGUES);

  const chat = document.getElementById('chat');
  const pauseButton = document.getElementById('chat-pause');
  const tabs = [...document.querySelectorAll('.lang-tab')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let language = 'en';
  let index = 0;
  let timer = null;
  let paused = false;
  let autoSwitch = true; // вимикається, щойно людина сама обрала мову

  function createBubble(i) {
    const bubble = document.createElement('button');
    bubble.type = 'button';
    bubble.className = `bubble ${i % 2 ? 'bubble-right' : 'bubble-left'}`;
    const original = DIALOGUES[language][i];
    const originalLang = language;
    bubble.textContent = original;
    bubble.lang = originalLang;
    let translated = false;
    bubble.addEventListener('click', () => {
      translated = !translated;
      bubble.textContent = translated ? TRANSLATIONS[i] : original;
      // lang відповідає мові тексту, який зараз показано
      bubble.lang = translated ? 'uk' : originalLang;
    });
    return bubble;
  }

  function createTyping(i) {
    const typing = document.createElement('div');
    typing.className = `bubble ${i % 2 ? 'bubble-right' : 'bubble-left'} flex gap-1.5 !py-5`;
    typing.setAttribute('aria-hidden', 'true');
    for (let d = 0; d < 3; d += 1) {
      const dot = document.createElement('span');
      dot.className = 'size-2.5 animate-dot rounded-full bg-night';
      dot.style.animationDelay = `${d * 0.15}s`;
      typing.append(dot);
    }
    return typing;
  }

  function wait(ms, next) {
    clearTimeout(timer);
    timer = setTimeout(next, ms);
  }

  // Спочатку показуємо «друкує…», потім саму репліку
  function step() {
    if (paused) return;
    if (index >= DIALOGUES[language].length) {
      if (autoSwitch) wait(3500, () => setLanguage(ORDER[(ORDER.indexOf(language) + 1) % ORDER.length]));
      return;
    }
    const typing = createTyping(index);
    chat.append(typing);
    wait(900, () => {
      typing.replaceWith(createBubble(index));
      index += 1;
      wait(700, step);
    });
  }

  function setLanguage(next) {
    clearTimeout(timer);
    language = next;
    index = 0;
    chat.replaceChildren();
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.lang === language)));
    if (reduced) {
      DIALOGUES[language].forEach((_, i) => chat.append(createBubble(i)));
      return;
    }
    step();
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    autoSwitch = false;
    paused = false;
    pauseButton.setAttribute('aria-pressed', 'false');
    pauseButton.textContent = 'Пауза';
    setLanguage(tab.dataset.lang);
  }));

  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? 'Продовжити' : 'Пауза';
    if (paused) {
      clearTimeout(timer);
      chat.querySelector('[aria-hidden="true"]')?.remove();
    } else {
      step();
    }
  });

  if (reduced) {
    autoSwitch = false;
    pauseButton.hidden = true;
  }
  setLanguage('en');
})();
