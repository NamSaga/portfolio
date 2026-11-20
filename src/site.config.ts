import { defaultLang, type Lang } from './i18n';

/** General information shown across the site. */
export const site = {
  name: 'Namisoa Saga',
  title: 'Portfolio Saga',
  email: 'sagarandria@gmail.com',
  socials: [
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/kiss7omorrowgoodbye/' },
    { name: 'X', icon: 'x', url: 'https://x.com/zvezdaa37/' },
  ],
  /** Year in the signature at the bottom of each page ("Namisoa Saga, 2026."). */
  year: new Date().getFullYear(),
} as const;

export type PageKind = 'gallery' | 'projects' | 'about';

export interface PageDef {
  /**
   * gallery: shows the images in content/galleries/<id>/
   * projects: shows the projects in content/projects/ whose `section` is <id>
   * about: shows content/about/
   */
  id: string;
  kind: PageKind;
  /** Address of the page for each language ('' is the home page). */
  slug: Record<Lang, string>;
  /** Text of the nav button. Pages without a label are not in the nav. */
  label?: Record<Lang, string>;
}

/** The pages of the site, in nav order. */
export const pages: PageDef[] = [
  { id: 'home', kind: 'gallery', slug: { fr: '', en: '' } },
  {
    id: 'pixel-arts',
    kind: 'gallery',
    slug: { fr: 'pixel-arts', en: 'pixel-arts' },
    label: { fr: 'pixel arts', en: 'pixel arts' },
  },
  {
    id: 'game-arts',
    kind: 'projects',
    slug: { fr: 'game-arts', en: 'game-arts' },
    label: { fr: 'game arts', en: 'game arts' },
  },
  {
    id: 'publications',
    kind: 'projects',
    slug: { fr: 'publications', en: 'publications' },
    label: { fr: 'publications', en: 'publications' },
  },
  {
    id: 'about',
    kind: 'about',
    slug: { fr: 'a-propos', en: 'about' },
    label: { fr: 'à propos', en: 'about' },
  },
];

export const homePage = pages[0];

/** URL of a page in a language, e.g. "/pixel-arts/" or "/en/about/". */
export function pageUrl(page: PageDef, lang: Lang): string {
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  const slug = page.slug[lang];
  return `${prefix}/${slug ? `${slug}/` : ''}`;
}
