import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { t, type Lang, type Localized } from '../i18n';

type ImageModule = { default: ImageMetadata };

// Every image dropped into content/galleries/<name>/ or content/projects/<name>/.
const galleryImages = import.meta.glob<ImageModule>(
  '/content/galleries/*/*.{jpg,jpeg,png,gif,webp,avif,JPG,JPEG,PNG,GIF,WEBP,AVIF}',
  { eager: true },
);
const galleryCaptions = import.meta.glob<Record<string, Localized>>('/content/galleries/*/captions.json', {
  eager: true,
  import: 'default',
});
const projectImages = import.meta.glob<ImageModule>(
  '/content/projects/*/*.{jpg,jpeg,png,gif,webp,avif,JPG,JPEG,PNG,GIF,WEBP,AVIF}',
  { eager: true },
);

export interface Artwork {
  /** File name, e.g. "01-lost-cozy-city.png". */
  file: string;
  /** Path from the project root, e.g. "/content/galleries/pixel-arts/01-lost-cozy-city.png". */
  sourcePath: string;
  image: ImageMetadata;
  caption: Localized;
}

/** "03-lost-cozy-city.png" → "Lost cozy city". A file named only "03.png" has no caption. */
function captionFromFile(file: string): string {
  const name = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[\s._-]*/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

function collect(
  modules: Record<string, ImageModule>,
  folder: string,
  captions: Record<string, Localized> = {},
): Artwork[] {
  return Object.entries(modules)
    .filter(([key]) => key.startsWith(`${folder}/`))
    .map(([key, mod]) => {
      const file = key.slice(folder.length + 1);
      return { file, sourcePath: key, image: mod.default, caption: captions[file] ?? captionFromFile(file) };
    })
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
}

/** Images of content/galleries/<id>/, sorted by file name. */
export function galleryArtworks(id: string): Artwork[] {
  const folder = `/content/galleries/${id}`;
  return collect(galleryImages, folder, galleryCaptions[`${folder}/captions.json`]);
}

/** Images of content/projects/<id>/, sorted by file name. */
export function projectArtworks(id: string): Artwork[] {
  return collect(projectImages, `/content/projects/${id}`);
}

const KEEP_ORIGINAL_MAX_BYTES = 300 * 1024;

/**
 * GIFs (to keep the animation) and small PNGs (pixel art, which resizing would blur)
 * are served as they are. Everything else is resized and converted to WebP.
 */
function keepsOriginal(art: Artwork): boolean {
  const { format } = art.image;
  if (format === 'gif' || format === 'svg') return true;
  if (format !== 'png') return false;
  try {
    return fs.statSync(path.join(process.cwd(), art.sourcePath)).size <= KEEP_ORIGINAL_MAX_BYTES;
  } catch {
    return false;
  }
}

export interface RenderedArtwork {
  alt: string;
  caption: string;
  /** Width / height. */
  ratio: number;
  thumb: { src: string; srcset?: string; sizes?: string; width: number; height: number };
  full: { src: string; width: number; height: number };
}

/** Builds the thumbnail (with responsive sizes) and the large version shown in the image viewer. */
export async function renderArtwork(
  art: Artwork,
  lang: Lang,
  options: { sizes: string; fallbackAlt: string },
): Promise<RenderedArtwork> {
  const { image } = art;
  const caption = t(art.caption, lang);
  const alt = caption || options.fallbackAlt;
  const ratio = image.width / image.height;

  if (keepsOriginal(art)) {
    const original = { src: image.src, width: image.width, height: image.height };
    return { alt, caption, ratio, thumb: original, full: original };
  }

  const widths = [480, 960, 1440].filter((w) => w < image.width);
  if (image.width <= 1440) widths.push(image.width);
  const thumbWidth = widths[widths.length - 1];
  const thumb = await getImage({ src: image, width: thumbWidth, widths, sizes: options.sizes, format: 'webp' });

  const fullWidth = Math.min(image.width, 2048);
  const full = await getImage({ src: image, width: fullWidth, format: 'webp', quality: 85 });

  return {
    alt,
    caption,
    ratio,
    thumb: {
      src: thumb.src,
      srcset: thumb.srcSet.attribute,
      sizes: options.sizes,
      width: thumbWidth,
      height: Math.round(thumbWidth / ratio),
    },
    full: { src: full.src, width: fullWidth, height: Math.round(fullWidth / ratio) },
  };
}
