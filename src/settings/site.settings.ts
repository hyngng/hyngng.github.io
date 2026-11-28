// ┌──────────────────────┐
// │  Site Configuration  │
// └──────────────────────┘

import fs from 'node:fs';
import { getFrontmatterLang } from '../utils/frontmatter-lang';
import { deriveLocaleMeta, normalizeLang, type LocaleMeta } from '../utils/lang';
import { listPostFiles } from '../utils/postFiles';

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
  for (const post of listPostFiles()) {
    try {
      const raw = fs.readFileSync(post.fullPath, 'utf8');
      const lang = getFrontmatterLang(raw);
      if (lang !== undefined) {
        const normalized = normalizeLang(lang);
        if (normalized) {
          set.add(normalized);
        } else {
          console.warn(`[scanPostLangValues] 지원하지 않는 lang 값 무시: "${lang}" (${post.relativePath})`);
        }
      }
    } catch (err) {
      console.warn(`[scanPostLangValues] frontmatter 읽기/파싱 실패, 건너뜀: ${post.relativePath}`, err);
    }
  }
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

  title: 'Vignette',
  themeName: 'Vignette',
  description: 'A minimal, typography-focused blog theme built with Astro.',
  username: '' as string,
  url: 'https://example.com',

  cdn: {
    // Leave empty to serve images from this site. Set a base URL to use a CDN.
    imageBaseUrl: '',
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
    fediverse: '' as string,
  },

  // ── Webmaster Tools Verifications ────────────────────────────────────

  verification: {
    google: undefined,
    yandex: undefined,
    baidu: undefined,
    pinterest: undefined,
    daum: undefined,
  },

  // ── Web Analytics Settings ───────────────────────────────────────────

  analytics: {
    google: { id: '' as string },          // 'G-XXXXXXX' (Google Analytics 4)
    googleTagManager: { id: '' as string }, // 'GTM-XXXXXXX'
    goatcounter: { id: '' as string },     // 'your-code'
    adsense: { client: '' as string, adSlot: '' as string },
  },

  // ── Giscus ───────────────────────────────────────────────

  giscus: {
    // Fill these in to enable comments. See https://giscus.app.
    repo: '' as string,
    repoId: '' as string,
    category: '' as string,
    categoryId: '' as string,
    mapping: 'pathname',
    strict: '0',
    inputPosition: 'top',
    reactionsEnabled: '1',
  },

  // ── Resource Hints (preconnect) ──────────────────────────────

  // Origins to preconnect to, e.g. an image CDN or analytics host.
  resourceHints: [] as { origin: string; crossorigin?: boolean }[],

  // ── Posts ──────────────────────────────────────────────

  postsPerPage: 8,

  // ── PWA ──────────────────────────────────────────────────

  pwa: {
    enabled: true,
  },

  // ── LLMS ─────────────────────────────────────────────────

  llms: {
    locale: 'ko-KR',
  },

} as const;
