// ── Types ────────────────────────────────────────────────

import { resolveCdnPath } from '../utils/cdn';
import { defaultLocaleBcp47 } from './site.settings';

export interface Social {
  email?: string;
  github?: string;
  twitter?: string;
  fediverse?: string; // '@user@domain.com'
  instagram?: string;
  website?: string;
}

export interface AuthorLocaleMeta {
  description: string;
}

export interface Author {
  id: string; // used in frontmatter & routing
  name: string; // e.g. 'hyngng.dev'
  description: string;
  avatar: string; // e.g. '/assets/img/authors/dev.jpg'
  social: Social;
  locales: Partial<Record<string, AuthorLocaleMeta>>;
}

// ── Configuration ────────────────────────────────────────

export const AUTHOR_PREFIX = '@';

// ── Author map ───────────────────────────────────────────
// Reference in frontmatter as: author: 'dev'

export const AUTHORS = {

  dev: {
    id: 'dev',
    name: 'hyngng.dev',
    description: '프로그래밍과 개발 경험을 기록합니다.',
    avatar: 'avatar/hyngng-dev.webp',
    social: {
      email: 'dev@example.com',
      github: 'hyngng',
      twitter: 'hyngng_dev',
      fediverse: '@hyngng.dev@threads.net',
    },
    locales: {
      'ko-KR': { description: '프로그래밍과 개발 경험을 기록합니다.' },
      'en-US': { description: 'Recording programming and dev experiences.' },
    },
  },

  art: {
    id: 'art',
    name: 'hyngng.art',
    description: '그림과 그림에 대한 생각을 정리합니다.',
    avatar: 'avatar/hyngng-art.webp',
    social: {
      instagram: 'hyngng.art',
      fediverse: '@hyngng.art@threads.net',
      website: 'https://hyngng.art',
    },
    locales: {
      'ko-KR': { description: '그림과 그림에 대한 생각을 정리합니다.' },
      'en-US': { description: 'Organizing thoughts on art and drawing.' },
    },
  },

  photography: {
    id: 'photography',
    name: 'hyngng.photography',
    description: '매해의 사진을 정리한 작은 갤러리입니다.',
    avatar: 'avatar/hyngng-photography.webp',
    social: {
      fediverse: '@hyngng.essay@threads.net',
    },
    locales: {
      'ko-KR': { description: '매해의 사진을 정리한 작은 갤러리입니다.' },
      'en-US': { description: 'A small gallery organizing photos year by year.' },
    },
  },

  blog: {
    id: 'blog',
    name: 'hyngng.blog',
    description: '블로그 관리 기록을 정리합니다.',
    avatar: 'avatar/hyngng-blog.webp',
    social: {
      email: 'blog@example.com',
      github: 'hyngng',
      twitter: 'hyngng_blog',
      fediverse: '@hyngng.blog@threads.net',
    },
    locales: {
      'ko-KR': { description: '블로그 관리 기록을 정리합니다.' },
      'en-US': { description: 'Documenting blog management logs.' },
    },
  },

  essay: {
    id: 'essay',
    name: 'hyngng.essay',
    description: '에세이와 생각을 기록합니다.',
    avatar: 'avatar/hyngng-essay.webp',
    social: {
      fediverse: '@hyngng.essay@threads.net',
    },
    locales: {
      'ko-KR': { description: '에세이와 생각을 기록합니다.' },
      'en-US': { description: 'Recording essays and reflections.' },
    },
  },

} satisfies Record<string, Omit<Author, 'id'> & { id: string }>;

// ── Derived types ────────────────────────────────────────

// Use in content collection schema: z.enum(AUTHOR_IDS)
export type AuthorId = keyof typeof AUTHORS;
export const AUTHOR_IDS = Object.keys(AUTHORS) as [AuthorId, ...AuthorId[]];

// ── Helpers ──────────────────────────────────────────────

function resolveAuthorLocale(author: Author, lang?: string): AuthorLocaleMeta | undefined {
  if (!lang) lang = defaultLocaleBcp47;
  if (author.locales[lang]) return author.locales[lang];

  const prefix = lang.split('-')[0];
  const matched = Object.entries(author.locales).find(([key]) => key.startsWith(prefix));
  if (matched) return matched[1];

  return author.locales[defaultLocaleBcp47];
}

export function getAuthor(id: string, lang?: string): Author & AuthorLocaleMeta {
  const author = AUTHORS[id as AuthorId];
  if (!author) throw new Error(`Unknown author: "${id}"`);
  const meta = resolveAuthorLocale(author, lang);
  return {
    ...author,
    avatar: resolveCdnPath(author.avatar),
    description: meta?.description ?? author.description,
  };
}

export const ALL_AUTHORS = Object.values(AUTHORS);
