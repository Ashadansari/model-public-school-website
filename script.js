(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target.id;
        const active = target === 'approach' ? 'academics' : target;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  const galleryItems = [
    ['images/school-assembly.webp', 'Students gathered outside the school building'],
    ['images/morning-gathering.webp', 'Students assembled outdoors'],
    ['images/student-recognition.webp', 'A student receives a book from a teacher'],
    ['images/school-community.webp', 'Students and teachers together after an activity'],
    ['images/celebrating-learning.webp', 'A teacher congratulates a student'],
    ['images/student-journey.webp', 'A student sitting on a school bus with classmates']
  ];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('figure img');
  const lightboxCaption = lightbox.querySelector('figcaption');
  const lightboxCount = lightbox.querySelector('.lightbox-count');
  let currentPhoto = 0;
  let previousFocus = null;
  const showPhoto = index => {
    currentPhoto = (index + galleryItems.length) % galleryItems.length;
    const [src, alt] = galleryItems[currentPhoto];
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightboxCount.textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  };
  const openLightbox = index => {
    previousFocus = document.activeElement;
    showPhoto(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.lightbox-close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (previousFocus) previousFocus.focus();
  };
  document.querySelectorAll('.gallery-photo').forEach(button => button.addEventListener('click', () => openLightbox(Number(button.dataset.index))));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });

  const form = document.querySelector('#enquiry-form');
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.className = 'form-status';
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please check the required fields and try again.';
      status.classList.add('error');
      return;
    }
    const fields = new FormData(form);
    const body = [
      `Parent / Guardian: ${fields.get('guardian')}`,
      `Phone: ${fields.get('phone')}`,
      `Email: ${fields.get('email') || 'Not provided'}`,
      `Student: ${fields.get('student') || 'Not provided'}`,
      '',
      'Message:',
      fields.get('message')
    ].join('\n');
    const mailto = `mailto:modelpublicschool2063@gmail.com?subject=${encodeURIComponent('Enquiry for Model Public School')}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app should open with the enquiry prepared. Review it and send it to the school.';
    window.location.href = mailto;
  });

  const subjectDialog = document.querySelector('#subject-catalog');
  document.querySelector('.subject-catalog-trigger').addEventListener('click', () => subjectDialog.showModal());
  document.querySelector('.subject-dialog-close').addEventListener('click', () => subjectDialog.close());
  subjectDialog.addEventListener('click', event => {
    if (event.target === subjectDialog) subjectDialog.close();
  });

  const learningDetailDialog = document.querySelector('#learning-detail-dialog');
  const detailTitle = document.querySelector('#learning-detail-title');
  const detailSummary = document.querySelector('#learning-detail-summary');
  const detailCopy = document.querySelector('#learning-detail-copy');
  document.querySelectorAll('.learning-detail-trigger').forEach(button => {
    button.addEventListener('click', () => {
      detailTitle.textContent = button.dataset.title;
      detailSummary.textContent = button.dataset.summary;
      detailCopy.textContent = button.dataset.detail;
      learningDetailDialog.showModal();
    });
  });
  document.querySelector('.feature-dialog-close').addEventListener('click', () => learningDetailDialog.close());
  learningDetailDialog.addEventListener('click', event => {
    if (event.target === learningDetailDialog) learningDetailDialog.close();
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
  if (reduceMotion) document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
})();
