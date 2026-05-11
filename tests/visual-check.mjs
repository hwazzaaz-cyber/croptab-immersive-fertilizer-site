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
await page.goto(pathToFileURL(resolve('index.html')).href, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.shot-active .hero-product');
await page.waitForTimeout(1600);

const mobile = await page.evaluate(() => {
  const stage = document.querySelector('.cinematic-stage');
  const shot = document.querySelector('.shot-active');
  const product = document.querySelector('.hero-product');
  const dots = document.querySelectorAll('.timeline-dots button');
  const stageBox = stage?.getBoundingClientRect();
  const productBox = product?.getBoundingClientRect();
  return {
    shotClass: shot?.className ?? '',
    dotCount: dots.length,
    stageHeight: Math.round(stageBox?.height ?? 0),
    productWidth: Math.round(productBox?.width ?? 0),
    bg: getComputedStyle(shot ?? document.body).backgroundImage,
  };
});

await page.screenshot({ path: 'site-mobile-preview.png', fullPage: false });

await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(pathToFileURL(resolve('index.html')).href, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.shot-active .hero-product');
await page.waitForTimeout(1600);
await page.screenshot({ path: 'site-desktop-preview.png', fullPage: false });

await browser.close();

const failures = [];
if (!mobile.shotClass.includes('shot-active')) failures.push('no active cinematic shot rendered');
if (mobile.dotCount !== 7) failures.push(`expected 7 timeline dots, found ${mobile.dotCount}`);
if (mobile.stageHeight < 700) failures.push(`stage too short: ${mobile.stageHeight}`);
if (mobile.productWidth < 80) failures.push(`product visual too small: ${mobile.productWidth}`);
if (!mobile.bg.includes('radial-gradient')) failures.push('active shot background did not render');

if (failures.length > 0) {
  console.error(`Visual check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Visual check passed.');
