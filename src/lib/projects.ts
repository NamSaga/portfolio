import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n';
import { projectArtworks, type Artwork } from './artworks';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  year?: string;
  link?: { url: string; label: string };
  layout: 'cover' | 'gallery';
  artworks: Artwork[];
  /** Entry whose Markdown body is shown (English if it exists, else French). */
  entry: CollectionEntry<'projects'>;
}

/** Projects shown on a page, in the requested language. */
export async function projectsFor(section: string, lang: Lang): Promise<Project[]> {
  const entries = await getCollection('projects');
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const folders = [...new Set(entries.map((entry) => entry.id.split('/')[0]))];

  const projects = folders.flatMap((folder) => {
    const base = byId.get(`${folder}/${defaultLang}`);
    if (!base || base.data.section !== section || base.data.draft) return [];

    const entry = byId.get(`${folder}/${lang}`) ?? base;
    const data = { ...base.data, ...entry.data };
    const artworks = projectArtworks(folder);
    const linkUrl = entry.data.link?.url ?? base.data.link?.url;
    const linkLabel = entry.data.link?.label ?? base.data.link?.label ?? linkUrl;

    return [
      {
        id: folder,
        order: base.data.order ?? Number.MAX_SAFE_INTEGER,
        title: data.title ?? folder,
        subtitle: data.subtitle,
        year: data.year,
        link: linkUrl && linkLabel ? { url: linkUrl, label: linkLabel } : undefined,
        layout: base.data.layout ?? (artworks.length > 1 ? 'gallery' : 'cover'),
        artworks,
        entry,
      },
    ];
  });

  return projects
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map(({ order: _order, ...project }) => project);
}
