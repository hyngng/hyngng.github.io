import type { CollectionEntry } from 'astro:content';
import { ALL_AUTHORS, getAuthor, type AuthorId } from '../settings/authors.settings';
import {
  SITE,
  defaultLocaleBcp47,
  supportedLocales,
} from '../settings/site.settings';
import { getSiteMeta } from '../locales';
import { getPostLang, getPostPath, getAuthorPath, extractExcerpt } from './posts';

export const LLMS_LOCALE = SITE.llms.locale;
export const LLMS_MAX_POSTS_PER_AUTHOR = 10;
export const LLMS_DESCRIPTION_MAX_LENGTH = 155;

interface LlmsTxtInput {
  origin: string;
  posts: CollectionEntry<'posts'>[];
}

interface LlmsPost {
  title: string;
  url: string;
  description: string;
}

interface LlmsAuthor {
  name: string;
  url: string;
  description: string;
}

interface LlmsAuthorSection {
  name: string;
  posts: LlmsPost[];
}

interface LlmsDoc {
  title: string;
  description: string;
  defaultLanguage: string;
  availableLocales: string[];
  authors: LlmsAuthor[];
  authorSections: LlmsAuthorSection[];
}

// Pure data assembly. `locale` is the single source of truth for every URL so
// the LLMS document (written in `LLMS_LOCALE`) never emits links to a
// different locale's path.
export function buildLlmsData({ origin, posts }: LlmsTxtInput): LlmsDoc {
  const locale = LLMS_LOCALE;
  const siteMeta = getSiteMeta(locale);

  const published = posts.filter(
    (post) => !post.data.draft && getPostLang(post) === locale,
  );

  const byDateDesc = [...published].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const postsByAuthor = new Map<AuthorId, CollectionEntry<'posts'>[]>();
  for (const post of byDateDesc) {
    const id = post.data.authors[0] as AuthorId;
    const list = postsByAuthor.get(id);
    if (list) list.push(post);
    else postsByAuthor.set(id, [post]);
  }

  const authors: LlmsAuthor[] = ALL_AUTHORS.map((author) => {
    const meta = getAuthor(author.id, locale);
    return {
      name: author.name,
      url: `${origin}${getAuthorPath(author.id, locale)}`,
      description: meta.description,
    };
  });

  const authorSections: LlmsAuthorSection[] = ALL_AUTHORS.map((author) => ({
    name: author.name,
    posts: (postsByAuthor.get(author.id as AuthorId) ?? [])
      .slice(0, LLMS_MAX_POSTS_PER_AUTHOR)
      .map((post) => ({
        title: post.data.title,
        url: `${origin}${getPostPath(post.id, post.data.authors[0] as AuthorId, locale)}`,
        description:
          post.data.description ||
          extractExcerpt(undefined, post.body, LLMS_DESCRIPTION_MAX_LENGTH, '...'),
      })),
  })).filter((section) => section.posts.length > 0);

  return {
    title: SITE.title,
    description: siteMeta.description,
    defaultLanguage: defaultLocaleBcp47,
    availableLocales: supportedLocales,
    authors,
    authorSections,
  };
}

// Pure markdown rendering — no locale/URL logic.
function renderLlmsTxt(doc: LlmsDoc, origin: string): string {
  const lines: string[] = [];

  lines.push(`# ${doc.title}`);
  lines.push('');
  lines.push(`> ${doc.description}`);
  lines.push('');
  lines.push(
    `Default language: ${doc.defaultLanguage}. ` +
      `This document is written in English for LLM accessibility. ` +
      `Available locales: ${doc.availableLocales.join(', ')}.`,
  );
  lines.push('');
  lines.push('## Sections');
  lines.push('');
  lines.push(`- [Home](${origin}/)`);
  lines.push(`- [RSS](${origin}/rss.xml)`);
  lines.push('');
  lines.push('## Authors');
  lines.push('');

  for (const author of doc.authors) {
    lines.push(`- [${author.name}](${author.url}): ${author.description}`);
  }

  for (const section of doc.authorSections) {
    lines.push('');
    lines.push(`### ${section.name}`);
    lines.push('');
    for (const post of section.posts) {
      lines.push(`- [${post.title}](${post.url}): ${post.description}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function buildLlmsTxt(input: LlmsTxtInput): string {
  return renderLlmsTxt(buildLlmsData(input), input.origin);
}
