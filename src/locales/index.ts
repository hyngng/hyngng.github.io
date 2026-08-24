import type { AstroGlobal } from 'astro';
import koKR from './ko-KR';
import enUS from './en-US';
import ruRU from './ru-RU';
import frFR from './fr-FR';
import esES from './es-ES';
import jaJP from './ja-JP';
import zhCN from './zh-CN';
import { supportedLocales, defaultLocale } from '../settings/site.settings';

export interface Locale {
  frame: {
    lang: string;
    langAria: string;
    themeAria: string;
    rssAria: string;
  };
  authors: {
    title: string;
    otherCount: (n: number) => string;
    postCount: (n: number) => string;
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

const locales: Record<string, Locale> = {
  ko: koKR,
  en: enUS,
  ru: ruRU,
  fr: frFR,
  es: esES,
  ja: jaJP,
  zh: zhCN,
};

export { defaultLocale } from '../settings/site.settings';
export { supportedLocales } from '../settings/site.settings';

export const availableLocales = supportedLocales.map((code) => ({
  code,
  label: locales[code]?.frame.lang ?? code,
}));

export function getLocale(lang?: string): Locale {
  if (lang && lang in locales) return locales[lang];
  return locales[defaultLocale];
}

export function useLocale(Astro: AstroGlobal): Locale {
  return getLocale(Astro.currentLocale);
}

export { koKR, enUS, ruRU, frFR, esES, jaJP, zhCN };
