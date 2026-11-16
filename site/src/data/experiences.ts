/**
 * Catalogue des expériences.
 * Pour ajouter une expérience :
 *   1. ajouter un objet ci-dessous ;
 *   2. ajouter ses textes dans src/i18n/{fr,en,ar}.json → experiences.items.<id> ;
 *   3. ajouter sa photo dans src/assets/photos/ (+ texte alternatif dans i18n → alt).
 */
import type { UniverseId } from './universes';

export type Level = 'easy' | 'moderate' | 'demanding';

export interface Experience {
  id: 'imsfrane' | 'toubkal' | 'mgoun';
  universes: UniverseId[];
  level: Level;
  /** Altitude du sommet en mètres, si pertinente */
  altitude?: number;
  /** Clé de durée dans i18n → units */
  duration: 'd2n1' | 'd3n2';
  /** Prix par personne, en MAD */
  price: number;
  photo: string;
  focus?: string;
  /** L'expérience propose plusieurs formules (textes dans i18n → experiences.items.<id>.options) */
  hasOptions?: boolean;
  /** Tracé décoratif (profil de montée) — SVG viewBox 0 0 320 112 */
  route: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'imsfrane',
    universes: ['aventure', 'echappee'],
    level: 'easy',
    duration: 'd2n1',
    price: 800,
    photo: 'exp-imsfrane-waterfall',
    focus: '50% 40%',
    hasOptions: true,
    route: 'M16 96 L48 90 L60 92 L96 78 L108 80 L140 66 L152 68 L184 54 L196 56 L222 64 L234 62 L262 78 L272 76 L298 92',
  },
  {
    id: 'toubkal',
    universes: ['challenge'],
    level: 'moderate',
    altitude: 4167,
    duration: 'd2n1',
    price: 1300,
    photo: 'exp-toubkal-snow-ridge',
    focus: '50% 45%',
    route: 'M16 98 L44 92 L56 94 L84 80 L96 82 L126 64 L138 66 L168 46 L180 48 L206 28 L218 30 L236 12 L250 30 L262 28 L280 54 L290 52 L300 88',
  },
  {
    id: 'mgoun',
    universes: ['challenge'],
    level: 'demanding',
    altitude: 4071,
    duration: 'd3n2',
    price: 1800,
    photo: 'exp-mgoun-snow-peaks',
    focus: '50% 55%',
    route: 'M16 100 L40 94 L52 96 L74 82 L86 84 L104 66 L116 68 L134 54 L146 56 L160 62 L176 42 L188 44 L212 26 L224 28 L238 18 L250 36 L262 34 L276 58 L286 56 L300 90',
  },
];

export const LEVEL_RANK: Record<Level, number> = { easy: 1, moderate: 2, demanding: 3 };
