import { type CollectionEntry, getCollection } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RootContent } from 'mdast';
import { defaultLocale } from '../locales';
import type { PersonaId } from '../settings/personas.settings';
import { getMarkdownSyntax } from './markdown-syntax';


const DEFAULT_LOCALE = defaultLocale;

export function getPostLang(post: CollectionEntry<'posts'>): string {
  return post.data.lang || DEFAULT_LOCALE;
}

export function getPostSlug(id: string): string {
  const normalized = id.replace(/\\/g, '/');
  const filename = normalized.split('/').pop() || id;
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(md|mdx)$/, '');
}

// URL segment mapping is owned by ./locale-segments (single source of truth
// for locale code -> URL prefix). Re-exported here so existing imports from
// posts.ts keep working.
import { localePath } from './locale-segments';
export { localePath };

export function getPostPath(id: string, personaId: string | string[], currentLocale?: string): string {
  const primary = Array.isArray(personaId) ? personaId[0] : personaId;
  return `${localePath(currentLocale)}/${primary}/${getPostSlug(id)}/`;
}

export function getPersonaPath(personaId: string, currentLocale?: string): string {
  return `${localePath(currentLocale)}/${personaId}/`;
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

  const tree = fromMarkdown(preprocessed, getMarkdownSyntax({ includeMath: true }));

  let buffer = '';
  visit(tree, (node) => {
    if (COUNTED_NODE_TYPES.has(node.type) && 'value' in node && typeof node.value === 'string') {
      buffer += node.value + ' ';
    }
  });

  const normalized = buffer.replace(/\s+/g, ' ').trim();
  return Array.from(normalized).length;
}

const EXCERPT_MAX_LENGTH = 150;
export const META_DESCRIPTION_MAX_LENGTH = 155;

export function extractExcerpt(description: string | undefined, body: string | undefined, maxLength: number = EXCERPT_MAX_LENGTH, truncationSuffix: string = ''): string {
  if (description) return description;
  if (!body) return '';

  const tree = fromMarkdown(body, getMarkdownSyntax());

  const parts: string[] = [];
  for (const node of tree.children) {
    if (node.type !== 'paragraph') continue;
    if ('children' in node && (node.children as RootContent[]).some((c) => c.type === 'image')) continue;
    parts.push(toString(node));
    if (parts.join(' ').length >= maxLength) break;
  }

  const joined = parts.join(' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\s+/g, ' ').trim();

  if (joined.length <= maxLength) return joined;

  const truncated = joined.slice(0, Math.max(0, maxLength - truncationSuffix.length));
  return truncationSuffix ? `${truncated.trimEnd()}${truncationSuffix}` : truncated;
}

interface QueryPostsOptions {
  lang?: string;
  personaId?: string;
  includeDraft?: boolean;
  sort?: 'asc' | 'desc' | 'none';
}

export async function queryPosts(options: QueryPostsOptions = {}): Promise<CollectionEntry<'posts'>[]> {
  const { lang, personaId, includeDraft = false, sort = 'desc' } = options;
  const allPosts = await getCollection('posts');

  let posts = includeDraft ? allPosts : allPosts.filter(({ data }) => !data.draft);

  if (lang) {
    posts = posts.filter((post) => getPostLang(post) === lang);
  }

  if (personaId) {
    posts = posts.filter(({ data }) => data.personas.includes(personaId as PersonaId));
  }

  if (sort === 'desc') {
    return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  } else if (sort === 'asc') {
    return posts.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  }

  return posts;
}

export async function getPublishedPosts(options: { lang?: string; personaId?: string } = {}): Promise<CollectionEntry<'posts'>[]> {
  return queryPosts({ ...options, sort: 'desc' });
}

export async function getRssItems(options: { lang?: string; personaId?: PersonaId } = {}) {
  const { lang, personaId } = options;
  const posts = await queryPosts({ lang, personaId, sort: 'desc' });

  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: extractExcerpt(post.data.description, post.body) || undefined,
    link: getPostPath(post.id, post.data.personas[0], lang),
  }));
}
