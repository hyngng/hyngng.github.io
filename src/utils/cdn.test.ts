import { describe, it, expect } from 'vitest';
import { isLocalAbsolutePath, resolveCdnPath, toAbsoluteImageUrl } from './cdn';

const BASE = 'https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master';

describe('isLocalAbsolutePath', () => {
  it('accepts root-relative paths', () => {
    expect(isLocalAbsolutePath('/2026-01-01/foo.webp')).toBe(true);
  });

  it('rejects protocol-relative URLs', () => {
    expect(isLocalAbsolutePath('//cdn.example.com/foo.webp')).toBe(false);
  });

  it('rejects bare and relative paths', () => {
    expect(isLocalAbsolutePath('foo.webp')).toBe(false);
    expect(isLocalAbsolutePath('../foo.webp')).toBe(false);
    expect(isLocalAbsolutePath('')).toBe(false);
  });
});

describe('toAbsoluteImageUrl', () => {
  it('resolves absolute paths against the CDN base', () => {
    expect(toAbsoluteImageUrl('/2026-01-01/foo.webp')).toBe(`${BASE}/2026-01-01/foo.webp`);
  });

  it('passes through full URLs unchanged', () => {
    expect(toAbsoluteImageUrl('https://example.com/foo.webp')).toBe('https://example.com/foo.webp');
    expect(toAbsoluteImageUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });

  it('returns undefined for empty input', () => {
    expect(toAbsoluteImageUrl()).toBeUndefined();
    expect(toAbsoluteImageUrl('')).toBeUndefined();
  });
});

describe('resolveCdnPath', () => {
  it('resolves relative paths against the CDN base', () => {
    expect(resolveCdnPath('avatar/foo.webp')).toBe(`${BASE}/avatar/foo.webp`);
  });

  it('resolves absolute paths against the CDN base', () => {
    expect(resolveCdnPath('/avatar/foo.webp')).toBe(`${BASE}/avatar/foo.webp`);
  });

  it('passes through http(s) URLs unchanged', () => {
    expect(resolveCdnPath('https://example.com/foo.webp')).toBe('https://example.com/foo.webp');
  });

  it('returns an empty string for falsy or blank input', () => {
    expect(resolveCdnPath()).toBe('');
    expect(resolveCdnPath('')).toBe('');
    expect(resolveCdnPath('   ')).toBe('');
  });
});
