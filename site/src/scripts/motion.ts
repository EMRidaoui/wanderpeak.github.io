/**
 * Animations — une seule règle : le mouvement sert l'orientation, jamais la décoration.
 * Tout est désactivé si l'utilisateur a demandé moins d'animations (prefers-reduced-motion),
 * et le contenu reste visible sans JavaScript (les états cachés n'existent que sous html.js).
 */
export function initMotion(): void {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    root.classList.add('no-motion');
    return;
  }
  root.classList.add('motion');

  // Révélations au scroll (une seule fois)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  document.querySelectorAll('[data-reveal], [data-route], .xp').forEach((el) => io.observe(el));

  // Compteurs d'altitude : 0 → valeur, une fois
  const fmt = (n: number) =>
    n.toLocaleString(root.lang === 'fr' ? 'fr-FR' : 'en-US').replace(/ | /g, ' ');
  const counters = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        counters.unobserve(el);
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const dur = 1400;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 },
  );
  document.querySelectorAll('[data-count]').forEach((el) => counters.observe(el));
}
