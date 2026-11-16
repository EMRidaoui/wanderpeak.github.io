/** Photos de la galerie « Moments », dans l'ordre d'affichage. `wide` = occupe deux colonnes. */
export const GALLERY: { photo: string; wide?: boolean; tall?: boolean; focus?: string }[] = [
  { photo: 'g-lake-panorama', wide: true },
  { photo: 'g-cedar-camp', tall: true },
  { photo: 'g-skewers-river' },
  { photo: 'g-sheepdog' },
  { photo: 'g-moonlit-river', tall: true },
  { photo: 'g-meadow-rest' },
  { photo: 'g-welcome-arch' },
  { photo: 'g-cairn-river' },
  { photo: 'g-mint-tea' },
  { photo: 'g-meadow-stream', wide: true, focus: '50% 88%' },
  { photo: 'g-mountain-refuge', wide: true, focus: '50% 70%' },
];

/**
 * Avis clients : vide volontairement. Les avis de l'ancienne page étaient des exemples fictifs.
 * Ajouter ici uniquement de vrais avis, avec l'accord de leurs auteurs.
 */
export const REVIEWS: { quote: Record<'fr' | 'en' | 'ar', string>; author: string; experience: string }[] = [];
