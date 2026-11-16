# Wander Peak — landing page (Astro)

Nouvelle landing page de Wander Peak : statique, responsive, en trois langues (français, anglais, darija marocaine en RTL), sans backend.
L'ancien site (`index.html` à la racine du dépôt) n'est **pas modifié** : cette version vit entièrement dans `site/`.

## Démarrer

```bash
cd site
npm install
npm run dev        # http://localhost:4321/wanderpeak.github.io/
npm run build      # génère site/dist/
npm run preview
```

Node 22 recommandé.

## Pages générées

| URL | Contenu |
|---|---|
| `/` | Redirige vers la langue mémorisée, sinon celle du navigateur, sinon `/fr/` |
| `/fr/` `/en/` `/ar/` | La landing page, pré-rendue dans chaque langue (indexable, avec `hreflang`) |
| `/404.html` | Page d'erreur trilingue |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Où modifier quoi

| Je veux… | Fichier |
|---|---|
| **Renseigner le numéro WhatsApp** | `src/config/site.ts` → `whatsapp` |
| Modifier un texte | `src/i18n/fr.json`, `en.json`, `ar.json` (mêmes clés partout) |
| Ajouter / modifier une expérience (prix, durée, niveau, univers) | `src/data/experiences.ts` + textes dans `i18n/*.json → experiences.items` |
| Modifier le matériel et ses prix | `src/data/gear.ts` |
| Changer les photos de la galerie | `src/data/gallery.ts` (+ fichier dans `src/assets/photos/` et texte alternatif dans `i18n → alt`) |
| Ajouter de **vrais** avis clients | `src/data/gallery.ts → REVIEWS` (la section s'affiche automatiquement dès qu'il y en a un) |
| Couleurs, typo, espacements | `src/styles/tokens.css` |
| Ordre des sections | `src/pages/[lang]/index.astro` |

## Structure

```
site/
  astro.config.mjs        URL du site et sous-chemin (variables SITE_URL / BASE_PATH)
  public/                 favicons (logo d'origine centré sur fond noir)
  src/
    assets/brand/logo.png logo officiel, fichier d'origine sans retouche
    assets/photos/        photos redimensionnées (2400 px max), métadonnées EXIF/GPS retirées
    config/site.ts        WhatsApp, langues, villes
    data/                 expériences, univers, matériel, galerie, avis
    i18n/                 dictionnaires FR / EN / AR + helpers
    layouts/Base.astro    <html lang/dir>, SEO, Open Graph, JSON-LD, polices
    components/           une section = un composant
    scripts/              header, filtres, réservation WhatsApp, animations
    styles/               tokens.css (design tokens) + global.css
    pages/                [lang]/index.astro, index (redirection), 404, sitemap, robots
```

## Principes

- **Identité préservée.** Logo d'origine (affiché sur fond noir, ou en `mix-blend-mode: screen` sur la photo du hero), orange `#ee7631`, Archivo / Archivo Black, motif « tracé de route » repris du logo.
- **Contraste.** Texte noir sur orange, orange sur noir. Jamais de petit texte blanc sur orange.
- **RTL.** Uniquement des propriétés CSS logiques (`margin-inline`, `inset-inline`…). Flèches et tracés inversés en arabe, logo jamais inversé. Les slogans anglais sont isolés en LTR (`.ltr`).
- **Mouvement.** Il sert l'orientation : révélations au scroll, tracés qui se dessinent, compteurs d'altitude, filtres animés. Tout est coupé avec `prefers-reduced-motion`, et le contenu reste visible sans JavaScript.
- **Performance.** Images AVIF/WebP responsives générées au build, polices auto-hébergées (Cairo n'est téléchargée que si la page affiche de l'arabe), environ 7 Ko de JS intégré à la page et aucune bibliothèque d'animation.
- **Aucun contenu inventé.** Les textes viennent de l'ancien site, des visuels de marque et des indications du client.

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy-site.yml` compile `site/` et le publie à chaque push sur `main` qui touche `site/`.
**Pour l'activer :** Settings → Pages → Source → « GitHub Actions ». Tant que ce réglage n'est pas fait, l'ancien `index.html` reste en ligne.
Avec un nom de domaine personnalisé, le sous-chemin est géré automatiquement par le workflow.

Note : un `robots.txt` placé sous un sous-chemin (`/wanderpeak.github.io/robots.txt`) n'est pas lu par les moteurs. Il ne le devient qu'avec un domaine personnalisé.

## À fournir ou valider avant la mise en ligne

1. ~~Numéro WhatsApp~~ : renseigné (+212 688 577 939), modifiable dans `src/config/site.ts`.
2. **Photos des expériences.** Les photos d'Imsfrane (cascade et gorges), du Toubkal et du M'Goun ont été choisies d'après leur contenu visible : vérifier qu'elles correspondent bien à chaque lieu.
3. **Textes en darija** : relecture par une personne native.
4. Prix et durées : **indicatifs** (affichés comme tels sur le site), à ajuster dans `src/data/experiences.ts`.
5. Ce qui est inclus (transport, repas, guide), conditions d'annulation, taille des groupes, encadrement.
6. Contenu propre à l'univers **Échappée** (aujourd'hui seule Imsfrane y figure).
7. Vrais avis clients, réseaux sociaux, mentions légales, fichier source du logo en SVG ou PNG transparent.
