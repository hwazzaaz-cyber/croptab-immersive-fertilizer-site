import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve('index.html')).href);
await page.waitForLoadState('networkidle');

for (let i = 0; i < 7; i += 1) {
  await page.evaluate((index) => {
    document.querySelectorAll('.timeline-dots button')[index]?.click();
  }, i);
  await page.waitForTimeout(850);
  await page.screenshot({ path: `shot-${String(i + 1).padStart(2, '0')}.png`, fullPage: false });
}

await browser.close();
console.log('Cinematic captures written.');
