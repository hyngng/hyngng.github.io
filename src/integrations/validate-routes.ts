import type { AstroIntegration } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { getFrontmatterLang } from '../utils/frontmatter-lang';
import { ALL_AUTHORS } from '../settings/authors.settings';

const POSTS_DIR = path.resolve('posts');
const RESERVED_SLUGS = ['rss.xml', 'sitemap.xml', 'index', 'rss', 'sitemap', 'favicon.ico', 'robots.txt'];
const RESERVED_AUTHOR_IDS = ['api', 'rss', 'sitemap', 'assets', 'admin', 'content', 'posts', 'authors'];

// Collects (lang, slug) pairs from every post. Slug is the date-stripped
// filename; lang is the frontmatter `lang`. Because the folder no longer
// carries language, (lang, slug) must be unique to avoid route collisions.
function getLangSlugPairs(dir = POSTS_DIR): Array<{ lang: string; slug: string; file: string }> {
  const pairs: Array<{ lang: string; slug: string; file: string }> = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pairs.push(...getLangSlugPairs(entryPath));
      continue;
    }
    const match = entry.name.match(/^\d{4}-\d{2}-\d{2}-(.+)\.(md|mdx)$/);
    if (!match) continue;
    const slug = match[1];
    const raw = fs.readFileSync(entryPath, 'utf8');
    const lang = getFrontmatterLang(raw);
    if (!lang) {
      throw new Error(
        `[Missing lang] Post "${path.relative(POSTS_DIR, entryPath)}" has no frontmatter \`lang\`. ` +
        `Language is required and must be a 2-letter code.`
      );
    }
    pairs.push({ lang, slug, file: path.relative(POSTS_DIR, entryPath) });
  }
  return pairs;
}

export function validateRoutes(): AstroIntegration {
  return {
    name: 'validate-routes',
    hooks: {
      'astro:build:start': async () => {
        const pairs = getLangSlugPairs();
        const seen = new Map<string, string>();
        for (const { lang, slug, file } of pairs) {
          if (RESERVED_SLUGS.includes(slug)) {
            throw new Error(
              `[Reserved Slug Conflict] Post "${file}" uses reserved slug "${slug}". ` +
              `Reserved slugs: ${RESERVED_SLUGS.join(', ')}`
            );
          }
          const key = `${lang}/${slug}`;
          if (seen.has(key)) {
            throw new Error(
              `[Duplicate Post] lang "${lang}" + slug "${slug}" is used by more than one post ` +
              `("${seen.get(key)}" and "${file}"). ` +
              `Routes are keyed by (lang, slug) since the folder no longer carries language.`
            );
          }
          seen.set(key, file);
        }
        for (const author of ALL_AUTHORS) {
          if (RESERVED_AUTHOR_IDS.includes(author.id)) {
            throw new Error(`[Reserved Author ID] "${author.id}" is a reserved route segment.`);
          }
        }
        console.log('[validate-routes] OK — no conflicts');
      },
    },
  };
}
