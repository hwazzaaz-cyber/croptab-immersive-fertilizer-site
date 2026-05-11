const shots = [...document.querySelectorAll('.shot')];
const dotsWrap = document.querySelector('.timeline-dots');
const progress = document.querySelector('.shot-progress span');
const wipe = document.querySelector('.wipe-bar');
const stage = document.querySelector('.cinematic-stage');
const shotDuration = 4200;
let currentShot = 0;
let startedAt = performance.now();
let scrollImpulse = 0;
let wheelLock = false;
let pointerTimer;

function flashWipe() {
  wipe?.classList.remove('run');
  void wipe?.offsetWidth;
  wipe?.classList.add('run');
}

function activateShot(index) {
  currentShot = (index + shots.length) % shots.length;
  startedAt = performance.now();

  shots.forEach((shot, shotIndex) => {
    shot.classList.toggle('shot-active', shotIndex === currentShot);
  });

  document.querySelectorAll('.timeline-dots button').forEach((button, dotIndex) => {
    button.classList.toggle('active', dotIndex === currentShot);
  });

  flashWipe();
}

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  stage?.style.setProperty('--pointer-x', `${(x * 34).toFixed(1)}px`);
  stage?.style.setProperty('--pointer-y', `${(y * 30).toFixed(1)}px`);
  stage?.style.setProperty('--tilt-x', `${(x * 10).toFixed(2)}deg`);
  stage?.style.setProperty('--tilt-y', `${(-y * 8).toFixed(2)}deg`);
  stage?.classList.add('pointer-active');
  clearTimeout(pointerTimer);
  pointerTimer = setTimeout(() => stage?.classList.remove('pointer-active'), 900);
});

window.addEventListener('wheel', (event) => {
  event.preventDefault();
  scrollImpulse = Math.max(-42, Math.min(42, event.deltaY * 0.18));
  stage?.style.setProperty('--scroll-pull', `${scrollImpulse.toFixed(1)}px`);

  if (!wheelLock && Math.abs(event.deltaY) > 18) {
    wheelLock = true;
    activateShot(currentShot + (event.deltaY > 0 ? 1 : -1));
    setTimeout(() => {
      wheelLock = false;
    }, 720);
  }
}, { passive: false });

shots.forEach((shot, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Show shot ${index + 1}`);
  button.addEventListener('click', () => activateShot(index));
  dotsWrap?.append(button);
});

activateShot(0);

function render(now) {
  const elapsed = now - startedAt;
  const pct = Math.min((elapsed / shotDuration) * 100, 100);
  progress?.style.setProperty('--shot-progress', `${pct}%`);

  if (elapsed >= shotDuration) {
    activateShot(currentShot + 1);
  }

  scrollImpulse *= 0.88;
  if (Math.abs(scrollImpulse) < 0.3) scrollImpulse = 0;
  stage?.style.setProperty('--scroll-pull', `${scrollImpulse.toFixed(1)}px`);

  requestAnimationFrame(render);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') activateShot(currentShot + 1);
  if (event.key === 'ArrowLeft') activateShot(currentShot - 1);
});

requestAnimationFrame(render);
