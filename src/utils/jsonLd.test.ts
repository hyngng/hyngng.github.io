import { describe, it, expect } from 'vitest';
import {
  serializeJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildBlogPostingJsonLd,
} from './jsonLd';
import { getPersonaProfileUrls, type Persona } from '../settings/personas.settings';

function mockPersona(social: Persona['social']): Pick<Persona, 'social'> {
  return { social };
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
      url: 'https://example.com/',
      name: 'Vignette',
      description: 'A minimal blog theme.',
      image: 'https://example.com/default-og.webp',
    });

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vignette',
      url: 'https://example.com/',
      description: 'A minimal blog theme.',
      image: 'https://example.com/default-og.webp',
    });
  });
});

describe('buildBreadcrumbJsonLd', () => {
  it('assigns 1-based positions in order', () => {
    const result = buildBreadcrumbJsonLd([
      { name: 'Vignette', url: 'https://example.com/' },
      { name: 'blog', url: 'https://example.com/blog/' },
      { name: 'Hello', url: 'https://example.com/blog/hello/' },
    ]);

    expect(result['@type']).toBe('BreadcrumbList');
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0]).toEqual({ '@type': 'ListItem', position: 1, name: 'Vignette', item: 'https://example.com/' });
    expect(result.itemListElement[2]).toEqual({ '@type': 'ListItem', position: 3, name: 'Hello', item: 'https://example.com/blog/hello/' });
  });
});

describe('buildBlogPostingJsonLd', () => {
  const base = {
    title: 'Hello',
    description: 'A post.',
    image: 'https://example.com/img.webp',
    datePublished: '2024-01-01T00:00:00.000Z',
    dateModified: '2024-01-02T00:00:00.000Z',
    inLanguage: 'ko-KR',
    url: 'https://example.com/blog/hello/',
  };

  it('includes mainEntityOfPage pointing at the canonical url', () => {
    const result = buildBlogPostingJsonLd({ ...base, personas: [] });

    expect(result['@type']).toBe('BlogPosting');
    expect(result.url).toBe(base.url);
    expect(result.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': base.url });
  });

  it('emits author url and sameAs when provided', () => {
    const result = buildBlogPostingJsonLd({
      ...base,
      personas: [
        { name: 'blog', url: 'https://example.com/blog/', sameAs: ['https://github.com/example'] },
        { name: 'no-link', url: 'https://example.com/art/', sameAs: [] },
      ],
    });

    expect(result.author).toHaveLength(2);
    expect(result.author[0]).toEqual({
      '@type': 'Person',
      name: 'blog',
      url: 'https://example.com/blog/',
      sameAs: ['https://github.com/example'],
    });
    expect(result.author[1]).toEqual({ '@type': 'Person', name: 'no-link', url: 'https://example.com/art/' });
  });
});

describe('getPersonaProfileUrls', () => {
  it('resolves every registered platform from the social map', () => {
    const urls = getPersonaProfileUrls(
      mockPersona({
        github: 'example',
        twitter: 'vignette_blog',
        instagram: 'vignette.art',
        website: 'https://vignette.art',
        fediverse: '@vignette@example.com',
      }),
    );

    expect(urls).toEqual([
      'https://github.com/example',
      'https://x.com/vignette_blog',
      'https://instagram.com/vignette.art',
      'https://vignette.art',
      'https://example.com/@vignette',
    ]);
  });

  it('skips unregistered keys and empty handles', () => {
    const urls = getPersonaProfileUrls(mockPersona({ email: 'hello@example.com', twitter: '', fediverse: 'not-a-handle' }));

    expect(urls).toEqual([]);
  });

  it('returns an empty array when no social links exist', () => {
    expect(getPersonaProfileUrls(mockPersona({}))).toEqual([]);
  });
});
