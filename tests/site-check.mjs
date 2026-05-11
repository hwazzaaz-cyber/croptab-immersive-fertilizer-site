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
  if (sections < 5) failures.push(`expected at least 5 sections, found ${sections}`);

  const requiredCopy = ['CropTab', 'fertilizer', 'soil', 'root', 'Nitrogen', 'Phosphorus', 'Potassium'];
  for (const term of requiredCopy) {
    if (!html.includes(term)) failures.push(`index.html missing "${term}"`);
  }

  if (!html.includes('name="viewport"')) failures.push('index.html missing mobile viewport meta');
  if (!html.includes('aria-label="Scroll progress"')) failures.push('index.html missing accessible scroll progress');
  if (!html.includes('class="nutrient-field"')) failures.push('index.html missing nutrient-field visual layer');
  const videoLikeMarkers = [
    'class="loader-screen"',
    'class="browser-chrome"',
    'showcase-strip',
    'class="white-flash"',
    'class="product-stage"',
    'class="animal-card"',
    'class="crop-photo"',
    'class="video-mode-toggle"',
  ];
  for (const marker of videoLikeMarkers) {
    if (!html.includes(marker)) failures.push(`index.html missing video-like marker ${marker}`);
  }

  const styleMarkers = ['screen-glow', 'wipe-in', 'slide-showcase', 'loading-out', 'chrome-dot'];
  for (const marker of styleMarkers) {
    if (!css.includes(marker)) failures.push(`styles.css missing video-like style ${marker}`);
  }

  const scriptMarkers = ['loader-screen', 'showcase-strip', 'video-mode-toggle', 'scrollIntoView'];
  for (const marker of scriptMarkers) {
    if (!js.includes(marker)) failures.push(`script.js missing video-like behavior ${marker}`);
  }

  if (!css.includes('@media (max-width: 720px)')) failures.push('styles.css missing mobile breakpoint');
  if (!css.includes('prefers-reduced-motion')) failures.push('styles.css missing reduced motion support');
  if (!js.includes('IntersectionObserver')) failures.push('script.js missing section reveal observer');
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
