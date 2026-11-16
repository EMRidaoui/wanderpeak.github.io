/**
 * Registre des photos. Chaque clé correspond à un fichier de src/assets/photos/
 * et à un texte alternatif dans src/i18n/*.json → alt.<clé>.
 * Les sources ont été redimensionnées (2400 px max) et nettoyées de leurs métadonnées EXIF/GPS ;
 * Astro génère ensuite les variantes AVIF/WebP responsive au build.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.jpg$/, ''), mod.default]),
);

export function photo(key: string): ImageMetadata {
  const p = photos[key];
  if (!p) throw new Error(`Photo inconnue : ${key}`);
  return p;
}
