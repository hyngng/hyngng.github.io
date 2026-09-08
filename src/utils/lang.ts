// Single source of truth for locale-code normalization.
//
// A post's language is its frontmatter `lang`, a full BCP 47 code (e.g.
// "ko-KR", "zh-CN"). This module owns both the structural derivation
// (bcp47/og:locale/region via CLDR likely-subtags) and the canonical
// normalization used everywhere a raw lang string is ingested — the
// filesystem scan (config time), the content collection schema (content
// time), and route validation. Keeping it in one place prevents the scan
// and the collection from drifting into incompatible canonical forms.

export interface LocaleMeta {
  code: string;
  bcp47: string;
  language: string;
  region: string;
  ogLocale: string;
}

// Derive structural locale fields from a BCP 47 code via CLDR
// likely-subtags. e.g. "zh" -> { bcp47: "zh-CN", ogLocale: "zh_CN" },
// "ko" -> "ko-KR" (ogLocale "ko_KR"). maximize() always resolves a region (e.g. "jbo" ->
// "jbo-001"), so ogLocale joins language_region with "_".
export function deriveLocaleMeta(code: string): LocaleMeta {
  const m = new Intl.Locale(code).maximize();
  const region = m.region ?? '';
  const bcp47 = m.language + (region ? `-${region}` : '');
  const ogLocale = `${m.language}_${region}`;
  return { code, bcp47, language: m.language, region, ogLocale };
}

// Canonicalize a raw lang string to BCP 47, or null if it is not a valid
// language tag. BCP 47 validity is delegated entirely to Intl.Locale (which
// throws RangeError on malformed input); the regex pre-filter is intentionally
// absent so 3-letter language codes (fil, yue) and numeric regions (es-419)
// pass. Lowercases, then runs deriveLocaleMeta so every caller agrees on the
// canonical form (and the scan / collection never diverge on a non-canonical
// input such as "En-us" or "zh"). Never throws — malformed input yields null,
// which the schema turns into a build error.
export function normalizeLang(raw: string): string | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  try {
    return deriveLocaleMeta(v).bcp47;
  } catch (err) {
    console.warn(`[normalizeLang] BCP 47 변환 실패 (무시됨): "${raw}"`, err);
    return null;
  }
}

export function isValidLang(raw: string): boolean {
  return normalizeLang(raw) !== null;
}
