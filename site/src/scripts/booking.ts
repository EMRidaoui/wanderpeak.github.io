/**
 * Formulaire de réservation → message WhatsApp pré-rempli (aucun backend).
 * - Validation des champs obligatoires, messages d'erreur accessibles.
 * - Estimation : prix de l'expérience × personnes, + total du matériel par jour (affiché séparément,
 *   car la durée de location n'est pas définie dans les sources).
 * - Synchronisation avec les boutons de la section « Matériel ».
 * - Boutons « Réserver » des expériences : présélectionnent l'expérience.
 */
interface Runtime {
  lang: string;
  whatsapp: string;
  prices: Record<string, number>;
  gearPrices: Record<string, number>;
  gearNames: Record<string, string>;
  mad: string;
  t: Record<string, string>;
}

export function initBooking(): void {
  const form = document.querySelector<HTMLFormElement>('[data-booking]');
  const dataEl = document.getElementById('booking-data');
  if (!form || !dataEl) return;
  const R: Runtime = JSON.parse(dataEl.textContent || '{}');
  const $ = <T extends HTMLElement>(sel: string) => form.querySelector<T>(sel)!;

  const xp = $<HTMLSelectElement>('#f-xp');
  const people = $<HTMLInputElement>('#f-people');
  const estimate = $<HTMLElement>('[data-estimate]');
  const status = $<HTMLElement>('[data-status]');
  const options = $<HTMLFieldSetElement>('[data-options]');
  const gearBoxes = [...form.querySelectorAll<HTMLInputElement>('input[name="gear"]')];
  const gearButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-gear-toggle]')];
  const fmt = (n: number) => n.toLocaleString(R.lang === 'fr' ? 'fr-FR' : 'en-US').replace(/ | /g, ' ');

  // Date minimale = aujourd'hui
  const date = $<HTMLInputElement>('#f-date');
  date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function update(): void {
    const id = xp.value;
    options.hidden = id !== 'imsfrane';
    const n = Math.max(1, parseInt(people.value, 10) || 1);
    const parts: string[] = [];
    if (R.prices[id]) parts.push(`${R.t.estimate} : ${fmt(R.prices[id] * n)} ${R.mad}`);
    const gearDay = gearBoxes.filter((c) => c.checked).reduce((s, c) => s + (R.gearPrices[c.value] || 0), 0);
    if (gearDay) parts.push(R.t.gearPerDay.replace('{n}', fmt(gearDay)));
    estimate.textContent = parts.join(' · ');
  }

  function syncGear(): void {
    gearButtons.forEach((b) => {
      const box = gearBoxes.find((c) => c.value === b.dataset.gearToggle);
      b.setAttribute('aria-pressed', String(!!box?.checked));
    });
    update();
  }

  gearButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const box = gearBoxes.find((c) => c.value === b.dataset.gearToggle);
      if (box) { box.checked = !box.checked; syncGear(); }
    }),
  );
  gearBoxes.forEach((c) => c.addEventListener('change', syncGear));
  xp.addEventListener('change', update);
  people.addEventListener('input', update);

  document.querySelectorAll<HTMLAnchorElement>('[data-book]').forEach((a) =>
    a.addEventListener('click', () => {
      xp.value = a.dataset.book!;
      setError(xp, false);
      update();
      setTimeout(() => $<HTMLInputElement>('#f-name').focus({ preventScroll: true }), 600);
    }),
  );

  function setError(el: HTMLInputElement | HTMLSelectElement, bad: boolean): void {
    el.setAttribute('aria-invalid', String(bad));
    const err = document.getElementById(`${el.id}-err`);
    if (err) err.hidden = !bad;
  }
  const required = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]')];
  required.forEach((el) => el.addEventListener('input', () => el.value.trim() && setError(el, false)));
  required.forEach((el) => el.addEventListener('blur', () => el.getAttribute('aria-invalid') === 'true' && setError(el, !el.value.trim())));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first: HTMLElement | null = null;
    required.forEach((el) => {
      const bad = !el.value.trim();
      setError(el, bad);
      if (bad && !first) first = el;
    });
    if (first) { (first as HTMLElement).focus(); return; }

    const fd = new FormData(form);
    const val = (k: string) => String(fd.get(k) ?? '').trim();
    const selText = (s: HTMLSelectElement) => s.options[s.selectedIndex]?.textContent ?? '';
    const gear = gearBoxes.filter((c) => c.checked).map((c) => R.gearNames[c.value]);
    const lines = [
      R.t.hello,
      '',
      `${R.t.experience} : ${selText(xp)}`,
      ...(xp.value === 'imsfrane' ? [`${R.t.option} : ${val('option')}`] : []),
      `${R.t.date} : ${val('date') || '-'}`,
      `${R.t.people} : ${val('people') || '1'}`,
      `${R.t.city} : ${val('city')}`,
      `${R.t.guideLang} : ${val('guideLang')}`,
      `${R.t.gear} : ${gear.length ? gear.join(R.lang === 'ar' ? '، ' : ', ') : '-'}`,
      `${R.t.name} : ${val('name')}`,
      `${R.t.phone} : ${val('phone')}`,
    ];
    if (estimate.textContent) lines.push(estimate.textContent);
    const msg = val('message');
    if (msg) lines.push('', msg);

    // Sans numéro configuré, WhatsApp s'ouvre sans destinataire (l'utilisateur choisit le contact).
    const url = `https://wa.me/${R.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');

    status.textContent = `${R.t.opening} `;
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = R.t.fallback;
    status.appendChild(link);
    form.classList.add('is-sent');
  });

  update();
}
