const avatarImg  = document.getElementById('avatarImg');
const toggleBtn  = document.getElementById('avatarToggle');
let showingAvatar = true;

const photoStyles = {
  objectFit:      'cover',
  objectPosition: 'center 22%',
  filter:         'brightness(1.08) contrast(1.2)',
};

const avatarStyles = {
  objectFit:      'contain',
  objectPosition: 'left bottom',
  filter:         '',
};

function applyStyles(styles) {
  Object.assign(avatarImg.style, styles);
}

toggleBtn.addEventListener('click', () => {
  avatarImg.style.opacity = '0';
  setTimeout(() => {
    if (showingAvatar) {
      avatarImg.src = 'assets/photo.png';
      applyStyles(photoStyles);
      toggleBtn.textContent = '✦ avatar';
    } else {
      avatarImg.src = 'assets/avatar.png';
      applyStyles(avatarStyles);
      toggleBtn.textContent = '✦ real me';
    }
    showingAvatar = !showingAvatar;
    avatarImg.style.opacity = '1';
  }, 250);
});
