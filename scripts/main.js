// Nav — add scrolled class for frosted glass effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// Scroll reveal — fade + slide elements into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isK    = el.dataset.unit === 'k';
  const dur    = 1400;
  const start  = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / dur, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const raw      = eased * target;

    el.textContent = isK
      ? (raw / 1000).toFixed(1)
      : Math.round(raw);

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__n[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// Contact form — Formspree submit without leaving the page
const msgForm    = document.getElementById('msgForm');
const msgSuccess = document.getElementById('msgSuccess');

if (msgForm && msgSuccess) {
  msgForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = msgForm.querySelector('.msg-submit');
    submitBtn.disabled = true;

    try {
      const res = await fetch(msgForm.action, {
        method: 'POST',
        body: new FormData(msgForm),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Formspree error: ${res.status}`);
      msgForm.querySelectorAll('.msg-field, .msg-submit').forEach(el => el.hidden = true);
      msgSuccess.hidden = false;
    } catch (err) {
      submitBtn.disabled = false;
      console.error(err);
    }
  });
}
