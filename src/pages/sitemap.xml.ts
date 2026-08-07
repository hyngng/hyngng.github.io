import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostLang, getPostSlug, getPostPath, getAuthorPath } from '../utils/posts';
import { defaultLocale, availableLocales } from '../locales';
import { getLocaleEntry } from '../settings/site.settings';

interface Alternate {
  hreflang: string;
  href: string;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  alternates?: Alternate[];
  image?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bcp47(code: string): string {
  return getLocaleEntry(code).bcp47;
}

function renderUrl(u: SitemapUrl): string {
  const lines = ['<url>', `  <loc>${escapeXml(u.loc)}</loc>`];
  if (u.lastmod) lines.push(`  <lastmod>${u.lastmod}</lastmod>`);
  for (const alt of u.alternates ?? []) {
    lines.push(`  <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`);
  }
  if (u.image) {
    lines.push('  <image:image>', `    <image:loc>${escapeXml(u.image)}</image:loc>`, '  </image:image>');
  }
  lines.push('</url>');
  return lines.map((line) => `  ${line}`).join('\n');
}

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const allPosts = await getCollection('posts');
  const posts = allPosts.filter(post => !post.data.draft);

  const urls: SitemapUrl[] = [];

  // ── 1. Language homepages (default locale = root) ─────
  const homepages = availableLocales.map(({ code }) => ({
    code,
    href: code === defaultLocale ? `${origin}/` : `${origin}/${code}/`,
  }));

  const homepageAlternates: Alternate[] = homepages.map(({ code, href }) => ({
    hreflang: bcp47(code),
    href,
  }));
  homepageAlternates.push({ hreflang: 'x-default', href: `${origin}/` });

  for (const { href } of homepages) {
    urls.push({ loc: href, alternates: homepageAlternates });
  }

  // ── 2. Author index pages ─────────────────────────────
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

  // ── 3. Post pages (grouped by slug for hreflang) ──────
  const postGroups = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const slug = getPostSlug(post.id);
    const group = postGroups.get(slug) ?? [];
    group.push(post);
    postGroups.set(slug, group);
  }

  for (const group of postGroups.values()) {
    const alternates: Alternate[] = group.length > 1
      ? group.map((post) => {
          const lang = getPostLang(post.id);
          return {
            hreflang: bcp47(lang),
            href: `${origin}${getPostPath(post.id, post.data.authors[0], lang)}`,
          };
        })
      : [];

    if (alternates.length > 0) {
      const defaultPost = group.find((post) => getPostLang(post.id) === defaultLocale);
      if (defaultPost) {
        alternates.push({
          hreflang: 'x-default',
          href: `${origin}${getPostPath(defaultPost.id, defaultPost.data.authors[0], defaultLocale)}`,
        });
      }
    }

    for (const post of group) {
      const lang = getPostLang(post.id);
      const lastmod = (post.data.last_modified_at || post.data.date).toISOString().split('T')[0];
      const image = post.data.og_image || post.data.image?.path;
      urls.push({
        loc: `${origin}${getPostPath(post.id, post.data.authors[0], lang)}`,
        lastmod,
        ...(alternates.length > 0 && { alternates }),
        ...(image && { image }),
      });
    }
  }

  // ── XML ────────────────────────────────────────────────
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(renderUrl).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
