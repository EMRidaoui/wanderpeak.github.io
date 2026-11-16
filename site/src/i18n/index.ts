/**
 * i18n — dictionnaires et helpers.
 * Les textes vivent dans fr.json / en.json / ar.json (mêmes clés partout).
 * `fr.json` sert de référence de type : une clé manquante dans une autre langue
 * est signalée par TypeScript.
 */
import fr from './fr.json';
import en from './en.json';
import ar from './ar.json';
import { LANGS, RTL_LANGS, DEFAULT_LANG, type Lang } from '../config/site';

export type Dict = typeof fr;
const DICTS: Record<Lang, Dict> = { fr, en: en as Dict, ar: ar as Dict };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS[DEFAULT_LANG];
}

export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);
export const dirOf = (lang: Lang) => (RTL_LANGS.includes(lang) ? 'rtl' : 'ltr');

/** Remplace {n}, {d}… dans une chaîne. */
export function fill(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** Formatage des nombres : chiffres occidentaux dans les trois langues (usage courant au Maroc). */
export function num(n: number, lang: Lang): string {
  return n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US').replace(/ | /g, ' ');
}

/** URL d'une page localisée, en tenant compte du sous-chemin GitHub Pages. */
export function localeUrl(lang: Lang, hash = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${lang}/${hash}`;
}
