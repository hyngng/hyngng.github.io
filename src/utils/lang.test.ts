import { describe, it, expect } from 'vitest';
import { normalizeLang, isValidLang, deriveLocaleMeta } from './lang';

describe('normalizeLang', () => {
  it('canonicalizes a regional BCP 47 code', () => {
    expect(normalizeLang('ko-KR')).toBe('ko-KR');
    expect(normalizeLang('en-US')).toBe('en-US');
    expect(normalizeLang('zh-CN')).toBe('zh-CN');
  });

  it('is case-insensitive and returns the canonical (capitalized) form', () => {
    expect(normalizeLang('En-US')).toBe('en-US');
    expect(normalizeLang('EN')).toBe('en-US');
    expect(normalizeLang('ZH-cn')).toBe('zh-CN');
  });

  it('supplies a region via CLDR likely-subtags for bare language codes', () => {
    expect(normalizeLang('zh')).toBe('zh-CN');
    expect(normalizeLang('ko')).toBe('ko-KR');
    // Traditional Chinese resolves to the Taiwan region.
    expect(normalizeLang('zh-Hant')).toBe('zh-TW');
  });

  it('returns null for invalid input', () => {
    expect(normalizeLang('')).toBeNull();
    expect(normalizeLang('k')).toBeNull();
  });
});

describe('isValidLang', () => {
  it('mirrors normalizeLang truthiness', () => {
    expect(isValidLang('en-US')).toBe(true);
  });
});

describe('deriveLocaleMeta', () => {
  it('derives og:locale and region from the code', () => {
    expect(deriveLocaleMeta('en-US')).toMatchObject({ bcp47: 'en-US', language: 'en', region: 'US', ogLocale: 'en_US' });
    expect(deriveLocaleMeta('zh-CN')).toMatchObject({ bcp47: 'zh-CN', language: 'zh', region: 'CN', ogLocale: 'zh_CN' });
  });

  it('emits og:locale in Open Graph form (lower_language_UPPER_region)', () => {
    expect(deriveLocaleMeta('en-US').ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    expect(deriveLocaleMeta('zh-CN').ogLocale).toBe('zh_CN');
  });
});
