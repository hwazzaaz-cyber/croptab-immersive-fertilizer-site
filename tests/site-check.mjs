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

  const sections = [...html.matchAll(/<section\b/gi)].length;
  if (sections < 7) failures.push(`expected at least 7 cinematic shots, found ${sections}`);

  const requiredCopy = ['CropTab', 'fertilizer', 'soil', 'root', 'Nitrogen', 'Phosphorus', 'Potassium'];
  for (const term of requiredCopy) {
    if (!html.includes(term)) failures.push(`index.html missing "${term}"`);
  }

  if (!html.includes('name="viewport"')) failures.push('index.html missing mobile viewport meta');
  if (!html.includes('aria-label="Cinematic shot progress"')) failures.push('index.html missing accessible cinematic progress');
  const cinematicMarkers = [
    'class="cinematic-stage"',
    'class="shot',
    'hero-product',
    'wipe-bar',
    'class="photo-panel',
    'farm-panorama',
    'class="timeline-dots"',
    'class="shot-progress"',
  ];
  for (const marker of cinematicMarkers) {
    if (!html.includes(marker)) failures.push(`index.html missing cinematic marker ${marker}`);
  }

  const removedOldMarkers = ['root-system', 'panel-grid', 'showcase-strip', 'soil-window', 'video-mode-toggle'];
  for (const marker of removedOldMarkers) {
    if (html.includes(marker) || css.includes(marker) || js.includes(marker)) failures.push(`old version marker still present: ${marker}`);
  }

  const styleMarkers = ['cinematic-stage', 'shot-active', 'cream-wipe', 'image-grain', 'kenburns', 'glass-label'];
  for (const marker of styleMarkers) {
    if (!css.includes(marker)) failures.push(`styles.css missing cinematic style ${marker}`);
  }

  const scriptMarkers = ['shots', 'activateShot', 'requestAnimationFrame', 'timeline-dots', 'pointermove', 'wheel', 'scrollImpulse', 'click'];
  for (const marker of scriptMarkers) {
    if (!js.includes(marker)) failures.push(`script.js missing cinematic behavior ${marker}`);
  }

  const forbiddenTimingMarkers = ['shotDuration', 'setInterval'];
  for (const marker of forbiddenTimingMarkers) {
    if (js.includes(marker)) failures.push(`script.js still contains waiting/auto-play marker ${marker}`);
  }

  const interactionStyles = ['--pointer-x', '--pointer-y', '--scroll-pull', 'cursor-follow'];
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
