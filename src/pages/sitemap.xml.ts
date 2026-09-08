import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostLang, getPostSlug, getPostPath, getAuthorPath, localePath } from '../utils/posts';
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

// 주어진 x-default 기본 링크를 대체 링크 목록 끝에 덧붙인 새 목록을 반환한다.
function withDefaultAlternate(alternates: Alternate[], defaultHref: string): Alternate[] {
  return [...alternates, { hreflang: 'x-default', href: defaultHref }];
}

// 홈페이지·작가·포스트 URL과 alternate를 계산해 SitemapUrl 배열만 반환하는 순수 함수다 (XML 무지).
function buildSitemapEntries(input: { origin: string; posts: CollectionEntry<'posts'>[] }): SitemapUrl[] {
  const { origin, posts } = input;
  const urls: SitemapUrl[] = [];

  // ── Language homepages (default locale = root) ─────
  const homepages = availableLocales.map(({ code }) => ({
    code,
    href: code === defaultLocale ? `${origin}/` : `${origin}${localePath(code)}/`,
  }));

  const homepageAlternates = homepages.map(({ code, href }) => ({
    hreflang: bcp47(code),
    href,
  }));
  const homepageAlternatesWithDefault = withDefaultAlternate(homepageAlternates, `${origin}/`);

  for (const { href } of homepages) {
    urls.push({ loc: href, alternates: homepageAlternatesWithDefault });
  }

  // ── Author index pages ─────────────────────────────
  const authorSet = new Set<string>();
  for (const post of posts) {
    const lang = getPostLang(post);
    for (const authorId of post.data.authors) {
      authorSet.add(`${lang}/${authorId}`);
    }
  }

  for (const key of authorSet) {
    const [lang, author] = key.split('/');
    urls.push({ loc: `${origin}${getAuthorPath(author, lang)}` });
  }

  // ── Post pages (grouped by slug for hreflang) ──────
  // 콘텐츠 스키마상 slug 유일성이 전역 보장되지 않으므로 author를 키에 포함해 번역본끼리만 묶는다.
  const postGroups = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const slug = `${post.data.authors[0]}/${getPostSlug(post.id)}`;
    const group = postGroups.get(slug) ?? [];
    group.push(post);
    postGroups.set(slug, group);
  }

  for (const group of postGroups.values()) {
    const alternates: Alternate[] = group.length > 1
      ? group.map((post) => {
          const lang = getPostLang(post);
          const path = getPostPath(post.id, post.data.authors[0], lang);
          return { hreflang: bcp47(lang), href: `${origin}${path}` };
        })
      : [];

    if (alternates.length > 0) {
      const defaultPost = group.find((post) => getPostLang(post) === defaultLocale);
      if (defaultPost) {
        const defaultPath = getPostPath(defaultPost.id, defaultPost.data.authors[0], defaultLocale);
        alternates.push({ hreflang: 'x-default', href: `${origin}${defaultPath}` });
      }
    }

    for (const post of group) {
      const lang = getPostLang(post);
      const path = getPostPath(post.id, post.data.authors[0], lang);
      const lastmod = (post.data.last_modified_at || post.data.date).toISOString().split('T')[0];
      const image = post.data.og_image || post.data.image?.path;
      urls.push({
        loc: `${origin}${path}`,
        lastmod,
        ...(alternates.length > 0 && { alternates }),
        ...(image && { image }),
      });
    }
  }

  return urls;
}

// SitemapUrl[]를 받아 네임스페이스가 붙은 완성된 XML 문자열만 반환한다.
function renderSitemapXml(urls: SitemapUrl[]): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(renderUrl).join('\n')}
</urlset>`;
  return sitemap;
}

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const posts = (await getCollection('posts')).filter((p) => !p.data.draft);
  const entries = buildSitemapEntries({ origin, posts });
  return new Response(renderSitemapXml(entries), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
