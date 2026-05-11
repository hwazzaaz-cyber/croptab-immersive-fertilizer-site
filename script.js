const panels = [...document.querySelectorAll('.web-panel')];
const stage = document.querySelector('.web-stage');
const product = document.querySelector('.persistent-product');
const dotsWrap = document.querySelector('.panel-dots');
const progress = document.querySelector('.panel-progress span');
const wipe = document.querySelector('.panel-wipe');

const productPositions = {
  center: { x: '50vw', y: '50vh', scale: 1, opacity: 1 },
  left: { x: '31vw', y: '53vh', scale: 0.64, opacity: 1 },
  bottom: { x: '50vw', y: '86vh', scale: 0.72, opacity: 1 },
  water: { x: '50vw', y: '49vh', scale: 0.92, opacity: 1 },
  cube: { x: '74vw', y: '48vh', scale: 0.9, opacity: 1 },
  hidden: { x: '50vw', y: '50vh', scale: 0.72, opacity: 0 },
};

let activePanel = 0;
let scrollImpulse = 0;
let wheelLock = false;
let pointerTimer;

function runWipe() {
  wipe?.classList.remove('run');
  void wipe?.offsetWidth;
  wipe?.classList.add('run');
}

function setProduct(positionName) {
  const position = productPositions[positionName] ?? productPositions.center;
  product?.style.setProperty('--product-x', position.x);
  product?.style.setProperty('--product-y', position.y);
  product?.style.setProperty('--product-scale', position.scale);
  product?.style.setProperty('--product-opacity', position.opacity);
}

function activatePanel(index) {
  activePanel = (index + panels.length) % panels.length;
  panels.forEach((panel, panelIndex) => {
    panel.classList.toggle('panel-active', panelIndex === activePanel);
  });

  document.querySelectorAll('.panel-dots button').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === activePanel);
  });

  const pct = panels.length <= 1 ? 100 : (activePanel / (panels.length - 1)) * 100;
  progress?.style.setProperty('--panel-progress', `${pct}%`);
  setProduct(panels[activePanel]?.dataset.product);
  runWipe();
}

panels.forEach((panel, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Show panel ${index + 1}`);
  button.addEventListener('click', () => activatePanel(index));
  dotsWrap?.append(button);
});

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  stage?.style.setProperty('--pointer-x', `${(x * 30).toFixed(1)}px`);
  stage?.style.setProperty('--pointer-y', `${(y * 26).toFixed(1)}px`);
  stage?.style.setProperty('--tilt-x', `${(x * 10).toFixed(2)}deg`);
  stage?.style.setProperty('--tilt-y', `${(-y * 8).toFixed(2)}deg`);
  product?.classList.add('pointer-active');
  clearTimeout(pointerTimer);
  pointerTimer = setTimeout(() => product?.classList.remove('pointer-active'), 700);
});

window.addEventListener('wheel', (event) => {
  event.preventDefault();
  scrollImpulse = Math.max(-40, Math.min(40, event.deltaY * 0.16));
  stage?.style.setProperty('--scroll-pull', `${scrollImpulse.toFixed(1)}px`);
  if (!wheelLock && Math.abs(event.deltaY) > 16) {
    wheelLock = true;
    activatePanel(activePanel + (event.deltaY > 0 ? 1 : -1));
    setTimeout(() => {
      wheelLock = false;
    }, 560);
  }
}, { passive: false });

stage?.addEventListener('click', (event) => {
  if (event.target.closest('.panel-dots button, a, button')) return;
  scrollImpulse = 24;
  stage.style.setProperty('--scroll-pull', `${scrollImpulse.toFixed(1)}px`);
  activatePanel(activePanel + 1);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') activatePanel(activePanel + 1);
  if (event.key === 'ArrowLeft') activatePanel(activePanel - 1);
});

function render() {
  scrollImpulse *= 0.88;
  if (Math.abs(scrollImpulse) < 0.25) scrollImpulse = 0;
  stage?.style.setProperty('--scroll-pull', `${scrollImpulse.toFixed(1)}px`);
  requestAnimationFrame(render);
}

activatePanel(0);
requestAnimationFrame(render);
