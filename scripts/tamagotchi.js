/* ── Tamagotchi — Leo 🐾 ────────────────────── */
const tama   = document.getElementById('tamagotchi');
const canvas = document.getElementById('tamaCanvas');
const ctx    = canvas.getContext('2d');

/* ── drag ─────────────────────────────────── */
let dragging = false, ox = 0, oy = 0;
tama.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('tama-btn')) return;
  dragging = true;
  const r = tama.getBoundingClientRect();
  ox = e.clientX - r.left; oy = e.clientY - r.top;
  tama.style.transition = 'none';
  e.preventDefault();
});
document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  tama.style.right = 'auto'; tama.style.bottom = 'auto';
  tama.style.left = `${e.clientX - ox}px`;
  tama.style.top  = `${e.clientY - oy}px`;
});
document.addEventListener('mouseup', () => { dragging = false; tama.style.transition = ''; });

/* ── pet state ─────────────────────────────── */
const pet = {
  x: 40, y: 36, tick: 0,
  blinkTimer: 0, blinking: false,
  mood: 'idle', moodTimer: 0,
  dir: 1,
  heartFrame: -1, zFrame: -1,
};

/* ── LCD palette ───────────────────────────── */
const BG     = '#a8c090';   // LCD surface
const DARK   = '#1a3010';   // outlines / "dark brown"
const GOLDEN = '#3a6020';   // golden/tan patches (medium)
const CREAM  = '#c8deb0';   // white/cream fur
const BRIGHT = '#dceec4';   // bright chest / muzzle
const TONGUE = '#2e5018';   // pink tongue (darker mid-green)

function clear() {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, 80, 60);
  ctx.fillStyle = 'rgba(0,0,0,0.035)';
  for (let y = 0; y < 60; y += 2) ctx.fillRect(0, y, 80, 1);
}

/* ── draw Leo ──────────────────────────────── */
function drawLeo(x, y) {
  const happy  = pet.mood === 'happy';
  const sleepy = pet.mood === 'sleepy';
  const walk   = pet.mood === 'walk';

  const bounce = happy ? Math.abs(Math.sin(pet.tick * 0.32)) * -4
               : walk  ? Math.sin(pet.tick * 0.4) * -1.5 : 0;
  const bx = x, by = y + bounce;
  const legAlt = Math.floor(pet.tick / 14) % 2;

  /* ── TAIL — fluffy, curled up, cream with golden tip ── */
  const wag = sleepy ? 5
    : happy ? Math.sin(pet.tick * 0.38) * 32
    : Math.sin(pet.tick * 0.18) * 14;
  ctx.save();
  ctx.translate(bx + 12, by + 2);
  ctx.rotate((wag * Math.PI) / 180);
  // tail base
  ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(7,-6,5,-15); ctx.stroke();
  // golden patch near tip
  ctx.strokeStyle = GOLDEN; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(4,-10); ctx.quadraticCurveTo(6,-13,5,-15); ctx.stroke();
  // fluffy tip
  ctx.fillStyle = CREAM;
  ctx.beginPath(); ctx.ellipse(5,-16,3,3,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  /* ── BODY — fluffy cream oval ── */
  ctx.fillStyle = CREAM;
  ctx.beginPath(); ctx.ellipse(bx, by+4, 14, 11, 0, 0, Math.PI*2); ctx.fill();
  // soft outline
  ctx.strokeStyle = GOLDEN; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(bx, by+4, 14, 11, 0, 0, Math.PI*2); ctx.stroke();
  // bright chest
  ctx.fillStyle = BRIGHT;
  ctx.beginPath(); ctx.ellipse(bx-4, by+5, 9, 8, -0.2, 0, Math.PI*2); ctx.fill();

  /* ── LEGS — cream with slight golden tops ── */
  const lc = [
    [bx-8,  legAlt ? 1:0],
    [bx-3,  legAlt ? 0:1],
    [bx+4,  legAlt ? 0:1],
    [bx+9,  legAlt ? 1:0],
  ];
  lc.forEach(([lx, lo]) => {
    ctx.fillStyle = CREAM;
    ctx.beginPath(); ctx.ellipse(lx, by+14+lo, 3, 3.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = GOLDEN; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.ellipse(lx, by+14+lo, 3, 3.5, 0, 0, Math.PI*2); ctx.stroke();
    // paw
    ctx.fillStyle = BRIGHT;
    ctx.beginPath(); ctx.ellipse(lx, by+17+lo, 2.5, 1.6, 0, 0, Math.PI*2); ctx.fill();
  });

  /* ── HEAD — round, fluffy, cream base ── */
  const hx = bx - 6, hy = by - 12;

  // head base (cream)
  ctx.fillStyle = CREAM;
  ctx.beginPath(); ctx.ellipse(hx, hy, 12, 11, -0.1, 0, Math.PI*2); ctx.fill();
  // golden patch on top of head (characteristic marking)
  ctx.fillStyle = GOLDEN;
  ctx.beginPath(); ctx.ellipse(hx, hy-5, 9, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx-5, hy-2, 5, 4, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx+5, hy-2, 4, 3.5, 0.3, 0, Math.PI*2); ctx.fill();

  /* ── EARS — large, floppy, golden with cream inside ── */
  // left ear
  ctx.fillStyle = GOLDEN;
  ctx.beginPath();
  ctx.moveTo(hx-10, hy-3);
  ctx.quadraticCurveTo(hx-18, hy-10, hx-14, hy+4);
  ctx.quadraticCurveTo(hx-10, hy+8, hx-7, hy+4);
  ctx.closePath(); ctx.fill();
  // inner left
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.moveTo(hx-10, hy-1);
  ctx.quadraticCurveTo(hx-15, hy-6, hx-12, hy+3);
  ctx.quadraticCurveTo(hx-10, hy+6, hx-8, hy+3);
  ctx.closePath(); ctx.fill();
  // right ear
  ctx.fillStyle = GOLDEN;
  ctx.beginPath();
  ctx.moveTo(hx+8, hy-4);
  ctx.quadraticCurveTo(hx+16, hy-10, hx+13, hy+4);
  ctx.quadraticCurveTo(hx+9, hy+8, hx+6, hy+3);
  ctx.closePath(); ctx.fill();
  // inner right
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.moveTo(hx+8, hy-2);
  ctx.quadraticCurveTo(hx+13, hy-6, hx+11, hy+3);
  ctx.quadraticCurveTo(hx+9, hy+6, hx+7, hy+2);
  ctx.closePath(); ctx.fill();

  /* ── MUZZLE — bright cream ── */
  ctx.fillStyle = BRIGHT;
  ctx.beginPath(); ctx.ellipse(hx, hy+5, 6, 4.5, 0, 0, Math.PI*2); ctx.fill();

  /* ── EYES ── */
  if (pet.blinking || sleepy) {
    ctx.strokeStyle = DARK; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx-5,hy-1); ctx.lineTo(hx-2,hy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx+1,hy-1); ctx.lineTo(hx+4,hy); ctx.stroke();
  } else {
    // whites
    ctx.fillStyle = '#e0f0d0';
    ctx.beginPath(); ctx.ellipse(hx-3.5,hy-1.5,3.2,3.2,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx+3,  hy-1.5,3.2,3.2,0,0,Math.PI*2); ctx.fill();
    // iris (dark brown)
    ctx.fillStyle = DARK;
    ctx.beginPath(); ctx.ellipse(hx-3.5,hy-1,2,2,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx+3,  hy-1,2,2,0,0,Math.PI*2); ctx.fill();
    // shine
    ctx.fillStyle = '#f0fce8';
    ctx.beginPath(); ctx.ellipse(hx-3,hy-2.5,0.8,0.8,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx+3.5,hy-2.5,0.8,0.8,0,0,Math.PI*2); ctx.fill();
  }

  /* ── NOSE ── */
  ctx.fillStyle = DARK;
  ctx.beginPath(); ctx.ellipse(hx, hy+3, 2.8,2, 0,0,Math.PI*2); ctx.fill();
  // shiny highlight on nose
  ctx.fillStyle = '#c0d8a8';
  ctx.beginPath(); ctx.ellipse(hx-0.8,hy+2.2,0.9,0.7,0,0,Math.PI*2); ctx.fill();

  /* ── MOUTH + TONGUE — Leo's signature happy grin ── */
  if (!sleepy) {
    // open mouth
    ctx.fillStyle = DARK;
    ctx.beginPath();
    ctx.moveTo(hx-4.5, hy+6);
    ctx.quadraticCurveTo(hx, hy+11, hx+4.5, hy+6);
    ctx.quadraticCurveTo(hx, hy+8.5, hx-4.5, hy+6);
    ctx.fill();
    // tongue (represents pink — darker in LCD)
    ctx.fillStyle = TONGUE;
    ctx.beginPath(); ctx.ellipse(hx, hy+9, 3.5, 3, 0, 0, Math.PI*2); ctx.fill();
    // tongue line
    ctx.strokeStyle = DARK; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx, hy+6.5);
    ctx.lineTo(hx, hy+11.5);
    ctx.stroke();
  } else {
    // sleeping: closed mouth with tiny snore
    ctx.strokeStyle = DARK; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx-2,hy+7); ctx.lineTo(hx+2,hy+7); ctx.stroke();
  }

  /* ── COLLAR — pink (darker in LCD) ── */
  ctx.fillStyle = TONGUE;
  ctx.fillRect(hx-8, hy+11, 16, 3);
  ctx.fillStyle = CREAM;
  ctx.fillRect(hx-8, hy+11, 16, 1);
  // ID tag
  ctx.fillStyle = TONGUE;
  ctx.beginPath(); ctx.arc(hx, hy+16, 2.8, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = BRIGHT;
  ctx.font = 'bold 3.5px monospace'; ctx.textAlign = 'center';
  ctx.fillText('L', hx, hy+17.2);
}

/* ── hearts ────────────────────────────────── */
function drawHeart(x, y, s, a) {
  ctx.globalAlpha = a; ctx.fillStyle = DARK;
  ctx.beginPath();
  ctx.moveTo(x, y+s*.4);
  ctx.bezierCurveTo(x,y-s*.2,x-s,y-s*.2,x-s,y+s*.4);
  ctx.bezierCurveTo(x-s,y+s,x,y+s*1.4,x,y+s*1.6);
  ctx.bezierCurveTo(x,y+s*1.4,x+s,y+s,x+s,y+s*.4);
  ctx.bezierCurveTo(x+s,y-s*.2,x,y-s*.2,x,y+s*.4);
  ctx.fill(); ctx.globalAlpha = 1;
}

/* ── loop ──────────────────────────────────── */
function loop() {
  pet.tick++;
  pet.blinkTimer++;
  if (pet.blinkTimer > 85 && !pet.blinking) { pet.blinking = true; pet.blinkTimer = 0; }
  if (pet.blinking && pet.blinkTimer > 6)    { pet.blinking = false; }
  if (pet.moodTimer > 0 && --pet.moodTimer === 0 && pet.mood !== 'idle') pet.mood = 'idle';

  if (pet.mood === 'walk') {
    pet.x += pet.dir * 0.75;
    if (pet.x > 62) pet.dir = -1;
    if (pet.x < 18) pet.dir =  1;
  }

  clear();
  drawLeo(pet.x, pet.y);

  if (pet.heartFrame >= 0 && pet.heartFrame < 45) {
    drawHeart(pet.x+18, pet.y - 8  - pet.heartFrame*.4, 4, 1-pet.heartFrame/45);
    drawHeart(pet.x+24, pet.y - 14 - pet.heartFrame*.3, 3, 1-pet.heartFrame/45);
    pet.heartFrame++;
  } else if (pet.heartFrame >= 45) pet.heartFrame = -1;

  if (pet.zFrame >= 0 && pet.zFrame < 65) {
    const a = 1 - pet.zFrame/65;
    ctx.globalAlpha = a; ctx.fillStyle = DARK;
    ctx.font = 'bold 9px monospace'; ctx.textAlign = 'left';
    ctx.fillText('z', pet.x+14, pet.y - 8  - pet.zFrame*.25);
    ctx.font = 'bold 7px monospace';
    ctx.fillText('z', pet.x+20, pet.y - 14 - pet.zFrame*.2);
    ctx.globalAlpha = 1;
    pet.zFrame++;
  } else if (pet.zFrame >= 65) pet.zFrame = -1;

  requestAnimationFrame(loop);
}
loop();

/* ── buttons ───────────────────────────────── */
document.getElementById('tamaFeed') .addEventListener('click', () => { pet.mood='happy';  pet.moodTimer=90;  pet.heartFrame=0; });
document.getElementById('tamaPlay') .addEventListener('click', () => { pet.mood='walk';   pet.moodTimer=120; });
document.getElementById('tamaSleep').addEventListener('click', () => { pet.mood='sleepy'; pet.moodTimer=150; pet.zFrame=0; });
