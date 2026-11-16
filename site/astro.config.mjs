// @ts-check
import { defineConfig } from 'astro/config';

/**
 * URL publique et sous-chemin du site.
 * - En CI (GitHub Pages), SITE_URL et BASE_PATH sont fournis par le workflow
 *   (.github/workflows/deploy.yml) à partir de `actions/configure-pages`.
 * - En local, valeurs par défaut ci-dessous.
 * Avec un nom de domaine personnalisé : SITE_URL=https://mondomaine.ma et BASE_PATH=/
 */
const site = process.env.SITE_URL || 'https://emridaoui.github.io';
// BASE_PATH peut être vide (domaine personnalisé) : on ne retombe sur la valeur par défaut que s'il est absent.
const base = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH || '/' : '/wanderpeak.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  compressHTML: true,
});
