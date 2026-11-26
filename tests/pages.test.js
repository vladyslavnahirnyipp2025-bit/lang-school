// Тести сторінок: ловлять биті посилання та розбіжності в повторюваній шапці.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PAGES = fs.readdirSync(ROOT).filter((file) => file.endsWith('.html'));
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

// Локальні адреси з href і src: без зовнішніх сайтів та вбудованих data:
function localLinks(html) {
  return [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((link) => !/^(https?:|data:|mailto:|tel:)/.test(link));
}

// Меню сторінки без позначки поточного пункту
function menu(html) {
  const nav = html.match(/<nav id="nav"[\s\S]*?<\/nav>/);
  if (!nav) return null;
  return [...nav[0].matchAll(/href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((match) => `${match[1]} ${match[2]}`);
}

test('на місці всі сторінки сайту', () => {
  assert.deepEqual(
    [...PAGES].sort(),
    ['404.html', 'about.html', 'courses.html', 'index.html', 'prices.html', 'signup.html', 'test.html']
  );
});

for (const page of PAGES) {
  test(`${page}: локальні посилання, стилі, скрипти та якорі існують`, () => {
    const broken = localLinks(read(page)).filter((link) => {
      const [withoutHash, hash] = link.split('#');
      const file = withoutHash.split('?')[0].replace(/^\//, '') || page;
      if (!fs.existsSync(path.join(ROOT, file))) return true;
      return Boolean(hash) && !read(file).includes(`id="${hash}"`);
    });
    assert.deepEqual(broken, []);
  });

  test(`${page}: мова, назва та один заголовок h1`, () => {
    const html = read(page);
    assert.match(html, /<html lang="uk"/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  });
}

test('меню однакове на всіх сторінках', () => {
  const expected = menu(read('index.html'));
  assert.equal(expected.length, 6);
  for (const page of PAGES.filter((file) => file !== '404.html')) {
    assert.deepEqual(menu(read(page)), expected, page);
  }
});

test('кожна сторінка з меню позначає себе як поточну', () => {
  for (const page of PAGES.filter((file) => file !== '404.html')) {
    assert.ok(read(page).includes(`href="${page}" aria-current="page"`), page);
  }
});

const SITE = 'https://lang-school-pi.vercel.app/';
const attribute = (html, pattern) => (html.match(pattern) || [])[1];

for (const page of PAGES.filter((file) => file !== '404.html')) {
  test(`${page}: SEO-теги на місці`, () => {
    const html = read(page);
    const url = page === 'index.html' ? SITE : SITE + page;
    const title = attribute(html, /<title>([^<]*)<\/title>/);
    const description = attribute(html, /<meta name="description" content="([^"]*)"/);
    assert.ok(title.length >= 30 && title.length <= 60, `title: ${title.length}`);
    assert.ok(description.length >= 70 && description.length <= 160, `description: ${description.length}`);
    assert.equal(attribute(html, /<link rel="canonical" href="([^"]*)"/), url);
    assert.equal(attribute(html, /<meta property="og:url" content="([^"]*)"/), url);
    assert.equal(attribute(html, /<meta property="og:title" content="([^"]*)"/), title);
    const image = attribute(html, /<meta property="og:image" content="([^"]*)"/);
    assert.ok(image.startsWith(SITE) && fs.existsSync(path.join(ROOT, image.slice(SITE.length))), image);
  });
}

test('sitemap.xml містить усі сторінки, а robots.txt на нього посилається', () => {
  const sitemap = read('sitemap.xml');
  for (const page of PAGES.filter((file) => file !== '404.html')) {
    assert.ok(sitemap.includes(`<loc>${page === 'index.html' ? SITE : SITE + page}</loc>`), page);
  }
  assert.ok(read('robots.txt').includes(`Sitemap: ${SITE}sitemap.xml`));
});
