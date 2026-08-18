import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUTHOR_IDS } from './settings/authors.settings';
import { SITE } from './settings/site.settings';
import { parseDateWithTimezone } from './utils/timezone';
import { isLocalAbsolutePath, toAbsoluteImageUrl } from './utils/cdn';

const authorSchema = z
  .union([z.enum(AUTHOR_IDS), z.array(z.enum(AUTHOR_IDS))])
  .transform(v => Array.isArray(v) ? v : [v])
  .default(['dev']);

function warnRelativeImagePath(value: string, field: string): void {
  if (!isLocalAbsolutePath(value) && !/^https?:\/\//i.test(value)) {
    console.warn(`[content.config] ${field} should be an absolute path (/...) or full URL: "${value}"`);
  }
}

const absoluteImageUrl = z.string().transform(path => {
  warnRelativeImagePath(path, 'image path');
  return toAbsoluteImageUrl(path)!;
});

const imageSchema = z.object({
  path: absoluteImageUrl,
  lqip: z.string().optional(),
  alt: z.string(),
}).optional();

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './posts' }),
  schema: z.object({
    title: z.string(),
    lang: z.string().optional(),
    description: z.string().optional(),
    date: z.string().transform(v => parseDateWithTimezone(String(v), SITE.timezone)),
    last_modified_at: z.string().optional()
      .transform(v => v ? parseDateWithTimezone(String(v), SITE.timezone) : undefined),
    authors: authorSchema,
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    start_with_ads: z.boolean().optional(),
    toc: z.boolean().optional(),
    math: z.boolean().optional(),
    mermaid: z.boolean().optional(),
    og_image: absoluteImageUrl.optional(),
    image: imageSchema,
    redirect_from: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
