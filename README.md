# «Репліка» — школа іноземних мов

[![CI](https://github.com/vladyslavnahirnyipp2025-bit/lang-school/actions/workflows/ci.yml/badge.svg)](https://github.com/vladyslavnahirnyipp2025-bit/lang-school/actions/workflows/ci.yml)

**Сайт:** https://lang-school-pi.vercel.app/

Навчальний багатосторінковий сайт: семантичний HTML, Tailwind CSS 3 (CLI), JavaScript без фреймворків.
Школа вигадана, ціни й відгуки демонстраційні, форма нікуди не надсилає дані.

## Сторінки

| Файл | Що на ній | Скрипти (крім `main.js`) |
|---|---|---|
| `index.html` | жива розмова, мови, наступні кроки, відгуки (Swiper 11.1.14) | `hero.js` |
| `courses.html` | картки, що перевертаються, програми, розклад із фільтром | `schedule.js` |
| `about.html` | 60 хвилин уроку, шлях A1–C1, поширені запитання | немає |
| `test.html` | тест рівня англійської та опис рівнів | `logic.js`, `quiz.js` |
| `prices.html` | калькулятор і таблиця цін | `logic.js`, `calculator.js` |
| `signup.html` | пробний урок і форма запису | `logic.js`, `signup.js` |
| `404.html` | сторінка не знайдена | немає (і без `main.js`) |

`main.js` відповідає за меню, прокручування, появу блоків, картки, запитання та слайдер.
`logic.js` містить чисті функції: ціна, рівень, перевірка форми, параметри адреси.

Між сторінками вибір передається в адресі, наприклад `signup.html?language=de`. Особисті дані туди не потрапляють.

Шапка й підвал повторюються в кожному HTML-файлі, тому зміни в меню треба робити в усіх.

Кольори, шрифти й анімації описані в `tailwind.config.js`, компоненти — у `src/input.css`. Тести логіки — у `tests/logic.test.js`, тести сторінок (посилання, меню, заголовки) — у `tests/pages.test.js`.
Анімації вимикаються, якщо в системі ввімкнено «зменшення руху».

## CI/CD

- **CI** (`.github/workflows/ci.yml`): після кожного push у `main` і для кожного pull request GitHub Actions запускає тести, перевіряє HTML і те, що зібраний CSS не застарів.
- **CD**: Vercel сам публікує сайт після push у `main`. Деплой не чекає на результат CI.

## Команди

```powershell
npm install
```

```powershell
npm run build:css
```

```powershell
npm test
```

```powershell
npm run lint:html
```

Після збірки відкрийте `index.html` у браузері. Шрифти та Swiper завантажуються з інтернету.
