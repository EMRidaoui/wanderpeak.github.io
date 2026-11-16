/** Matériel à louer — prix en MAD par jour. Libellés dans i18n → gear.items.<id>. */
export const GEAR = [
  { id: 'tent', price: 100 },
  { id: 'bag', price: 50 },
  { id: 'mat', price: 30 },
  { id: 'pack', price: 40 },
  { id: 'poles', price: 30 },
  { id: 'lamp', price: 20 },
] as const;
export type GearId = (typeof GEAR)[number]['id'];
