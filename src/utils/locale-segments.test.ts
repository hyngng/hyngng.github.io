import { describe, it, expect } from 'vitest';
import { buildSegmentMap } from './locale-segments';

describe('buildSegmentMap', () => {
  it('uses the bare language subtag when unambiguous', () => {
    const m = buildSegmentMap(['ko-KR', 'en-US', 'zh-CN'], 'ko-KR');
    expect(m.get('ko-KR')).toBe('');
    expect(m.get('en-US')).toBe('en');
    expect(m.get('zh-CN')).toBe('zh');
  });

  it('disambiguates locales that share a language', () => {
    const m = buildSegmentMap(['ko-KR', 'zh-CN', 'zh-TW'], 'ko-KR');
    expect(m.get('zh-CN')).toBe('zh-cn');
    expect(m.get('zh-TW')).toBe('zh-tw');
    // default still unprefixed
    expect(m.get('ko-KR')).toBe('');
  });

  it('throws on an unavoidable segment collision', () => {
    // Both resolve to language "zh"; the ambiguous promotion yields the same
    // segment "zh-cn" twice -> collision must be caught at build time.
    expect(() => buildSegmentMap(['ko-KR', 'zh-CN', 'zh-cn'], 'ko-KR')).toThrow();
  });
});
