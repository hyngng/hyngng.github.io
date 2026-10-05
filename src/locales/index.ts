import type { AstroGlobal } from 'astro';
import { supportedLocales, defaultLocale } from '../settings/site.settings';
import { normalizeLang } from '../utils/lang';

export interface Locale {
  description: string;
  frame: {
    lang: string;
    langAria: string;
    themeAria: string;
    rssAria: string;
  };
  authors: {
    persona: string;
    otherPersona: string;
    otherCount: (n: number) => string;
    personaCount: (n: number) => string;
    otherPersonaCount: (n: number) => string;
    closeAria: string;
  };
  posts: {
    title: string;
    empty: string;
    postNumber: (n: number) => string;
    notUpdated: string;
    loadMoreCount: (n: number) => string;
    loadMoreSub: (total: number, remaining: number) => string;
    loadMoreHover: (title: string, n: number) => string;
    chunkPrev: string;
    chunkHome: string;
  };
  relativeTime: {
    today: string;
    yesterday: string;
    daysAgo: (n: number) => string;
    monthAgo: string;
    monthsAgo: (n: number) => string;
    yearAgo: string;
    yearsAgo: (n: number) => string;
  };
  toc: {
    title: string;
    aria: string;
  };
  morePosts: {
    title: string;
    aria: string;
  };
  footnote: {
    label: string;
    close: string;
  };
  footer: {
    rights: string;
    poweredBy: (theme: string) => string;
  };
  postFooter: {
    license: string;
    publishDate: string;
    lastUpdate: string;
    characterCount: string;
    characterUnit: string;
    dateLocale: string;
  };
  search: {
    title: string;
    placeholder: string;
    empty: string;
    aria: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  redirect: {
    fallbackLink: string;
  };
}

const localeModules = import.meta.glob<{ default: Locale }>('./*-*.ts', { eager: true });
const locales: Record<string, Locale> = {};
for (const [path, module] of Object.entries(localeModules)) {
  const filename = path.match(/^\.\/([^/]+)\.ts$/)?.[1];
  const code = filename && normalizeLang(filename);
  if (!code) continue;
  if (locales[code]) throw new Error(`[locales] Duplicate UI locale module for "${code}"`);
  locales[code] = module.default;
}
if (!locales[defaultLocale]) {
  throw new Error(`[locales] Missing default UI locale module for "${defaultLocale}"`);
}

export { defaultLocale } from '../settings/site.settings';
export { supportedLocales } from '../settings/site.settings';

export const availableLocales = supportedLocales.map((code) => ({
  code,
  label: locales[code]?.frame.lang ?? code,
}));

export function getLocale(lang?: string): Locale {
  const code = lang && normalizeLang(lang);
  if (code && locales[code]) return locales[code];
  return locales[defaultLocale];
}

export function useLocale(Astro: AstroGlobal): Locale {
  return getLocale(Astro.currentLocale);
}
