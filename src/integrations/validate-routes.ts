import type { AstroIntegration } from 'astro';
import fs from 'node:fs';
import { getFrontmatterLang } from '../utils/frontmatter-lang';
import { normalizeLang } from '../utils/lang';
import { localePath } from '../utils/locale-segments';
import { listPostFiles } from '../utils/postFiles';
import { ALL_AUTHORS } from '../settings/authors.settings';

const RESERVED_SLUGS = ['rss.xml', 'sitemap.xml', 'index', 'rss', 'sitemap', 'favicon.ico', 'robots.txt'];
const RESERVED_AUTHOR_IDS = ['api', 'rss', 'sitemap', 'assets', 'admin', 'content', 'posts', 'authors'];

// Collects (lang, slug) pairs from every post. Slug is the date-stripped
// filename; lang is the frontmatter `lang`. Because the folder no longer
// carries language, (lang, slug) must be unique to avoid route collisions.
function getLangSlugPairs(): Array<{ lang: string; slug: string; file: string }> {
  const pairs: Array<{ lang: string; slug: string; file: string }> = [];
  for (const { fullPath, relativePath, slug } of listPostFiles()) {
    const raw = fs.readFileSync(fullPath, 'utf8');
    let lang: string | null;
    try {
      lang = normalizeLang(getFrontmatterLang(raw) ?? '');
    } catch (err) {
      throw new Error(
        `[Frontmatter Parse Error] Post "${relativePath}" has invalid frontmatter YAML.`,
        { cause: err }
      );
    }
    if (!lang) {
      throw new Error(
        `[Missing lang] Post "${relativePath}" has no frontmatter \`lang\`. ` +
        `Language is required and must be a BCP 47 language tag (e.g. ko-KR, zh-CN).`
      );
    }
    pairs.push({ lang, slug, file: relativePath });
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
          // Key on the actual output path (segment + slug), not the canonical
          // lang, so the check matches real route collisions.
          const key = `${localePath(lang)}/${slug}`;
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
