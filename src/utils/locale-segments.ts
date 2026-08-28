// URL segment mapping for locales.
//
// A locale's BCP 47 code (e.g. "zh-CN") must map to a URL path segment
// (e.g. "/zh"). This mapping MUST be injective across every locale that can
// appear in a URL — post routes and the language switcher both emit
// locale-prefixed URLs, so a segment collision means two locales silently
// share one route. A code-by-code pure function (localePath(code)) cannot
// guarantee injectivity: it only sees one code and has no knowledge of the
// other supported locales. So the segment is computed once from the FULL
// supported set, and every consumer (posts.ts URLs, astro.config i18n,
// validate-routes, Frame.astro switcher) resolves through this single map.
//
// Rule: the segment is the language subtag (e.g. "zh") when that language is
// unambiguous, but when two or more locales share a language (e.g. zh-CN and
// zh-TW) every such locale is promoted to its full lowercased code (e.g.
// "zh-cn", "zh-tw") so they stay distinct. The default locale has no prefix.

import { defaultLocale, supportedLocales } from '../settings/site.settings';

export function buildSegmentMap(
  locales: string[],
  defLocale: string,
): ReadonlyMap<string, string> {
  const byLanguage = new Map<string, string[]>();
  for (const code of locales) {
    const lang = new Intl.Locale(code).language;
    const group = byLanguage.get(lang);
    if (group) group.push(code);
    else byLanguage.set(lang, [code]);
  }

  const map = new Map<string, string>();
  for (const [, codes] of byLanguage) {
    const ambiguous = codes.length > 1;
    for (const code of codes) {
      if (code === defLocale) {
        map.set(code, '');
        continue;
      }
      map.set(code, ambiguous ? code.toLowerCase() : new Intl.Locale(code).language);
    }
  }

  // Fail loud: if two locales still resolve to the same segment, the mapping
  // is broken. Surface it at config time rather than shipping a silent
  // route collision.
  const seen = new Set<string>();
  for (const seg of map.values()) {
    if (seen.has(seg)) {
      throw new Error(`[locale-segments] URL segment collision detected: "${seg}"`);
    }
    seen.add(seg);
  }

  return map;
}

export const segmentMap: ReadonlyMap<string, string> = buildSegmentMap(
  supportedLocales,
  defaultLocale,
);

// URL prefix (with leading slash) for a locale code, or '' for the default.
// Looks the code up in the single shared segment map; falls back to the bare
// language subtag only for codes outside supportedLocales (defensive — all
// real consumers pass a supported code).
export function localePath(code?: string): string {
  const c = code || defaultLocale;
  if (c === defaultLocale) return '';
  const seg = segmentMap.get(c);
  if (seg !== undefined) return seg ? `/${seg}` : '';
  return `/${new Intl.Locale(c).language}`;
}
