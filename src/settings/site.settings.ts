// ┌──────────────────────┐
// │  Site Configuration  │
// └──────────────────────┘

// ── Locale Registry (Single Source of Truth) ────────────────────
// `code`는 라우팅에 쓰는 2자리 코드(`/en/`), `bcp47`은 메타데이터/매니페스트용 표준 태그.
// 언어 추가 시 `src/locales/`에 `xx-XX.ts`를 만들고 여기 레지스트리에 함께 등록.

export interface LocaleRegistryEntry {
  code: string;
  bcp47: string;
  description: string;
}

export const LOCALE_REGISTRY: LocaleRegistryEntry[] = [
  { code: 'ko', bcp47: 'ko-KR', description: '반갑습니다 🔥' },
  { code: 'en', bcp47: 'en-US', description: 'Greetings 🔥' },
  { code: 'ru', bcp47: 'ru-RU', description: 'Приветствую 🔥' },
  { code: 'fr', bcp47: 'fr-FR', description: 'Salutations 🔥' },
  { code: 'es', bcp47: 'es-ES', description: 'Saludos 🔥' },
  { code: 'ja', bcp47: 'ja-JP', description: 'こんにちは 🔥' },
  { code: 'zh', bcp47: 'zh-CN', description: '你好 🔥' },
];

export const defaultLocale = LOCALE_REGISTRY[0].code;
export const defaultLocaleBcp47 = LOCALE_REGISTRY[0].bcp47;
export const supportedLocales = LOCALE_REGISTRY.map((l) => l.code);

export function getLocaleEntry(lang?: string): LocaleRegistryEntry {
  if (lang) {
    const found = LOCALE_REGISTRY.find((l) => l.code === lang || l.bcp47 === lang);
    if (found) return found;
  }
  return LOCALE_REGISTRY[0];
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
    github: '',
    twitter: '' as string,
    fediverse: '@hyngng.main@threads.net',
    pinterest: undefined,
  },

  // ── Webmaster Tools Verifications ────────────────────────────────────

  verification: {
    google: undefined,
    yandex: undefined,
    baidu: undefined,
    pinterest: '150084dfff2fed3d81028aea5d976b18',
    naver: undefined,
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
