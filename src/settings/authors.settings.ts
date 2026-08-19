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

// Social handle -> profile URL resolver registry.
// New platform: add a key to `Social` and an entry here (e.g. bluesky, facebook, mastodon, pinterest).
export const SOCIAL_PROFILE_URLS: Record<string, (handle: string) => string | undefined> = {
  github: (handle) => `https://github.com/${handle}`,
  twitter: (handle) => `https://x.com/${handle}`,
  instagram: (handle) => `https://instagram.com/${handle}`,
  website: (handle) => handle,
  fediverse: (handle) => {
    const match = handle.match(/^@?([^@]+)@([^@]+)$/);
    return match ? `https://${match[2]}/@${match[1]}` : undefined;
  },
};

export function getAuthorProfileUrls(author: { social: Social }): string[] {
  return Object.entries(author.social).flatMap(([key, handle]) => {
    if (!handle) return [];
    const resolve = SOCIAL_PROFILE_URLS[key];
    if (!resolve) return [];
    const url = resolve(handle);
    return url ? [url] : [];
  });
}

export function normalizeTwitterHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

interface AuthorData {
  id: string;
  name: string;
  description: Partial<Record<string, string>>; // per-locale descriptions
  avatar: string;
  social: Social;
}

export type Author = Omit<AuthorData, 'description'> & { description: string };

// ── Configuration ────────────────────────────────────────

export const AUTHOR_PREFIX = '@';

// ── Author map ───────────────────────────────────────────
// Reference in frontmatter as: author: 'dev'

export const AUTHORS = {

  art: {
    id: 'art',
    name: 'hyngng.art',
    avatar: 'avatar/hyngng-art.webp',
    social: {
      instagram: 'hyngng.art',
      // fediverse: '@hyngng.art@threads.net',
      // website: 'https://hyngng.art',
    },
    description: {
      'ko-KR': '그림과 그림에 대한 생각을 정리합니다.',
      'en-US': 'Organizing artwork and thoughts about art.',
      'ru-RU': 'Упорядочиваю рисунки и мысли о рисовании.',
      'fr-FR': 'J\'organise mes dessins et mes réflexions sur le dessin.',
      'es-ES': 'Organizo dibujos y reflexiones sobre el dibujo.',
      'ja-JP': '絵と絵についての考えを整理しています。',
      'zh-CN': '整理画作与关于画作的思考。',
    },
  },

  photography: {
    id: 'photography',
    name: 'hyngng.photography',
    avatar: 'avatar/hyngng-photography.webp',
    social: {
      // fediverse: '@hyngng.essay@threads.net',
    },
    description: {
      'ko-KR': '사진과 사진에 대한 생각을 정리합니다.',
      'en-US': 'Organizing photos and thoughts about photography.',
      'ru-RU': 'Упорядочиваю фотографии и мысли о фотографии.',
      'fr-FR': 'J\'organise mes photos et mes réflexions sur la photographie.',
      'es-ES': 'Organizo fotos y reflexiones sobre la fotografía.',
      'ja-JP': '写真と写真についての考えを整理しています。',
      'zh-CN': '整理照片与关于摄影的想法。',
    },
  },

  dev: {
    id: 'dev',
    name: 'hyngng.dev',
    avatar: 'avatar/hyngng-dev.webp',
    social: {
      // email: 'dev@example.com',
      github: 'hyngng',
      twitter: 'hyngng_dev',
      // fediverse: '@hyngng.dev@threads.net',
    },
    description: {
      'ko-KR': '프로그래밍과 개발 경험을 기록합니다.',
      'en-US': 'Recording programming and development experiences.',
      'ru-RU': 'Записываю опыт программирования и разработки.',
      'fr-FR': 'Je consigne mes expériences de programmation et de développement.',
      'es-ES': 'Documento mis experiencias de programación y desarrollo.',
      'ja-JP': 'プログラミングと開発の経験を記録しています。',
      'zh-CN': '记录编程与开发经验。',
    },
  },

  blog: {
    id: 'blog',
    name: 'hyngng.blog',
    avatar: 'avatar/hyngng-blog.webp',
    social: {
      // email: 'blog@example.com',
      github: 'hyngng',
      twitter: 'hyngng_blog',
      // fediverse: '@hyngng.blog@threads.net',
    },
    description: {
      'ko-KR': '블로그 관리 기록을 정리합니다.',
      'en-US': 'Organizing blog management records.',
      'ru-RU': 'Упорядочиваю записи об управлении блогом.',
      'fr-FR': 'J\'organise les archives de gestion du blog.',
      'es-ES': 'Organizo los registros de administración del blog.',
      'ja-JP': 'ブログ運営の記録を整理しています。',
      'zh-CN': '整理博客的管理记录。',
    },
  },

  essay: {
    id: 'essay',
    name: 'hyngng.essay',
    avatar: 'avatar/hyngng-essay.webp',
    social: {
      // fediverse: '@hyngng.essay@threads.net',
    },
    description: {
      'ko-KR': '에세이와 생각을 기록합니다.',
      'en-US': 'Recording essays and thoughts.',
      'ru-RU': 'Записываю эссе и мысли.',
      'fr-FR': 'Je consigne des essais et des pensées.',
      'es-ES': 'Documento ensayos y pensamientos.',
      'ja-JP': 'エッセイと思いを記録しています。',
      'zh-CN': '记录随笔与想法。',
    },
  },

} satisfies Record<string, AuthorData>;

// ── Derived types ────────────────────────────────────────

// Use in content collection schema: z.enum(AUTHOR_IDS)
export type AuthorId = keyof typeof AUTHORS;
export const AUTHOR_IDS = Object.keys(AUTHORS) as [AuthorId, ...AuthorId[]];

// ── Helpers ──────────────────────────────────────────────

function resolveAuthorDescription(author: AuthorData, lang?: string): string {
  const descriptions = author.description;
  const locale = lang ?? defaultLocaleBcp47;

  if (descriptions[locale]) return descriptions[locale]!;

  const prefix = locale.split('-')[0];
  const matched = Object.entries(descriptions).find(([key]) => key.startsWith(prefix));
  if (matched) return matched[1]!;

  return descriptions[defaultLocaleBcp47] ?? '';
}

export function getAuthor(id: string, lang?: string): Author {
  const author = AUTHORS[id as AuthorId];
  if (!author) throw new Error(`Unknown author: "${id}"`);
  return {
    ...author,
    avatar: resolveCdnPath(author.avatar),
    description: resolveAuthorDescription(author, lang),
  };
}

export const ALL_AUTHORS = Object.values(AUTHORS);
