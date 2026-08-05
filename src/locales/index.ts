import type { AstroGlobal } from 'astro';
import koKR from './ko-KR';
import enUS from './en-US';
import ruRU from './ru-RU';
import frFR from './fr-FR';
import esES from './es-ES';
import jaJP from './ja-JP';
import zhCN from './zh-CN';
import { LOCALE_REGISTRY } from '../settings/site.settings';

export interface Locale {
  meta: {
    bcp47: string;
    ogLocale: string;
  };
  frame: {
    lang: string;
    langAria: string;
    themeAria: string;
    rssAria: string;
  };
  authors: {
    title: string;
    otherCount: (n: number) => string;
    toggleAria: string;
    postCount: (n: number) => string;
  };
  posts: {
    title: string;
    count: (n: number) => string;
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
}

const locales: Record<string, Locale> = {
  'ko': koKR,
  'en': enUS,
  'ru': ruRU,
  'fr': frFR,
  'es': esES,
  'ja': jaJP,
  'zh': zhCN,
};

export const defaultLocale = LOCALE_REGISTRY[0].code;

export const availableLocales = LOCALE_REGISTRY.map((entry) => ({
  code: entry.code,
  label: locales[entry.code]?.frame.lang ?? entry.code,
}));

export function getLocale(lang?: string): Locale {
  return locales[lang || defaultLocale] || locales[defaultLocale];
}

export function useLocale(Astro: AstroGlobal): Locale {
  return getLocale(Astro.currentLocale);
}

export { koKR, enUS, ruRU, frFR, esES, jaJP, zhCN };
