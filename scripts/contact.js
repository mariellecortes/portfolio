const modal   = document.getElementById('msgModal');
const openBtn  = document.getElementById('openMsg');
const closeBtn = document.getElementById('msgClose');
const overlay  = document.getElementById('msgOverlay');
const form     = document.getElementById('msgForm');
const success  = document.getElementById('msgSuccess');

function openModal()  { modal.classList.add('is-open');    modal.setAttribute('aria-hidden', 'false'); }
function closeModal() { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');  }

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form);
  const res  = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  if (res.ok) {
    form.hidden   = true;
    success.hidden = false;
  }
});
