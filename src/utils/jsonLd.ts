export interface JsonLdAuthor {
  name: string;
  url?: string;
  sameAs?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BlogPostingData {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authors: JsonLdAuthor[];
  inLanguage: string;
  url: string;
}

export interface WebSiteJsonLd {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  image: string;
}

export interface BreadcrumbListJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }[];
}

export interface BlogPostingJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
    sameAs?: string[];
  }[];
  inLanguage: string;
  url: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildWebSiteJsonLd({
  url,
  name,
  description,
  image,
}: {
  url: string;
  name: string;
  description: string;
  image: string;
}): WebSiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    image,
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildBlogPostingJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authors,
  inLanguage,
  url,
}: BlogPostingData): BlogPostingJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      ...(a.url ? { url: a.url } : {}),
      ...(a.sameAs && a.sameAs.length > 0 ? { sameAs: a.sameAs } : {}),
    })),
    inLanguage,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}
