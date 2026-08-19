import { describe, it, expect } from 'vitest';
import {
  serializeJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildBlogPostingJsonLd,
} from './jsonLd';
import { getAuthorProfileUrls, type Author } from '../settings/authors.settings';

function mockAuthor(social: Author['social']): Author {
  return { id: 'dev', name: 'hyngng.dev', description: '', avatar: '', social };
}

describe('serializeJsonLd', () => {
  it('escapes < to \\u003c to prevent script injection', () => {
    const html = serializeJsonLd({ foo: '</script><script>alert(1)</script>' });
    expect(html).not.toContain('</script>');
    expect(html).toContain('\\u003c');
  });

  it('round-trips back to valid JSON', () => {
    const input = { headline: 'a < b & c' };
    expect(JSON.parse(serializeJsonLd(input))).toEqual(input);
  });
});

describe('buildWebSiteJsonLd', () => {
  it('emits a schema.org WebSite node', () => {
    const result = buildWebSiteJsonLd({
      url: 'https://hyngng.github.io/',
      name: 'HYNGNG',
      description: 'Greetings 🔥',
      image: 'https://hyngng.github.io/default-og.webp',
    });

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'HYNGNG',
      url: 'https://hyngng.github.io/',
      description: 'Greetings 🔥',
      image: 'https://hyngng.github.io/default-og.webp',
    });
  });
});

describe('buildBreadcrumbJsonLd', () => {
  it('assigns 1-based positions in order', () => {
    const result = buildBreadcrumbJsonLd([
      { name: 'HYNGNG', url: 'https://hyngng.github.io/' },
      { name: 'hyngng.dev', url: 'https://hyngng.github.io/dev/' },
      { name: 'Hello', url: 'https://hyngng.github.io/dev/hello/' },
    ]);

    expect(result['@type']).toBe('BreadcrumbList');
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0]).toEqual({ '@type': 'ListItem', position: 1, name: 'HYNGNG', item: 'https://hyngng.github.io/' });
    expect(result.itemListElement[2]).toEqual({ '@type': 'ListItem', position: 3, name: 'Hello', item: 'https://hyngng.github.io/dev/hello/' });
  });
});

describe('buildBlogPostingJsonLd', () => {
  const base = {
    title: 'Hello',
    description: 'A post.',
    image: 'https://hyngng.github.io/img.webp',
    datePublished: '2024-01-01T00:00:00.000Z',
    dateModified: '2024-01-02T00:00:00.000Z',
    inLanguage: 'ko-KR',
    url: 'https://hyngng.github.io/dev/hello/',
  };

  it('includes mainEntityOfPage pointing at the canonical url', () => {
    const result = buildBlogPostingJsonLd({ ...base, authors: [] });

    expect(result['@type']).toBe('BlogPosting');
    expect(result.url).toBe(base.url);
    expect(result.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': base.url });
  });

  it('emits author url and sameAs when provided', () => {
    const result = buildBlogPostingJsonLd({
      ...base,
      authors: [
        { name: 'hyngng.dev', url: 'https://hyngng.github.io/dev/', sameAs: ['https://github.com/hyngng'] },
        { name: 'no-link', url: 'https://hyngng.github.io/art/', sameAs: [] },
      ],
    });

    expect(result.author).toHaveLength(2);
    expect(result.author[0]).toEqual({
      '@type': 'Person',
      name: 'hyngng.dev',
      url: 'https://hyngng.github.io/dev/',
      sameAs: ['https://github.com/hyngng'],
    });
    expect(result.author[1]).toEqual({ '@type': 'Person', name: 'no-link', url: 'https://hyngng.github.io/art/' });
  });
});

describe('getAuthorProfileUrls', () => {
  it('resolves every registered platform from the social map', () => {
    const urls = getAuthorProfileUrls(
      mockAuthor({
        github: 'hyngng',
        twitter: 'hyngng_dev',
        instagram: 'hyngng.art',
        website: 'https://hyngng.art',
        fediverse: '@hyngng.dev@threads.net',
      }),
    );

    expect(urls).toEqual([
      'https://github.com/hyngng',
      'https://x.com/hyngng_dev',
      'https://instagram.com/hyngng.art',
      'https://hyngng.art',
      'https://threads.net/@hyngng.dev',
    ]);
  });

  it('skips unregistered keys and empty handles', () => {
    const urls = getAuthorProfileUrls(mockAuthor({ email: 'dev@example.com', twitter: '', fediverse: 'not-a-handle' }));

    expect(urls).toEqual([]);
  });

  it('returns an empty array when no social links exist', () => {
    expect(getAuthorProfileUrls(mockAuthor({}))).toEqual([]);
  });
});
