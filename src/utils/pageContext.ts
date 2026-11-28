import type { AstroGlobal } from 'astro';
import { getLocale, defaultLocale, type Locale } from '../locales';
import { SITE } from '../settings/site.settings';

export interface SiteLocaleMeta {
  title: string;
  description: string;
}

export function getSiteMeta(lang?: string): SiteLocaleMeta {
  return { title: SITE.title, description: getLocale(lang).description };
}

export interface PageContextOptions {
  lang?: string;
}

export interface PageContext {
  lang: string;
  locale: Locale;
  siteMeta: SiteLocaleMeta;
  defaultLocale: string;
}

export { defaultLocale } from '../locales';

/**
 * Facade helper for page layouts to resolve language, locale strings,
 * and site metadata in a single step.
 */
export function usePageContext(
  astro: Pick<AstroGlobal, 'currentLocale'>,
  opts?: PageContextOptions,
): PageContext {
  const lang = opts?.lang || astro.currentLocale || defaultLocale;
  const locale = getLocale(lang);
  const siteMeta = getSiteMeta(lang);
  return { lang, locale, siteMeta, defaultLocale };
}
