/**
 * Header : état « compact » au scroll, logo visible une fois le hero dépassé,
 * menu mobile accessible, lien de section actif, barre CTA mobile,
 * et conservation de la section courante quand on change de langue.
 */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.getElementById('top');
  if (!header) return;

  // 1. Header transparent sur le hero, opaque ensuite
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        const past = !entry.isIntersecting;
        header.classList.toggle('is-solid', past);
        document.documentElement.classList.toggle('past-hero', past);
      },
      { rootMargin: '-64px 0px 0px 0px' },
    );
    io.observe(hero);
  } else {
    header.classList.add('is-solid');
  }

  // 2. Menu mobile
  const burger = header.querySelector<HTMLButtonElement>('[data-burger]');
  const nav = header.querySelector<HTMLElement>('[data-nav]');
  const label = header.querySelector<HTMLElement>('[data-burger-label]');
  const setOpen = (open: boolean) => {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
    if (label) label.textContent = (open ? burger.dataset.labelClose : burger.dataset.labelOpen) ?? '';
  };
  burger?.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); burger?.focus(); }
  });

  // 3. Lien actif selon la section visible
  const links = [...header.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.dataset.spy!))
    .filter((s): s is HTMLElement => !!s);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.toggleAttribute('aria-current', a.dataset.spy === `#${en.target.id}`));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s));
  }

  // 4. Barre CTA mobile : visible après le hero, masquée quand le formulaire est à l'écran
  const mcta = document.querySelector<HTMLElement>('[data-mcta]');
  const book = document.getElementById('book');
  if (mcta && book && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => mcta.classList.toggle('is-hidden', en.isIntersecting), { threshold: 0.05 }).observe(book);
  }

  // 5. Changer de langue en restant sur la même section ; mémoriser le choix
  document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((a) => {
    a.addEventListener('click', () => {
      try { localStorage.setItem('wp-lang', a.dataset.langLink!); } catch { /* stockage indisponible */ }
      const current = links.find((l) => l.hasAttribute('aria-current'));
      if (current && window.scrollY > 200) a.href = a.href.split('#')[0] + current.dataset.spy;
    });
  });
}
