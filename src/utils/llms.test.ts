import { describe, it, expect, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';

vi.mock('astro:content', () => ({
  getCollection: () => Promise.resolve([]),
}));

import { buildLlmsTxt, buildLlmsData, LLMS_LOCALE, LLMS_MAX_POSTS_PER_AUTHOR } from './llms';

const ORIGIN = 'https://hyngng.github.io';

function mockPost(
  id: string,
  overrides: {
    title?: string;
    date?: string;
    authors?: string[];
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
      authors: overrides.authors ?? ['dev'],
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
  it('emits title, hero description, default language and authors', () => {
    const text = build([mockPost(`${LLMS_LOCALE}/dev/2024-01-01-a`)]);

    expect(text).toContain('# HYNGNG\n');
    expect(text).toContain('> Greetings 🔥');
    expect(text).toContain('Default language: ko-KR.');
    const availLine = text.match(/Available locales: ([^.]+)\./)![1];
    for (const code of ['ko-KR', 'en-US', 'ru-RU', 'fr-FR', 'es-ES', 'ja-JP', 'zh-CN']) {
      expect(availLine).toContain(code);
    }
    expect(text).toContain('## Sections\n');
    expect(text).toContain(`- [Home](${ORIGIN}/)`);
    expect(text).toContain(`- [RSS](${ORIGIN}/rss.xml)`);
    expect(text).toContain('## Authors\n');
    expect(text).toContain(`- [hyngng.dev](${ORIGIN}/en/dev/): Recording programming and development experiences.`);
  });

  it('groups posts by primary author and links to the LLMS locale (en-US) post path', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/dev/2024-01-01-hello`, { title: 'Hello' }),
      mockPost(`${LLMS_LOCALE}/essay/2024-01-02-thought`, { title: 'Thought', authors: ['essay'] }),
    ]);

    expect(text).toContain('### hyngng.dev\n');
    expect(text).toContain(`- [Hello](${ORIGIN}/en/dev/hello/): `);
    expect(text).toContain('### hyngng.essay\n');
    expect(text).toContain(`- [Thought](${ORIGIN}/en/essay/thought/): `);
  });

  it('caps post links per author at the configured maximum', () => {
    const posts = Array.from({ length: LLMS_MAX_POSTS_PER_AUTHOR + 5 }, (_, i) =>
      mockPost(`${LLMS_LOCALE}/dev/2024-01-${String(i + 1).padStart(2, '0')}-post`, {
        title: `Post ${i + 1}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      }),
    );

    const section = build(posts).split('### hyngng.dev\n')[1];
    const bullets = section.split('\n').filter((line) => line.startsWith('- ['));
    expect(bullets).toHaveLength(LLMS_MAX_POSTS_PER_AUTHOR);
    expect(bullets[0]).toContain(`Post ${LLMS_MAX_POSTS_PER_AUTHOR + 5}`);
  });

  it('falls back to body excerpt when description is missing', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/dev/2024-01-01-with-desc`, {
        title: 'With desc',
        description: 'Explicit description.',
      }),
      mockPost(`${LLMS_LOCALE}/dev/2024-01-02-no-desc`, {
        title: 'No desc',
        body: 'First paragraph explaining the post.\n\nSecond paragraph.',
      }),
    ]);

    expect(text).toContain('- [With desc](https://hyngng.github.io/en/dev/with-desc/): Explicit description.');
    expect(text).toContain('- [No desc](https://hyngng.github.io/en/dev/no-desc/): First paragraph explaining');
  });

  it('appends an ellipsis only when the body excerpt is truncated', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/dev/2024-01-01-long`, {
        title: 'Long',
        body: `${'word '.repeat(60)}end.`,
      }),
      mockPost(`${LLMS_LOCALE}/dev/2024-01-02-short`, {
        title: 'Short',
        body: 'A short body that fits within the limit.',
      }),
    ]);

    expect(text).toMatch(/- \[Long\]\(https:\/\/hyngng\.github\.io\/en\/dev\/long\/\): .*\.\.\.$/m);
    expect(text).toContain('- [Short](https://hyngng.github.io/en/dev/short/): A short body that fits within the limit.');
    expect(text).not.toContain('within the limit...');
  });

  it('excludes drafts and posts in other locales', () => {
    const text = build([
      mockPost(`${LLMS_LOCALE}/dev/2024-01-01-draft`, { draft: true }),
      mockPost('ko-KR/dev/2024-01-01-korean'),
    ]);

    expect(text).not.toContain('### hyngng.dev\n\n-');
    expect(text).not.toContain('- [ko/dev/2024-01-01-korean](');
  });

  it('builds data layer with locale-consistent (en-US) URLs', () => {
    const doc = buildLlmsData({ origin: ORIGIN, posts: [mockPost(`${LLMS_LOCALE}/dev/2024-01-01-a`)] });
    for (const a of doc.authors) expect(a.url).toContain('/en/');
    const devSection = doc.authorSections.find((s) => s.name === 'hyngng.dev');
    expect(devSection?.posts[0].url).toBe(`${ORIGIN}/en/dev/a/`);
  });
});
