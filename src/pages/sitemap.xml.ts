import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPostLang, getPostPath, getAuthorPath } from '../utils/posts';
import { defaultLocale, availableLocales } from '../locales';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const allPosts = await getCollection('posts');
  const posts = allPosts.filter(post => !post.data.draft);

  const urls: SitemapUrl[] = [];

  // ── 1. Root ────────────────────────────────────────────
  urls.push({ loc: `${origin}/` });

  // ── 2. Language homepages (non-default locales) ────────
  for (const { code } of availableLocales) {
    if (code === defaultLocale) continue;
    urls.push({ loc: `${origin}/${code}/` });
  }

  // ── 3. Author index pages ──────────────────────────────
  const authorSet = new Set<string>();
  for (const post of posts) {
    const lang = getPostLang(post.id);
    for (const authorId of post.data.authors) {
      authorSet.add(`${lang}/${authorId}`);
    }
  }

  for (const key of authorSet) {
    const [lang, author] = key.split('/');
    urls.push({ loc: `${origin}${getAuthorPath(author, lang)}` });
  }

  // ── 4. Post pages ──────────────────────────────────────
  for (const post of posts) {
    const lang = getPostLang(post.id);
    const lastmod = (post.data.last_modified_at || post.data.date).toISOString().split('T')[0];
    const authorId = post.data.authors[0];
    urls.push({
      loc: `${origin}${getPostPath(post.id, authorId, lang)}`,
      lastmod,
    });
  }

  // ── XML ────────────────────────────────────────────────
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u =>
    u.lastmod
      ? `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`
      : `<url><loc>${u.loc}</loc></url>`
  ).join('\n  ')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
