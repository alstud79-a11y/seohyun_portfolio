/* Award links reuse the existing film tab switching and original video sources. */
(() => {
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-award-film]').forEach(link => {
    const activate = () => {
      if (link.dataset.awardFilm === 'hunmin') {
        openAwardPhoto(0, link);
        return;
      }
      const tab = document.querySelector(`.film-tab[data-film="${link.dataset.awardFilm}"]`);
      if (!tab) return;
      tab.click();
      const top = document.querySelector('.film-tabs').getBoundingClientRect().top + window.scrollY;
      const headerHeight = document.getElementById('header').getBoundingClientRect().height;
      window.scrollTo({ top: Math.max(0, top - headerHeight - 20), behavior: reducedMotion() ? 'instant' : 'smooth' });
      tab.focus({ preventScroll: true });
    };
    link.addEventListener('click', activate);
    link.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  const dialog = document.getElementById('awardPhotoDialog');
  const full = document.getElementById('awardPhotoFull');
  let opener = null;
  let previousOverflow = '';
  const photos = [
    { src: 'assets/hunmin-award-certificate.png', alt: '최우수상 상장 사진' },
    { src: 'assets/hunmin-award-portrait.png', alt: '시상식 단독사진' },
    { src: 'assets/hunmin-award-group.png', alt: '시상식 단체사진' }
  ];
  let photoIndex = 0;
  const renderPhoto = () => {
    const image = photos[photoIndex];
    full.src = image.src;
    full.alt = image.alt;
    document.getElementById('awardPhotoCaption').textContent = `${photoIndex + 1} / ${photos.length} · ${image.alt}`;
    dialog.querySelectorAll('[data-award-photo]').forEach((button, index) => button.setAttribute('aria-pressed', String(index === photoIndex)));
  };
  function openAwardPhoto(index, trigger) {
    photoIndex = index;
    opener = trigger;
    renderPhoto();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }
  dialog.querySelectorAll('[data-award-photo]').forEach(button => {
    button.addEventListener('click', () => {
      photoIndex = Number(button.dataset.awardPhoto);
      renderPhoto();
    });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    photoIndex = (photoIndex + (event.key === 'ArrowRight' ? 1 : photos.length - 1)) % photos.length;
    renderPhoto();
  });
  document.getElementById('awardViewFilm').addEventListener('click', () => {
    dialog.close();
    document.querySelector('.film-tab[data-film="hunmin"]').click();
    const target = document.querySelector('.film-tabs');
    const offset = document.getElementById('header').getBoundingClientRect().height + 20;
    window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: reducedMotion() ? 'instant' : 'smooth'});
    document.querySelector('.film-tab[data-film="hunmin"]').focus({preventScroll:true});
  });
  dialog.querySelector('.award-photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
})();
