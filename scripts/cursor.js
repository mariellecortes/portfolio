const cursor = document.getElementById('cursor');

if (navigator.maxTouchPoints === 0) {
  let mouseX = -100, mouseY = -100;
  let curX = -100, curY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function loop() {
    curX += (mouseX - curX) * 0.28;
    curY += (mouseY - curY) * 0.28;
    cursor.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mousedown', () => cursor.classList.add('cursor--press'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('cursor--press'));

  const sel = 'a, button, label, .device__key, .hobby, .topbar__link, .topbar__cta, .exp-btn, .player__btn, .upload-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(sel)) cursor.classList.add('cursor--hover');
    else cursor.classList.remove('cursor--hover');
  });
}
