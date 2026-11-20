export const languages = ['fr', 'en'] as const;
export type Lang = 'fr' | 'en';
export const defaultLang: Lang = 'fr';

/** A piece of text that is either the same in every language or translated. */
export type Localized = string | Partial<Record<Lang, string>>;

/** Picks the text for a language, falling back to French. */
export function t(value: Localized | undefined, lang: Lang): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value[defaultLang] ?? '';
}

/** Interface text that is not part of the artwork content. */
export const ui = {
  description: {
    fr: 'Portfolio de Namisoa Saga, character artist et game artist basé à Madagascar.',
    en: 'Portfolio of Namisoa Saga, a character and game artist based in Madagascar.',
  },
  artwork: { fr: 'Illustration', en: 'Artwork' },
  home: { fr: 'Accueil', en: 'Home' },
  mainNav: { fr: 'Navigation principale', en: 'Main navigation' },
  email: { fr: 'email', en: 'email' },
  viewer: { fr: "Visionneuse d'images", en: 'Image viewer' },
  previous: { fr: 'Image précédente', en: 'Previous image' },
  next: { fr: 'Image suivante', en: 'Next image' },
  close: { fr: 'Fermer', en: 'Close' },
  darkMode: { fr: 'Mode sombre', en: 'Dark mode' },
  otherLanguage: { fr: 'English version', en: 'Version française' },
  notFound: { fr: 'Page introuvable.', en: 'Page not found.' },
  backHome: { fr: "Retour à l'accueil", en: 'Back to home' },
} satisfies Record<string, Record<Lang, string>>;
