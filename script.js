const shots = [...document.querySelectorAll('.shot')];
const dotsWrap = document.querySelector('.timeline-dots');
const progress = document.querySelector('.shot-progress span');
const wipe = document.querySelector('.wipe-bar');
const shotDuration = 4200;
let currentShot = 0;
let startedAt = performance.now();

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

  requestAnimationFrame(render);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') activateShot(currentShot + 1);
  if (event.key === 'ArrowLeft') activateShot(currentShot - 1);
});

requestAnimationFrame(render);
