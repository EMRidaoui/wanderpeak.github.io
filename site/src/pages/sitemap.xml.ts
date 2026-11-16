import type { APIRoute } from 'astro';
import { LANGS } from '../config/site';
import { localeUrl } from '../i18n';

/** Sitemap multilingue avec annotations hreflang. */
export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(localeUrl(l))}"/>`).join('');
  const urls = LANGS.map((l) => `<url><loc>${abs(localeUrl(l))}</loc>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(localeUrl('fr'))}"/></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
