import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'netlify.toml', '_redirects'];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    failures.push(`${file} is missing`);
  }
}

if (failures.length === 0) {
  const html = read('index.html');
  const css = read('styles.css');
  const js = read('script.js');
  const netlify = read('netlify.toml');
  const redirects = read('_redirects');

  const panels = [...html.matchAll(/<section class="web-panel/gi)].length;
  if (panels < 8) failures.push(`expected at least 8 reference-style web panels, found ${panels}`);

  const requiredCopy = ['CropTab', 'fertilizer', 'soil', 'root', 'For Better Plants', 'For Healthier Animals', 'I do not need review'];
  for (const term of requiredCopy) {
    if (!html.includes(term)) failures.push(`index.html missing "${term}"`);
  }

  if (!html.includes('name="viewport"')) failures.push('index.html missing mobile viewport meta');
  if (!html.includes('aria-label="Website panel progress"')) failures.push('index.html missing accessible website panel progress');
  const referenceMarkers = [
    'class="web-stage"',
    'class="web-panel',
    'persistent-product',
    'class="panel-wipe"',
    'class="top-chrome"',
    'copy-rail',
    'class="photo-slice',
    'class="panel-dots"',
  ];
  for (const marker of referenceMarkers) {
    if (!html.includes(marker)) failures.push(`index.html missing reference marker ${marker}`);
  }

  const removedOldMarkers = ['cinematic-stage', 'shot-active', 'timeline-dots', 'hero-product', 'root-system', 'panel-grid', 'showcase-strip', 'soil-window', 'video-mode-toggle'];
  for (const marker of removedOldMarkers) {
    if (html.includes(marker) || css.includes(marker) || js.includes(marker)) failures.push(`old version marker still present: ${marker}`);
  }

  const styleMarkers = ['web-stage', 'panel-active', 'panel-wipe', 'product-geometry', 'reference-photo', 'copy-rail'];
  for (const marker of styleMarkers) {
    if (!css.includes(marker)) failures.push(`styles.css missing reference style ${marker}`);
  }

  const scriptMarkers = ['panels', 'activatePanel', 'requestAnimationFrame', 'panel-dots', 'pointermove', 'wheel', 'scrollImpulse', 'click'];
  for (const marker of scriptMarkers) {
    if (!js.includes(marker)) failures.push(`script.js missing reference behavior ${marker}`);
  }

  const forbiddenTimingMarkers = ['shotDuration', 'setInterval', 'cinematic'];
  for (const marker of forbiddenTimingMarkers) {
    if (js.includes(marker)) failures.push(`script.js still contains waiting/auto-play marker ${marker}`);
  }

  const interactionStyles = ['--pointer-x', '--pointer-y', '--scroll-pull', 'persistent-product'];
  for (const marker of interactionStyles) {
    if (!css.includes(marker) && !js.includes(marker)) failures.push(`missing product interaction marker ${marker}`);
  }

  if (!css.includes('@media (max-width: 780px)')) failures.push('styles.css missing mobile breakpoint');
  if (!css.includes('prefers-reduced-motion')) failures.push('styles.css missing reduced motion support');
  if (!js.includes('requestAnimationFrame')) failures.push('script.js missing animated render loop');
  if (!netlify.includes('publish = "."')) failures.push('netlify.toml missing static publish directory');
  if (!netlify.includes('[[headers]]')) failures.push('netlify.toml missing headers block');
  if (!redirects.includes('/index.html')) failures.push('_redirects missing index fallback');
}

if (failures.length > 0) {
  console.error(`Site check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Site check passed.');
