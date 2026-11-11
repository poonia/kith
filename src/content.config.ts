import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Keep these schemas in sync with .gitcms/sites/kith/collections/*.jsonc —
 * GitCMS drives the editor, these drive the build (and fail it on bad data).
 */

/** GitCMS writes `/images/...`; files live in src/assets/images. */
const imagePath = z
  .string()
  .regex(/^\/images\//, 'Image paths must start with /images/ (GitCMS media library)');

const tags = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((t) => [...new Set(t)]);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: z
    .object({
      title: z.string().min(1).max(120),
      description: z.string().min(1).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags,
      heroImage: imagePath.optional(),
      heroAlt: z.string().optional(),
      draft: z.boolean().default(false),
      canonical: z.url().optional(),
      comments: z.boolean().default(true),
    })
    .refine((d) => !d.heroImage || (d.heroAlt && d.heroAlt.trim().length > 0), {
      message: 'heroAlt is required when heroImage is set',
      path: ['heroAlt'],
    }),
});

const snippets = defineCollection({
  loader: glob({ base: './src/content/snippets', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(160),
    pubDate: z.coerce.date(),
    tags,
    language: z.string().optional(),
    source: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, snippets };
