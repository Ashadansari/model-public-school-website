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
  const subjectTitle = document.querySelector('#subject-catalog-title');
  const subjectEyebrow = document.querySelector('#subject-catalog-eyebrow');
  const subjectIntro = document.querySelector('#subject-catalog-intro');
  const subjectItems = [...subjectDialog.querySelectorAll('.subject-catalog-list li')];
  const subjectTranslationButton = document.querySelector('#subject-translation-toggle');
  const subjectEnglish = {
    title: 'Major subjects',
    eyebrow: 'Model Public School',
    intro: 'Explore the major subjects offered at our school.',
    subjects: ['English', 'Mathematics', 'Computer', 'Urdu', 'Quran', 'Science']
  };
  const subjectNepali = {
    title: 'प्रमुख विषयहरू',
    eyebrow: 'मोडेल पब्लिक स्कुल',
    intro: 'हाम्रो विद्यालयमा पढाइने प्रमुख विषयहरू हेर्नुहोस्।',
    subjects: ['अङ्ग्रेजी', 'गणित', 'कम्प्युटर', 'उर्दू', 'कुरआन', 'विज्ञान']
  };
  const setSubjectLanguage = nepali => {
    const language = nepali ? subjectNepali : subjectEnglish;
    subjectDialog.lang = nepali ? 'ne' : 'en';
    subjectTitle.textContent = language.title;
    subjectEyebrow.textContent = language.eyebrow;
    subjectIntro.textContent = language.intro;
    subjectItems.forEach((item, index) => { item.textContent = language.subjects[index]; });
    subjectTranslationButton.textContent = nepali ? 'अंग्रेजीमा हेर्नुहोस्' : 'See translation';
    subjectTranslationButton.setAttribute('aria-pressed', String(nepali));
  };
  subjectTranslationButton.addEventListener('click', () => {
    setSubjectLanguage(subjectTranslationButton.getAttribute('aria-pressed') !== 'true');
  });
  document.querySelector('.subject-catalog-trigger').addEventListener('click', () => {
    setSubjectLanguage(false);
    subjectDialog.showModal();
  });
  document.querySelector('.subject-dialog-close').addEventListener('click', () => subjectDialog.close());
  subjectDialog.addEventListener('click', event => {
    if (event.target === subjectDialog) subjectDialog.close();
  });

  const learningDetailDialog = document.querySelector('#learning-detail-dialog');
  const detailTitle = document.querySelector('#learning-detail-title');
  const detailSummary = document.querySelector('#learning-detail-summary');
  const detailCopy = document.querySelector('#learning-detail-copy');
  const learningEyebrow = document.querySelector('#learning-detail-eyebrow');
  const learningTranslationButton = document.querySelector('#learning-translation-toggle');
  const learningTranslations = {
    'Teaching & learning': {
      title: 'शिक्षण तथा सिकाइ',
      summary: 'मैत्रीपूर्ण शिक्षकहरूबाट व्यक्तिगत मार्गदर्शन',
      detail: 'हाम्रा शिक्षकहरूले स्पष्ट व्याख्या, मैत्रीपूर्ण मार्गदर्शन र व्यक्तिगत परामर्शमार्फत विद्यार्थीहरूलाई कठिन विषय बुझ्न मद्दत गर्छन्। विद्यार्थीहरूलाई प्रश्न सोध्न, आत्मविश्वास बढाउन र आफ्नै गतिमा सिकिरहन प्रोत्साहित गरिन्छ।'
    },
    'Classroom activities': {
      title: 'कक्षाकोठाका गतिविधिहरू',
      summary: 'सक्रिय सहभागिता र सँगै सिक्ने अवसर',
      detail: 'कक्षाकोठाका गतिविधिहरूले विद्यार्थीहरूलाई सहभागी हुन, नयाँ सीप अभ्यास गर्न, प्रश्न सोध्न र आफ्ना विचार बाँड्न अवसर दिन्छन्। सँगै सिक्दा विद्यार्थीहरू सक्रिय रहन्छन् र एकअर्काबाट सिक्छन्।'
    },
    'Student development': {
      title: 'विद्यार्थी विकास',
      summary: 'आत्मविश्वासका साथ अघि बढ्न प्रोत्साहन',
      detail: 'हामी विद्यार्थीहरूलाई पढाइसँगै आत्मविश्वास, जिम्मेवारी र सकारात्मक बानी विकास गर्न प्रोत्साहित गर्छौँ। शिक्षकहरूले प्रत्येक विद्यार्थीलाई प्रगति गर्न, नयाँ चुनौती लिन र आफ्नै गतिमा अघि बढ्न सहयोग गर्छन्।'
    },
    'Academic environment': {
      title: 'शैक्षिक वातावरण',
      summary: 'ध्यान दिन र अघि बढ्न स्वागतयोग्य ठाउँ',
      detail: 'विद्यार्थीहरूले सहज महसुस गर्दै सिक्न र प्रश्न सोध्न सक्ने स्वागतयोग्य तथा एकाग्र वातावरण प्रदान गर्ने हाम्रो लक्ष्य हो। सहयोगी शैक्षिक वातावरणले विद्यार्थीहरूलाई ध्यान दिन, सहभागी हुन र सँगै अघि बढ्न मद्दत गर्छ।'
    }
  };
  let activeLearningButton = null;
  const setLearningLanguage = nepali => {
    const englishTitle = activeLearningButton.dataset.title;
    const translation = learningTranslations[englishTitle];
    learningDetailDialog.lang = nepali ? 'ne' : 'en';
    detailTitle.textContent = nepali ? translation.title : englishTitle;
    detailSummary.textContent = nepali ? translation.summary : activeLearningButton.dataset.summary;
    detailCopy.textContent = nepali ? translation.detail : activeLearningButton.dataset.detail;
    learningEyebrow.textContent = nepali ? 'सिकाइको अनुभव' : 'The learning experience';
    learningTranslationButton.textContent = nepali ? 'अंग्रेजीमा हेर्नुहोस्' : 'See translation';
    learningTranslationButton.setAttribute('aria-pressed', String(nepali));
  };
  learningTranslationButton.addEventListener('click', () => {
    setLearningLanguage(learningTranslationButton.getAttribute('aria-pressed') !== 'true');
  });
  document.querySelectorAll('.learning-detail-trigger').forEach(button => {
    button.addEventListener('click', () => {
      activeLearningButton = button;
      setLearningLanguage(false);
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
