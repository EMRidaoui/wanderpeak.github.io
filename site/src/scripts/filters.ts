/**
 * Filtre du catalogue par univers (Aventure / Challenge / Échappée).
 * Les cartes univers (data-filter-link) appliquent le filtre puis font défiler jusqu'au catalogue.
 * Transition douce (fondu + léger déplacement) si le mouvement est autorisé.
 */
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initFilters(): void {
  const group = document.querySelector<HTMLElement>('[data-filters]');
  const items = [...document.querySelectorAll<HTMLElement>('[data-xp]')];
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  if (!group || !items.length) return;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-filter]')];

  function apply(filter: string, animate = true): void {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const show = (el: HTMLElement) => filter === 'all' || (el.dataset.universes ?? '').split(' ').includes(filter);

    // FLIP léger : mémorise les positions avant changement
    const first = new Map(items.map((el) => [el, el.getBoundingClientRect()]));
    items.forEach((el) => { el.hidden = !show(el); });
    if (animate && !reduce()) {
      items.filter((el) => !el.hidden).forEach((el) => {
        const a = first.get(el)!;
        const b = el.getBoundingClientRect();
        const wasHidden = a.width === 0;
        el.animate(
          wasHidden
            ? [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }]
            : [{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }],
          { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' },
        );
      });
    }
    const label = buttons.find((b) => b.dataset.filter === filter)?.textContent?.trim() ?? '';
    if (status) status.textContent = `${label} : ${items.filter((el) => !el.hidden).length}`;
  }

  group.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (b) apply(b.dataset.filter!);
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-filter-link]').forEach((a) => {
    a.addEventListener('click', () => apply(a.dataset.filterLink!, false));
  });
}
