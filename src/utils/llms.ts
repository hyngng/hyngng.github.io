import type { CollectionEntry } from 'astro:content';
import { ALL_AUTHORS, getAuthor, type AuthorId } from '../settings/authors.settings';
import {
  SITE,
  getSiteMeta,
  getLocaleEntry,
  defaultLocale,
  defaultLocaleBcp47,
  supportedLocales,
} from '../settings/site.settings';
import { getPostLang, getPostPath, getAuthorPath, extractExcerpt } from './posts';

export const LLMS_LOCALE = 'en';
export const LLMS_MAX_POSTS_PER_AUTHOR = 10;
export const LLMS_DESCRIPTION_MAX_LENGTH = 155;

interface LlmsTxtInput {
  origin: string;
  posts: CollectionEntry<'posts'>[];
}

export function buildLlmsTxt({ origin, posts }: LlmsTxtInput): string {
  const locale = LLMS_LOCALE;
  const bcp47 = getLocaleEntry(locale).bcp47;
  const siteMeta = getSiteMeta(locale);

  const published = posts.filter(
    (post) => !post.data.draft && getPostLang(post.id) === locale,
  );

  const lines: string[] = [];

  lines.push(`# ${SITE.title}`);
  lines.push('');
  lines.push(`> ${siteMeta.description}`);
  lines.push('');
  lines.push(
    `Default language: ${defaultLocaleBcp47}. ` +
      `This document is written in English for LLM accessibility. ` +
      `Available locales: ${supportedLocales.join(', ')}.`,
  );
  lines.push('');
  lines.push('## Sections');
  lines.push('');
  lines.push(`- [Home](${origin}/)`);
  lines.push(`- [RSS](${origin}/rss.xml)`);
  lines.push('');
  lines.push('## Authors');
  lines.push('');

  for (const author of ALL_AUTHORS) {
    const meta = getAuthor(author.id, bcp47);
    lines.push(`- [${author.name}](${origin}${getAuthorPath(author.id, defaultLocale)}): ${meta.description}`);
  }

  for (const author of ALL_AUTHORS) {
    const authorPosts = published
      .filter((post) => post.data.authors[0] === author.id)
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .slice(0, LLMS_MAX_POSTS_PER_AUTHOR);

    if (authorPosts.length === 0) continue;

    lines.push('');
    lines.push(`### ${author.name}`);
    lines.push('');

    for (const post of authorPosts) {
      const description =
        post.data.description ||
        extractExcerpt(post.data.description, post.body, LLMS_DESCRIPTION_MAX_LENGTH, '...');
      const url = `${origin}${getPostPath(post.id, post.data.authors[0] as AuthorId, defaultLocale)}`;
      lines.push(`- [${post.data.title}](${url}): ${description}`);
    }
  }

  return `${lines.join('\n')}\n`;
}
