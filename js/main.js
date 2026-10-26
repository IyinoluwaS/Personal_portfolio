// Opens and closes the hamburger menu in the top bar.
const menuButton = document.querySelector('.iconbtn');
const menu = document.getElementById('site-menu');
const openIcon = menuButton.querySelector('.icon-open');
const closeIcon = menuButton.querySelector('.icon-close');

function setMenuOpen(isOpen) {
  menu.hidden = !isOpen;
  openIcon.hidden = isOpen;
  closeIcon.hidden = !isOpen;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => setMenuOpen(menu.hidden));

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu.hidden) {
    setMenuOpen(false);
    menuButton.focus();
  }
});
