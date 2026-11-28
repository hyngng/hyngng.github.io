import { describe, it, expect, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';

vi.mock('astro:content', () => ({
  getCollection: () => Promise.resolve([]),
}));

import { buildLlmsTxt, buildLlmsData, LLMS_LOCALE, LLMS_MAX_POSTS_PER_PERSONA } from './llms';
import { getPersona } from '../settings/personas.settings';
import { getSiteMeta } from './pageContext';

const ORIGIN = 'https://example.com';

function mockPost(
  id: string,
  overrides: {
    title?: string;
    date?: string;
    personas?: string[];
    draft?: boolean;
    description?: string;
    body?: string;
    lang?: string;
  } = {},
): CollectionEntry<'posts'> {
  return {
    id,
    data: {
      title: overrides.title ?? id,
      date: new Date(overrides.date ?? '2024-01-01T00:00:00Z'),
      personas: overrides.personas ?? ['blog'],
      draft: overrides.draft ?? false,
      description: overrides.description,
      body: overrides.body ?? '',
      lang: overrides.lang ?? id.split('/')[0],
      categories: [],
      tags: [],
    },
    body: overrides.body ?? '',
    render: () => Promise.resolve({} as never),
    collection: 'posts',
  } as unknown as CollectionEntry<'posts'>;
}

function build(posts: CollectionEntry<'posts'>[]) {
  return buildLlmsTxt({ origin: ORIGIN, posts });
}

describe('buildLlmsTxt', () => {
  it('emits title, hero description, default language and personas', () => {
    const text = build([mockPost(`${LLMS_LOCALE}/blog/2024-01-01-a`)]);

    expect(text).toContain('# Vignette\n');
    expect(text).toContain(`> ${getSiteMeta(LLMS_LOCALE).description}`);
    expect(text).toContain('Default language: ko-KR.');
    const availLine = text.match(/Available locales: ([^.]+)\./)![1];
    expect(availLine).toBe('ko-KR');
    expect(text).toContain('## Sections\n');
    expect(text).toContain(`- [Home](${ORIGIN}/)`);
    expect(text).toContain(`- [RSS](${ORIGIN}/rss.xml)`);
    expect(text).toContain('## Personas\n');
    expect(text).toContain(`- [blog](${ORIGIN}/blog/): ${getPersona('blog', LLMS_LOCALE).description}`);
  });

  it('groups posts by primary persona and links to the LLMS locale post path', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/blog/2024-01-01-hello`, { title: 'Hello' }),
      mockPost(`${LLMS_LOCALE}/art/2024-01-02-thought`, { title: 'Thought', personas: ['art'] }),
    ]);

    expect(text).toContain('### blog\n');
    expect(text).toContain(`- [Hello](${ORIGIN}/blog/hello/): `);
    expect(text).toContain('### art\n');
    expect(text).toContain(`- [Thought](${ORIGIN}/art/thought/): `);
  });

  it('caps post links per persona at the configured maximum', () => {
    const posts = Array.from({ length: LLMS_MAX_POSTS_PER_PERSONA + 5 }, (_, i) =>
      mockPost(`${LLMS_LOCALE}/blog/2024-01-${String(i + 1).padStart(2, '0')}-post`, {
        title: `Post ${i + 1}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      }),
    );

    const section = build(posts).split('### blog\n')[1];
    const bullets = section.split('\n').filter((line) => line.startsWith('- ['));
    expect(bullets).toHaveLength(LLMS_MAX_POSTS_PER_PERSONA);
    expect(bullets[0]).toContain(`Post ${LLMS_MAX_POSTS_PER_PERSONA + 5}`);
  });

  it('falls back to body excerpt when description is missing', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/blog/2024-01-01-with-desc`, {
        title: 'With desc',
        description: 'Explicit description.',
      }),
      mockPost(`${LLMS_LOCALE}/blog/2024-01-02-no-desc`, {
        title: 'No desc',
        body: 'First paragraph explaining the post.\n\nSecond paragraph.',
      }),
    ]);

    expect(text).toContain(`- [With desc](${ORIGIN}/blog/with-desc/): Explicit description.`);
    expect(text).toContain(`- [No desc](${ORIGIN}/blog/no-desc/): First paragraph explaining`);
  });

  it('appends an ellipsis only when the body excerpt is truncated', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/blog/2024-01-01-long`, {
        title: 'Long',
        body: `${'word '.repeat(60)}end.`,
      }),
      mockPost(`${LLMS_LOCALE}/blog/2024-01-02-short`, {
        title: 'Short',
        body: 'A short body that fits within the limit.',
      }),
    ]);

    const longLine = text.split('\n').find((line) => line.startsWith('- [Long]'));
    expect(longLine).toMatch(/: .*\.\.\.$/);
    expect(text).toContain(`- [Short](${ORIGIN}/blog/short/): A short body that fits within the limit.`);
    expect(text).not.toContain('within the limit...');
  });

  it('excludes drafts and posts in other locales', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/blog/2024-01-01-draft`, { draft: true }),
      mockPost('en-US/blog/2024-01-01-english'),
    ]);

    expect(text).not.toContain('### blog\n\n-');
    expect(text).not.toContain('english');
  });

  it('builds data layer with locale-consistent (ko-KR) URLs', () => {
    const doc = buildLlmsData({ origin: ORIGIN, posts: [mockPost(`${LLMS_LOCALE}/blog/2024-01-01-a`)] });
    expect(doc.availableLocales).toEqual(['ko-KR']);
    for (const a of doc.personas) expect(a.url).toMatch(/\/(art|blog)\/$/);
    const blogSection = doc.personaSections.find((s) => s.name === 'blog');
    expect(blogSection?.posts[0].url).toBe(`${ORIGIN}/blog/a/`);
  });
});
