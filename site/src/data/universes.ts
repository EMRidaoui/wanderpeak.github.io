/** Les trois univers de la marque. Le texte est dans i18n → universes.<id>. */
export type UniverseId = 'aventure' | 'challenge' | 'echappee';

export interface Universe {
  id: UniverseId;
  photo: string;
  /** Point focal de la photo (object-position) */
  focus?: string;
}

export const UNIVERSES: Universe[] = [
  { id: 'aventure', photo: 'univers-aventure-gorge-camp', focus: '50% 60%' },
  { id: 'challenge', photo: 'univers-challenge-snow-group', focus: '50% 40%' },
  { id: 'echappee', photo: 'univers-echappee-tent-lake', focus: '55% 60%' },
];
