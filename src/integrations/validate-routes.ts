import type { AstroIntegration } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_AUTHORS } from '../settings/authors.settings';

const POSTS_DIR = path.resolve('posts');
const RESERVED_SLUGS = ['rss.xml', 'sitemap.xml', 'index', 'rss', 'sitemap', 'favicon.ico', 'robots.txt'];
const RESERVED_AUTHOR_IDS = ['api', 'rss', 'sitemap', 'assets', 'admin', 'content', 'posts', 'authors'];

function getPostSlugs(dir = POSTS_DIR): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getPostSlugs(entryPath);
    const match = entry.name.match(/^\d{4}-\d{2}-\d{2}-(.+)\.(md|mdx)$/);
    return match ? [match[1]] : [];
  });
}

export function validateRoutes(): AstroIntegration {
  return {
    name: 'validate-routes',
    hooks: {
      'astro:build:start': async () => {
        const slugs = getPostSlugs();
        for (const slug of slugs) {
          if (RESERVED_SLUGS.includes(slug)) {
            throw new Error(
              `[Reserved Slug Conflict] Post uses reserved slug "${slug}". ` +
              `Reserved slugs: ${RESERVED_SLUGS.join(', ')}`
            );
          }
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
