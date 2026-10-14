/* The MP4 is intentionally never referenced here. The canvas draws one preloaded WebP per frame. */
const canvas = document.getElementById('portrait-canvas');
const context = canvas.getContext('2d', { alpha: false });
const frameCount = 64;
const frames = Array.from({ length: frameCount }, (_, index) => {
  const image = new Image();
  image.src = `public/frames/frame-${String(index).padStart(2, '0')}.webp`;
  return image;
});
const centerFrame = new Image();
centerFrame.src = 'public/frames/center.webp';
let pointer = { x: innerWidth / 2, y: innerHeight / 2 }, smoothAngle = 0, hasPointer = false, lastFrame = -1;
const response = .26;
const source = { width: 1280, height: 720, faceX: 645, faceY: 260 };

function lerpAngle(current, target, amount) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * amount;
}
function fitCanvas() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * ratio); canvas.height = Math.round(innerHeight * ratio);
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
}
function placement() {
  const scale = Math.max(innerWidth / source.width, innerHeight / source.height);
  return { scale, x: (innerWidth - source.width * scale) / 2, y: (innerHeight - source.height * scale) / 2 };
}
function render() {
  const imageBox = placement();
  const faceX = imageBox.x + source.faceX * imageBox.scale, faceY = imageBox.y + source.faceY * imageBox.scale;
  const dx = pointer.x - faceX, dy = pointer.y - faceY;
  const centered = !hasPointer || Math.hypot(dx, dy) < Math.hypot(innerWidth, innerHeight) * .12;
  if (!centered) smoothAngle = lerpAngle(smoothAngle, Math.atan2(dy, dx), response);
  const normalized = (smoothAngle + Math.PI * 2) % (Math.PI * 2);
  const frameIndex = Math.round(normalized / (Math.PI * 2) * frameCount) % frameCount;
  const image = centered ? centerFrame : frames[frameIndex];
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (image.complete && image.naturalWidth) {
    // Exactly one full-opacity frame is painted—never blended with its neighbors.
    context.globalAlpha = 1;
    context.drawImage(image, imageBox.x, imageBox.y, source.width * imageBox.scale, source.height * imageBox.scale);
    lastFrame = centered ? -2 : frameIndex;
  } else if (lastFrame >= 0 && frames[lastFrame].complete) {
    context.drawImage(frames[lastFrame], imageBox.x, imageBox.y, source.width * imageBox.scale, source.height * imageBox.scale);
  }
  requestAnimationFrame(render);
}
addEventListener('resize', fitCanvas, { passive: true });
addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; hasPointer = true; }, { passive: true });
fitCanvas();
Promise.all([...frames, centerFrame].map(image => new Promise(resolve => { image.onload = image.onerror = resolve; }))).then(() => requestAnimationFrame(render));

const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
let cursor = { x: innerWidth / 2, y: innerHeight / 2 }, ringCursor = { ...cursor };
function animateCursor() {
  ringCursor.x += (cursor.x - ringCursor.x) * .18; ringCursor.y += (cursor.y - ringCursor.y) * .18;
  dot.style.transform = `translate(${cursor.x - 3.5}px,${cursor.y - 3.5}px)`;
  ring.style.transform = `translate(${ringCursor.x - 17.5}px,${ringCursor.y - 17.5}px)`;
  requestAnimationFrame(animateCursor);
}
addEventListener('pointermove', event => {
  cursor.x = event.clientX; cursor.y = event.clientY;
  // Keep the custom cursor visible over the portfolio's light paper sections.
  document.body.classList.toggle('light-area', event.target instanceof Element && Boolean(event.target.closest('.content:not(.contact)')));
}, { passive: true });
document.querySelectorAll('a,button').forEach(element => {
  element.addEventListener('pointerenter', () => document.body.classList.add('hovering'));
  element.addEventListener('pointerleave', () => document.body.classList.remove('hovering'));
});
animateCursor();


// Give the paper sections a little motion as they enter the viewport.
const revealItems = document.querySelectorAll('.content .split, .content .rule, .skill, .project');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((item, index) => {
    item.setAttribute('data-reveal', '');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 85}ms`);
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 3;
    const rotateX = (.5 - (event.clientY - bounds.top) / bounds.height) * 3;
    card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, { passive: true });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
