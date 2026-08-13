import { type CollectionEntry, getCollection } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { math } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import { visit } from 'unist-util-visit';
import type { RootContent } from 'mdast';
import { defaultLocale } from '../locales';
import type { AuthorId } from '../settings/authors.settings';


const DEFAULT_LOCALE = defaultLocale;

// id format: "ko/blog/2022-08-13-first-post.mdx"
export function getPostLang(id: string): string {
  const normalized = id.replace(/\\/g, '/');
  return normalized.split('/')[0] || DEFAULT_LOCALE;
}

export function getPostSlug(id: string): string {
  const normalized = id.replace(/\\/g, '/');
  const filename = normalized.split('/').pop() || id;
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(md|mdx)$/, '');
}

export function getPostPath(id: string, authorId: string | string[], currentLocale?: string): string {
  const primary = Array.isArray(authorId) ? authorId[0] : authorId;
  const locale = currentLocale || DEFAULT_LOCALE;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}/${primary}/${getPostSlug(id)}/`;
}

export function getAuthorPath(authorId: string, currentLocale?: string): string {
  const locale = currentLocale || DEFAULT_LOCALE;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}/${authorId}/`;
}

export function getPostNumber(posts: CollectionEntry<'posts'>[], postId: string): number {
  const sortedPosts = [...posts].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  const postIndex = sortedPosts.findIndex((p) => p.id === postId);
  return postIndex + 1;
}

// Node types counted as text (whitelist). inlineCode/math contribute their content only.
const COUNTED_NODE_TYPES = new Set(['text', 'inlineCode', 'inlineMath', 'math']);

export function countCharacters(body: string = ''): number {
  const preprocessed = body
    // MDX comments (same pattern as extractExcerpt)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    // Kramdown attribute spans like {: .w-50 .right } — ':' distinguishes from directive attrs
    .replace(/\{\:\s*[^}]*\}/g, '');

  const tree = fromMarkdown(preprocessed, {
    extensions: [directive(), gfmTable(), math({ singleDollarTextMath: true })],
    mdastExtensions: [directiveFromMarkdown(), gfmTableFromMarkdown(), mathFromMarkdown()],
  });

  let buffer = '';
  visit(tree, (node) => {
    if (COUNTED_NODE_TYPES.has(node.type) && 'value' in node && typeof node.value === 'string') {
      buffer += node.value + ' ';
    }
  });

  const normalized = buffer.replace(/\s+/g, ' ').trim();
  return Array.from(normalized).length;
}

const EXCERPT_MAX_LENGTH = 100;
export const META_DESCRIPTION_MAX_LENGTH = 155;

export function extractExcerpt(description: string | undefined, body: string | undefined, maxLength: number = EXCERPT_MAX_LENGTH): string {
  if (description) return description;
  if (!body) return '';

  const tree = fromMarkdown(body, {
    extensions: [gfmTable(), directive()],
    mdastExtensions: [gfmTableFromMarkdown(), directiveFromMarkdown()],
  });

  const parts: string[] = [];
  for (const node of tree.children) {
    if (node.type !== 'paragraph') continue;
    if ('children' in node && (node.children as RootContent[]).some((c) => c.type === 'image')) continue;
    parts.push(toString(node));
    if (parts.join(' ').length >= maxLength) break;
  }

  return parts.join(' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

interface QueryPostsOptions {
  lang?: string;
  authorId?: string;
  includeDraft?: boolean;
  sort?: 'asc' | 'desc' | 'none';
}

export async function queryPosts(options: QueryPostsOptions = {}): Promise<CollectionEntry<'posts'>[]> {
  const { lang, authorId, includeDraft = false, sort = 'desc' } = options;
  const allPosts = await getCollection('posts');

  let posts = includeDraft ? allPosts : allPosts.filter(({ data }) => !data.draft);

  if (lang) {
    posts = posts.filter((post) => getPostLang(post.id) === lang);
  }

  if (authorId) {
    posts = posts.filter(({ data }) => data.authors.includes(authorId as AuthorId));
  }

  if (sort === 'desc') {
    return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  } else if (sort === 'asc') {
    return posts.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  }

  return posts;
}

export async function getPublishedPosts(options: { lang?: string; authorId?: string } = {}): Promise<CollectionEntry<'posts'>[]> {
  return queryPosts({ ...options, sort: 'desc' });
}

export async function getRssItems(options: { lang?: string; authorId?: AuthorId } = {}) {
  const { lang, authorId } = options;
  const posts = await queryPosts({ lang, authorId, sort: 'desc' });

  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: extractExcerpt(post.data.description, post.body) || undefined,
    link: getPostPath(post.id, post.data.authors[0], lang),
  }));
}
