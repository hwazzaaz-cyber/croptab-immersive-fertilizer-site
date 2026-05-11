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
await page.waitForSelector('.web-panel.panel-active');
await page.waitForTimeout(1600);
const initialShot = await page.evaluate(() => ({
  bg: getComputedStyle(document.querySelector('.panel-active') ?? document.body).backgroundImage,
}));
await page.mouse.click(200, 420);
await page.waitForTimeout(250);
const clickInteraction = await page.evaluate(() => ({
  activePanel: document.querySelector('.panel-active')?.getAttribute('data-panel'),
}));

const mobile = await page.evaluate(() => {
  const stage = document.querySelector('.web-stage');
  const panel = document.querySelector('.panel-active');
  const product = document.querySelector('.persistent-product');
  const dots = document.querySelectorAll('.panel-dots button');
  const stageBox = stage?.getBoundingClientRect();
  const productBox = product?.getBoundingClientRect();
  return {
    panelClass: panel?.className ?? '',
    dotCount: dots.length,
    stageHeight: Math.round(stageBox?.height ?? 0),
    productWidth: Math.round(productBox?.width ?? 0),
    bg: getComputedStyle(panel ?? document.body).backgroundImage,
  };
});

await page.screenshot({ path: 'site-mobile-preview.png', fullPage: false, timeout: 60000 });

await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(pathToFileURL(resolve('index.html')).href, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.web-panel.panel-active');
await page.waitForTimeout(1600);
await page.mouse.move(1120, 220);
await page.waitForTimeout(180);
await page.mouse.wheel(0, 620);
await page.waitForTimeout(900);
const interaction = await page.evaluate(() => {
  const stage = document.querySelector('.web-stage');
  const styles = getComputedStyle(stage);
  return {
    pointerX: styles.getPropertyValue('--pointer-x').trim(),
    pointerY: styles.getPropertyValue('--pointer-y').trim(),
    activePanel: document.querySelector('.panel-active')?.getAttribute('data-panel'),
  };
});
await page.screenshot({ path: 'site-desktop-preview.png', fullPage: false, timeout: 60000 });

await browser.close();

const failures = [];
if (!mobile.panelClass.includes('panel-active')) failures.push('no active reference panel rendered');
if (mobile.dotCount < 8) failures.push(`expected at least 8 panel dots, found ${mobile.dotCount}`);
if (mobile.stageHeight < 700) failures.push(`stage too short: ${mobile.stageHeight}`);
if (mobile.productWidth < 80) failures.push(`product visual too small: ${mobile.productWidth}`);
if (!initialShot.bg.includes('radial-gradient')) failures.push('initial shot background did not render');
if (clickInteraction.activePanel === '0') failures.push('click did not immediately advance the reference panel');
if (interaction.pointerX === '0px' || interaction.pointerY === '0px') failures.push('pointer movement did not affect product variables');
if (interaction.activePanel === '0') failures.push('wheel movement did not advance the reference panel');

if (failures.length > 0) {
  console.error(`Visual check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Visual check passed.');
