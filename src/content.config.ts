import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One folder per project in content/projects/, holding its images,
 * fr.md (required) and en.md (optional English text).
 * Fields left out of en.md are taken from fr.md.
 */
const projects = defineCollection({
  loader: glob({
    pattern: '*/*.md',
    base: './content/projects',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    /** Page the project appears on: "game-arts" or "publications". */
    section: z.string().optional(),
    /** Position on the page, smallest first. */
    order: z.number().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    year: z.string().optional(),
    link: z
      .object({
        url: z.url().optional(),
        label: z.string().optional(),
      })
      .optional(),
    /** "cover": one tall image beside the text. "gallery": all images beside the text. Default depends on the image count. */
    layout: z.enum(['cover', 'gallery']).optional(),
    /** Set to true to hide the project without deleting it. */
    draft: z.boolean().optional(),
  }),
});

/** content/about/fr.md and en.md. */
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/about' }),
  schema: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { projects, about };
