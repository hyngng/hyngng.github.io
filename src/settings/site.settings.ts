// ┌──────────────────────┐
// │  Site Configuration  │
// └──────────────────────┘

import fs from 'node:fs';
import path from 'node:path';
import { getFrontmatterLang } from '../utils/frontmatter-lang';
import { deriveLocaleMeta, normalizeLang, type LocaleMeta } from '../utils/lang';

// ── Locale (content-driven) ────────────────────
// A post's language is its frontmatter `lang`, which is the full BCP 47 code
// (e.g. "ko-KR", "zh-CN"). That code IS the source of truth for bcp47/region,
// so no central registry is needed. The set of supported languages is derived
// from the posts themselves: any `lang` present in a post makes that language
// naturally supported — no central list to maintain. Structural fields
// (bcp47/og:locale/region) are derived from the code via CLDR likely-subtags
// (Intl.Locale().maximize()), which is locale-agnostic and future-proof.
// Canonical normalization lives in `../utils/lang` (normalizeLang) so the
// config-time scan and the content collection schema agree on one form.

export type LocaleCode = string;

export const defaultLocale: LocaleCode = 'ko-KR';

// Supported languages = default locale ∪ every valid `lang` found in posts.
// Scanned once at module load (build/dev/config time) from the posts
// directory. Uses normalizeLang() so the canonical BCP 47 here matches
// exactly what the content collection schema produces.
function scanPostLangValues(): Set<string> {
  const set = new Set<string>([defaultLocale]);
  const postsDir = path.resolve('posts');
  if (!fs.existsSync(postsDir)) return set;
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.(md|mdx)$/i.test(entry.name)) continue;
      try {
        const raw = fs.readFileSync(full, 'utf8');
        const lang = getFrontmatterLang(raw);
        if (lang !== undefined) {
          const normalized = normalizeLang(lang);
          if (normalized) {
            set.add(normalized);
          } else {
            console.warn(`[scanPostLangValues] 지원하지 않는 lang 값 무시: "${lang}" (${path.relative(process.cwd(), full)})`);
          }
        }
      } catch (err) {
        console.warn(`[scanPostLangValues] frontmatter 읽기/파싱 실패, 건너뜀: ${path.relative(process.cwd(), full)}`, err);
      }
    }
  };
  walk(postsDir);
  return set;
}

export const supportedLocales: string[] = [...scanPostLangValues()];

export const defaultLocaleBcp47 = deriveLocaleMeta(defaultLocale).bcp47;

const localeEntryCache = new Map<string, LocaleMeta>();
export function getLocaleEntry(lang?: string): LocaleMeta {
  const key = lang || defaultLocale;
  let entry = localeEntryCache.get(key);
  if (!entry) {
    entry = deriveLocaleMeta(key);
    localeEntryCache.set(key, entry);
  }
  return entry;
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

  // ── LLMS ─────────────────────────────────────────────────

  llms: {
    locale: 'en-US',
  },

} as const;
