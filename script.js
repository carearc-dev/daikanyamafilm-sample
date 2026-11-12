const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
  nav.classList.toggle('open', !isOpen);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  nav.classList.remove('open');
}));

const castTrack = document.querySelector('.cast-grid');
document.querySelectorAll('[data-cast-direction]').forEach(button => {
  button.addEventListener('click', () => {
    const card = castTrack.querySelector('.cast-card');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(castTrack).gap) || 0;
    castTrack.scrollBy({ left: (card.getBoundingClientRect().width + gap) * Number(button.dataset.castDirection), behavior: 'smooth' });
  });
});

const opening = document.querySelector('.opening-screen');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (opening && !reduceMotion) {
  document.body.classList.add('intro-active');
  window.setTimeout(() => {
    document.body.classList.add('intro-leave');
    document.body.classList.remove('intro-active');
  }, 1450);
  window.setTimeout(() => opening.remove(), 2450);
} else {
  opening?.remove();
}

const parallaxTargets = [
  ['.hero-mosaic', 66],
  ['.about-visual', 44],
  ['.work-grid', 52],
  ['.cast-grid', 38],
  ['.company-panel', 46],
  ['.contact-bg', 58],
].map(([selector, distance]) => ({ element: document.querySelector(selector), distance })).filter(item => item.element);

if (!reduceMotion && parallaxTargets.length) {
  let framePending = false;
  const updateParallax = () => {
    const viewportHeight = window.innerHeight;
    for (const { element, distance } of parallaxTargets) {
      const rect = element.getBoundingClientRect();
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));
      element.style.setProperty('--parallax-y', `${(-centeredProgress * distance).toFixed(1)}px`);
    }
    framePending = false;
  };
  const requestParallaxUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateParallax);
  };
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
  requestParallaxUpdate();
}


const workTrack = document.querySelector('.work-grid');
const workSlides = [...document.querySelectorAll('.work-card')];
const workDots = [...document.querySelectorAll('.work-dot')];
const workArrows = [...document.querySelectorAll('[data-work-direction]')];
const workStep = () => {
  if (!workSlides.length || !workTrack) return 0;
  return workSlides[0].getBoundingClientRect().width + (Number.parseFloat(getComputedStyle(workTrack).gap) || 0);
};
const maxWorkIndex = () => {
  const step = workStep();
  if (!step || !workTrack) return 0;
  return Math.max(0, Math.ceil((workTrack.scrollWidth - workTrack.clientWidth - 1) / step));
};
const setWorkSlide = index => {
  if (!workTrack || !workSlides.length) return;
  const clamped = Math.max(0, Math.min(maxWorkIndex(), index));
  workTrack.scrollTo({ left: workStep() * clamped, behavior: 'smooth' });
};
const updateWorkControls = () => {
  if (!workTrack || !workSlides.length) return;
  const maxIndex = maxWorkIndex();
  const current = Math.max(0, Math.min(maxIndex, Math.round(workTrack.scrollLeft / workStep())));
  workDots.forEach((dot, index) => {
    dot.hidden = index > maxIndex;
    if (index === current) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  workArrows.forEach(button => {
    button.disabled = button.dataset.workDirection === '-1' ? current === 0 : current >= maxIndex;
  });
};
workArrows.forEach(button => button.addEventListener('click', () => {
  const current = Math.round(workTrack.scrollLeft / workStep());
  setWorkSlide(current + Number(button.dataset.workDirection));
}));
workDots.forEach((button, index) => button.addEventListener('click', () => setWorkSlide(index)));
if (workTrack && workSlides.length) {
  let workScrollFrame = false;
  workTrack.addEventListener('scroll', () => {
    if (workScrollFrame) return;
    workScrollFrame = true;
    requestAnimationFrame(() => {
      updateWorkControls();
      workScrollFrame = false;
    });
  });
  window.addEventListener('resize', updateWorkControls, { passive: true });
  updateWorkControls();
}
