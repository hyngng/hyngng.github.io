// ┌──────────────────────┐
// │  Site Configuration  │
// └──────────────────────┘

import fs from 'node:fs';
import path from 'node:path';
import { getFrontmatterLang } from '../utils/frontmatter-lang';

// ── Locale (content-driven) ────────────────────
// A post's language is its frontmatter `lang` (2-letter code, e.g. "en").
// The set of supported languages is derived from the posts themselves: any
// 2-letter `lang` present in a post makes that language naturally supported —
// no central list to maintain. `LOCALE_REGISTRY` below is an *enrichment* map
// (accurate BCP 47 / og:locale for known languages); it is NOT a gatekeeper.
// Unknown languages fall back to a generic derivation in `getLocaleEntry`.

export type LocaleCode = string;

export const defaultLocale: LocaleCode = 'ko';

export interface LocaleRegistryEntry {
  code: LocaleCode;
  bcp47: string;
  language: string;
  region: string;
  ogLocale: string;
  description: string;
}

// Known languages with curated SEO metadata. Open to extension; absence here
// only means a language gets a generic bcp47/ogLocale fallback.
const LOCALE_REGISTRY_RAW = [
  { bcp47: 'ko-KR', description: '반갑습니다 🔥' },
  { bcp47: 'en-US', description: 'Greetings 🔥' },
  { bcp47: 'ru-RU', description: 'Приветствую 🔥' },
  { bcp47: 'fr-FR', description: 'Salutations 🔥' },
  { bcp47: 'es-ES', description: 'Saludos 🔥' },
  { bcp47: 'ja-JP', description: 'こんにちは 🔥' },
  { bcp47: 'zh-CN', description: '你好 🔥' },
] as const;

export const LOCALE_REGISTRY: LocaleRegistryEntry[] = LOCALE_REGISTRY_RAW.map(
  ({ bcp47, description }) => {
    const intl = new Intl.Locale(bcp47);
    const region = intl.region ?? '';
    const code = intl.language;
    return {
      code,
      bcp47,
      language: intl.language,
      region,
      ogLocale: region ? `${intl.language}_${region}` : `${intl.language}_${intl.language.toUpperCase()}`,
      description,
    };
  },
);

// Supported languages = default locale ∪ every 2-letter `lang` found in posts.
// Scanned once at module load (build/dev/config time) from the posts directory.
function scanPostLangValues(): Set<string> {
  const set = new Set<string>([defaultLocale]);
  const postsDir = path.resolve('posts');
  if (!fs.existsSync(postsDir)) return set;
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.(md|mdx)$/i.test(entry.name)) continue;
      const raw = fs.readFileSync(full, 'utf8');
      const lang = getFrontmatterLang(raw);
      if (lang && /^[a-z]{2}$/.test(lang)) set.add(lang);
    }
  };
  walk(postsDir);
  return set;
}

export const supportedLocales: string[] = [...scanPostLangValues()];

export const defaultLocaleBcp47 = LOCALE_REGISTRY[0]!.bcp47;

function genericLocaleEntry(lang: string): LocaleRegistryEntry {
  return {
    code: lang,
    bcp47: lang,
    language: lang,
    region: '',
    ogLocale: `${lang}_${lang.toUpperCase()}`,
    description: LOCALE_REGISTRY[0]?.description ?? '',
  };
}

export function getLocaleEntry(lang?: string): LocaleRegistryEntry {
  if (lang) {
    const found = LOCALE_REGISTRY.find((l) => l.code === lang || l.bcp47 === lang);
    if (found) return found;
    return genericLocaleEntry(lang);
  }
  return LOCALE_REGISTRY[0] ?? genericLocaleEntry(defaultLocale);
}

export const SITE = {

  // ── Basic Info ─────────────────────────────────────────────────

  title: 'HYNGNG',
  themeName: 'Vignette',
  description: '반갑습니다 🔥',
  username: 'hyngng',
  url: 'https://hyngng.github.io',

  cdn: {
    imageBaseUrl: 'https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master',
  },

  fonts: {
    baseStack: "var(--font-pretendard), Inter, system-ui, sans-serif",
  },

  // ── Localization ───────────────────────────────────────────────

  timezone: 'Asia/Seoul',

  // ── OG Image ─────────

  ogImage: '/default-og.webp',

  // ── Social ─────────────────────────────────────────────────

  social: {
    twitter: '' as string,
    fediverse: '@hyngng.main@threads.net',
  },

  // ── Webmaster Tools Verifications ────────────────────────────────────

  verification: {
    google: undefined,
    yandex: undefined,
    baidu: undefined,
    pinterest: '150084dfff2fed3d81028aea5d976b18',
    naver: undefined,
    daum: '#DaumWebMasterTool:888dbe1bcc4e27a7b1331a7b12e15bd6a837d90cdbab04a73d9c9d8bba43bcb6:0OfsYyHnFuv/yXuBH678tw==',
  },

  // ── Web Analytics Settings ───────────────────────────────────────────

  analytics: {
    google: { id: 'G-XY2QYYTPGN' },          // 'G-XXXXXXX' (Google Analytics 4)
    googleTagManager: { id: 'GTM-T8X838Q8' }, // 'GTM-XXXXXXX'
    goatcounter: { id: 'hyngng' },     // 'your-code'
    adsense: { client: 'ca-pub-2168910631722247', adSlot: '9042589720' },
  },

  // ── Giscus ───────────────────────────────────────────────

  giscus: {
    repo: 'hyngng/hyngng.github.io',
    repoId: 'R_kgDOH0Atrg',
    category: 'General',
    categoryId: 'DIC_kwDOH0Atrs4CeVis',
    mapping: 'pathname',
    strict: '0',
    inputPosition: 'top',
    reactionsEnabled: '1',
  },

  // ── Resource Hints (preconnect) ──────────────────────────────

  resourceHints: [
    { origin: 'https://cdn.jsdelivr.net', crossorigin: false },          // 이미지 CDN + KaTeX
    { origin: 'https://www.googletagmanager.com', crossorigin: false },  // GTM
  ],

  // ── Posts ──────────────────────────────────────────────

  postsPerPage: 8,

  // ── PWA ──────────────────────────────────────────────────

  pwa: {
    enabled: true,
  },

} as const;

export interface SiteLocaleMeta {
  title: string;
  description: string;
}

export function getSiteMeta(lang?: string): SiteLocaleMeta {
  const entry = getLocaleEntry(lang);
  return {
    title: SITE.title,
    description: entry.description,
  };
}
