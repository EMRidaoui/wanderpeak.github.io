/**
 * Configuration centrale de la marque.
 * C'est le SEUL fichier à modifier pour changer le numéro WhatsApp, les villes de départ, etc.
 */
export const SITE = {
  name: 'Wander Peak',

  /**
   * Numéro WhatsApp de l'agence, au format international SANS « + » ni espaces (ex. "2126XXXXXXXX").
   * ⚠️ À RENSEIGNER. Tant qu'il est vide, le formulaire ouvre WhatsApp avec le message pré-rempli
   * mais sans destinataire (l'utilisateur choisit le contact) — aucun message n'est envoyé à un inconnu.
   */
  whatsapp: '212688577939' as string,

  /** Villes de départ (clés de traduction dans src/i18n/*.json → cities.*) */
  departures: ['casablanca', 'rabat'] as const,

  /** Liens réseaux sociaux : laisser vide tant qu'ils ne sont pas confirmés. */
  social: {
    instagram: '',
  },
} as const;

export const LANGS = ['fr', 'en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';
export const RTL_LANGS: readonly Lang[] = ['ar'];
export const LANG_LABELS: Record<Lang, string> = { fr: 'FR', en: 'EN', ar: 'عربي' };
export const LANG_NAMES: Record<Lang, string> = { fr: 'Français', en: 'English', ar: 'الدارجة' };
export const LOCALES: Record<Lang, string> = { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' };
