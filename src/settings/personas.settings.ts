// ── Types ────────────────────────────────────────────────

import { resolveCdnPath } from '../utils/cdn';
import { defaultLocaleBcp47, getLocaleEntry } from './site.settings';

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

export function getPersonaProfileUrls(persona: { social: Social }): string[] {
  return Object.entries(persona.social).flatMap(([key, handle]) => {
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

interface PersonaData {
  description: Partial<Record<string, string>>; // per-locale descriptions
  avatar: string;
  social: Social;
}

export type Persona = Omit<PersonaData, 'description'> & { name: PersonaId; description: string };

// ── Configuration ────────────────────────────────────────

export const PERSONA_PREFIX = '@';

// ── Persona map ───────────────────────────────────────────
// Reference in frontmatter by persona ID, e.g. 'blog'

export const PERSONAS = {

  art: {
    avatar: '/assets/img/avatar-art.svg',
    social: {},
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

  blog: {
    avatar: '/assets/img/avatar-blog.svg',
    social: {},
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

} satisfies Record<string, PersonaData>;

// ── Derived types ────────────────────────────────────────

// Use in content collection schema: z.enum(PERSONA_IDS)
export type PersonaId = keyof typeof PERSONAS;
export const PERSONA_IDS = Object.keys(PERSONAS) as [PersonaId, ...PersonaId[]];

// ── Helpers ──────────────────────────────────────────────

function resolvePersonaDescription(persona: PersonaData, lang?: string): string {
  const descriptions = persona.description;
  const entry = getLocaleEntry(lang);

  return descriptions[entry.bcp47] ?? descriptions[defaultLocaleBcp47] ?? '';
}

export function getPersona(name: string, lang?: string): Persona {
  const persona = PERSONAS[name as PersonaId];
  if (!persona) throw new Error(`Unknown persona: "${name}"`);
  return {
    ...persona,
    name: name as PersonaId,
    avatar: resolveCdnPath(persona.avatar),
    description: resolvePersonaDescription(persona, lang),
  };
}

export const ALL_PERSONAS = Object.entries(PERSONAS).map(([name, persona]) => ({
  ...persona,
  name: name as PersonaId,
}));
