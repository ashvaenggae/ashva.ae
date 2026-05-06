/* Ashva site — interactions */
(() => {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  /* Scrolled state */
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  mobileLinks.forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    })
  );

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll(
    '.section .eyebrow, .h2, .lede, .value, .step, .service, .sector, .sector-card, .project, .contact__form, .cta-strip__inner, .milestone, .about__media, .authorities__list li, .hero__meta, .hero__cta, .hero__lead'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* Footer year */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Contact form — client-side only demo handler */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('cf-note');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      if (!name || !email || !msg) {
        note.textContent = 'Please fill out name, email and a brief message.';
        note.style.color = '#8a5a32';
        return;
      }
      // Fallback: compose a mailto so submissions reach the studio even without a backend.
      const subject = encodeURIComponent(`New enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${form.phone.value}\nType: ${form.type.value}\n\n${msg}`
      );
      window.location.href = `mailto:info@ashva.ae?subject=${subject}&body=${body}`;
      note.textContent = 'Opening your email client to send this enquiry…';
      note.style.color = '#3a4048';
      form.reset();
    });
  }
})();
