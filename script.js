const progressBar = document.querySelector('.scroll-meter span');
const scenes = [...document.querySelectorAll('.scene')];
const nutrientField = document.querySelector('.nutrient-field');
const loaderScreen = document.querySelector('.loader-screen');
const whiteFlash = document.querySelector('.white-flash');
const autoButton = document.querySelector('.video-mode-toggle');
const showcaseStrip = document.querySelector('.showcase-strip');
let autoSceneIndex = 0;

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle('scene-active', entry.isIntersecting);
    }
  },
  { threshold: 0.32 }
);

for (const scene of scenes) observer.observe(scene);

if (nutrientField) {
  const dots = 42;
  for (let index = 0; index < dots; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'nutrient-dot';
    dot.style.left = `${18 + Math.random() * 64}%`;
    dot.style.top = `${36 + Math.random() * 46}%`;
    dot.style.setProperty('--scale', (0.65 + Math.random() * 1.45).toFixed(2));
    dot.style.setProperty('--duration', `${3.4 + Math.random() * 4.8}s`);
    dot.style.animationDelay = `${Math.random() * 2.8}s`;
    nutrientField.append(dot);
  }
}

window.addEventListener('load', () => {
  setTimeout(() => {
    loaderScreen?.classList.add('loading-out');
    whiteFlash?.classList.add('flash');
  }, 850);
});

autoButton?.addEventListener('click', () => {
  autoSceneIndex = (autoSceneIndex + 1) % scenes.length;
  scenes[autoSceneIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  whiteFlash?.classList.remove('flash');
  window.setTimeout(() => whiteFlash?.classList.add('flash'), 20);
});

if (showcaseStrip) {
  let showcaseDirection = 1;
  window.setInterval(() => {
    const max = showcaseStrip.scrollWidth - showcaseStrip.clientWidth;
    if (max <= 0) return;
    if (showcaseStrip.scrollLeft >= max - 4) showcaseDirection = -1;
    if (showcaseStrip.scrollLeft <= 4) showcaseDirection = 1;
    showcaseStrip.scrollBy({ left: showcaseDirection * 280, behavior: 'smooth' });
  }, 2600);
}

function render() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100;
  progressBar?.style.setProperty('--progress', `${Math.min(progress, 100)}%`);

  const depth = window.scrollY * 0.04;
  document.body.style.setProperty('--depth', depth.toFixed(2));
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
