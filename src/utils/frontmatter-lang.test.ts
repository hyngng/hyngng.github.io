import { describe, expect, it } from 'vitest';
import { getFrontmatterLang, getFrontmatterPersona } from './frontmatter-lang';

describe('frontmatter extraction', () => {
  it('reads a language from frontmatter, including a BOM', () => {
    const raw = '\uFEFF---\nlang: ko-KR\npersonas:\n  - hyngng\n---\nbody';
    expect(getFrontmatterLang(raw)).toBe('ko-KR');
  });

  it('returns undefined when frontmatter or lang is absent', () => {
    expect(getFrontmatterLang('body only')).toBeUndefined();
    expect(getFrontmatterLang('---\ntitle: Post\n---\nbody')).toBeUndefined();
  });

  it('reads the first persona and falls back to dev', () => {
    expect(getFrontmatterPersona('---\npersonas:\n  - hyngng\n  - guest\n---')).toBe('hyngng');
    expect(getFrontmatterPersona('---\npersonas: guest\n---')).toBe('guest');
    expect(getFrontmatterPersona('---\ntitle: Post\n---')).toBe('dev');
  });
});
