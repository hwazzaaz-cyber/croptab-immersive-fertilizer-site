import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve('index.html')).href);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1800);

const result = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  const title = document.querySelector('h1');
  const visual = document.querySelector('.hero-visual');
  const dots = document.querySelectorAll('.nutrient-dot');
  const heroBox = hero?.getBoundingClientRect();
  const titleBox = title?.getBoundingClientRect();
  const visualBox = visual?.getBoundingClientRect();

  return {
    text: title?.textContent?.trim() ?? '',
    dotCount: dots.length,
    heroHeight: Math.round(heroBox?.height ?? 0),
    titleWidth: Math.round(titleBox?.width ?? 0),
    visualHeight: Math.round(visualBox?.height ?? 0),
    bg: getComputedStyle(document.body).backgroundImage,
  };
});

await page.screenshot({ path: 'site-mobile-preview.png', fullPage: true });
await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(pathToFileURL(resolve('index.html')).href);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1800);
await page.screenshot({ path: 'site-desktop-preview.png', fullPage: false });
await browser.close();

const failures = [];
if (!result.text.includes('Feed every root')) failures.push('hero title is not rendered');
if (result.dotCount < 30) failures.push(`expected nutrient particles, found ${result.dotCount}`);
if (result.heroHeight < 700) failures.push(`hero too short: ${result.heroHeight}`);
if (result.visualHeight < 400) failures.push(`hero visual too short: ${result.visualHeight}`);
if (!result.bg.includes('radial-gradient')) failures.push('body background did not render');

if (failures.length > 0) {
  console.error(`Visual check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Visual check passed.');
