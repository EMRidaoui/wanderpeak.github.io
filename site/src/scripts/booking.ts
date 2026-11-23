/**
 * Formulaire de réservation → message WhatsApp pré-rempli (aucun backend).
 * - Validation des champs obligatoires, messages d'erreur accessibles.
 * - Estimation : prix de l'expérience × personnes, + total du matériel par jour (affiché séparément,
 *   car la durée de location n'est pas définie dans les sources).
 * - Matériel : bloc repliable dans le formulaire. Si rien n'est coché à l'envoi, une modale demande
 *   confirmation (« Vous avez tout le matériel ? ») et permet d'ajouter des articles avant d'envoyer.
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
  const gearCount = $<HTMLElement>('[data-gear-count]');
  const modal = document.querySelector<HTMLDialogElement>('[data-gear-modal]');
  const mirrorBoxes = [...(modal?.querySelectorAll<HTMLInputElement>('[data-gear-mirror]') ?? [])];
  const modalEstimate = modal?.querySelector<HTMLElement>('[data-modal-estimate]');
  const modalSendLabel = modal?.querySelector<HTMLElement>('[data-modal-send-label]');
  const fmt = (n: number) => n.toLocaleString(R.lang === 'fr' ? 'fr-FR' : 'en-US').replace(/ | /g, ' ');

  // Date minimale = aujourd'hui
  const date = $<HTMLInputElement>('#f-date');
  date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const checkedGear = () => gearBoxes.filter((c) => c.checked);

  function update(): void {
    const id = xp.value;
    options.hidden = id !== 'imsfrane';
    const n = Math.max(1, parseInt(people.value, 10) || 1);
    const parts: string[] = [];
    if (R.prices[id]) parts.push(`${R.t.estimate} : ${fmt(R.prices[id] * n)} ${R.mad}`);
    const picked = checkedGear();
    const gearDay = picked.reduce((s, c) => s + (R.gearPrices[c.value] || 0), 0);
    if (gearDay) parts.push(R.t.gearPerDay.replace('{n}', fmt(gearDay)));
    estimate.textContent = parts.join(' · ');
    gearCount.hidden = !picked.length;
    gearCount.textContent = String(picked.length);
    if (modalEstimate) modalEstimate.textContent = estimate.textContent;
    if (modalSendLabel) modalSendLabel.textContent = picked.length ? R.t.send : R.t.modalNone;
  }

  // Cases du formulaire ↔ cases de la modale : toujours le même état.
  function syncFrom(source: HTMLInputElement[], target: HTMLInputElement[]): void {
    target.forEach((t) => { t.checked = !!source.find((c) => c.value === t.value)?.checked; });
    update();
  }
  gearBoxes.forEach((c) => c.addEventListener('change', () => syncFrom(gearBoxes, mirrorBoxes)));
  mirrorBoxes.forEach((c) => c.addEventListener('change', () => syncFrom(mirrorBoxes, gearBoxes)));

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

  const send = (): void => {
    const fd = new FormData(form);
    const val = (k: string) => String(fd.get(k) ?? '').trim();
    const selText = (s: HTMLSelectElement) => s.options[s.selectedIndex]?.textContent ?? '';
    const gear = checkedGear().map((c) => R.gearNames[c.value]);
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
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first: HTMLElement | null = null;
    required.forEach((el) => {
      const bad = !el.value.trim();
      setError(el, bad);
      if (bad && !first) first = el;
    });
    if (first) { (first as HTMLElement).focus(); return; }

    // Aucun matériel coché : on vérifie avec le client avant d'ouvrir WhatsApp.
    if (!checkedGear().length && modal && typeof modal.showModal === 'function') {
      syncFrom(gearBoxes, mirrorBoxes);
      modal.showModal();
      return;
    }
    send();
  });

  if (modal) {
    modal.querySelector('[data-modal-send]')?.addEventListener('click', () => {
      modal.close();
      send(); // toujours dans le geste de l'utilisateur : window.open n'est pas bloqué
    });
    modal.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', () => modal.close()));
    // Clic sur le fond assombri = fermer
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  }


  update();
}
