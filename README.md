# Portfolio Saga

Art portfolio of Namisoa Saga, built with [Astro](https://astro.build) and hosted on Vercel.
French by default, English under `/en/`. Follows the visitor's light or dark mode, with a toggle.

## Where things are

Everything you edit is in `content/`. The code is in `src/`.

```
content/
├── avatar.jpg                  picture at the top of every page
├── galleries/
│   ├── home/                   gallery of the home page
│   └── pixel-arts/             gallery of the "pixel arts" page
├── projects/
│   ├── knowledge-and-thunder/  shown on "game arts"
│   └── liwa/                   shown on "publications"
└── about/                      "à propos" page (text and portrait)
```

## Add an image to a gallery

Drop the file into `content/galleries/home/` or `content/galleries/pixel-arts/`
(JPG, PNG, GIF, WebP or AVIF). That's it.

- **Order**: images are sorted by file name, so start names with a number: `10-night-market.png`.
- **Caption** (shown in the image viewer): the name after the number, with dashes turned into
  spaces. `10-night-market.png` becomes "Night market". A file named only `10.png` has no caption.
- **Caption with accents or a translation**: add it to the `captions.json` of the folder.

  ```json
  {
    "10-night-market.png": { "fr": "Marché de nuit", "en": "Night market" }
  }
  ```

Upload the full-resolution file. GIFs and PNGs under 300 KB (pixel art) are served untouched,
so animations and pixels stay intact. Other images are resized and converted to WebP
automatically when the site is built.

## Add a project

Create a folder in `content/projects/`, for example `content/projects/my-comic/`, put the
images in it, and add a `fr.md` file:

```md
---
section: publications   # page it appears on: publications or game-arts
order: 2                # position on the page, smallest first
title: My Comic
subtitle: Webtoon       # optional
year: 2026              # optional
link:                   # optional
  label: Lire sur Webtoon
  url: https://www.webtoons.com/...
---

Description en français. **Gras** pour mettre en valeur.
```

Then add `en.md` with the English text. Anything you leave out (title, link address, …) is
taken from `fr.md`. Without `en.md`, the English page shows the French text.

```md
---
link:
  label: Read on Webtoon
---

English description.
```

With one image, the project shows a tall cover next to the text. With several, it shows a
gallery next to the text. Add `layout: cover` or `layout: gallery` to choose yourself, and
`draft: true` to hide a project without deleting it.

## Other changes

- **About page**: edit `content/about/fr.md` and `en.md`, replace `content/about/portrait.png`.
- **Name, email, social links, nav buttons**: `src/site.config.ts`. A new gallery page is one
  more entry in `pages` with `kind: 'gallery'`, plus a folder `content/galleries/<id>/`.
- **Interface text** (button labels, page description): `src/i18n.ts`.
- **Link preview image** (when the site is shared): `public/social-preview.jpg`, 1280×800.

## Run it on your computer

Needs Node.js 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321, updates as you edit
npm run build     # builds the site into dist/
npm run preview   # serves the built site
```

## Deploy on Vercel

1. On [vercel.com](https://vercel.com), choose **Add New → Project** and import this GitHub repository.
2. Vercel detects Astro. Keep the default settings and click **Deploy**.
3. From then on, every push to `main` updates the site.

Links and link previews use the site's Vercel address (or your own domain if you add one),
so there is nothing else to set up.

## Note on versions

Astro is pinned to 7.4.1 because later 7.4 releases need Node.js 22.23.4 or newer. Once your
Node.js is up to date, run `npm install astro@latest`.
