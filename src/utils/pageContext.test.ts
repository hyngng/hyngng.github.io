import { describe, it, expect } from 'vitest';
import { getSiteMeta, usePageContext } from './pageContext';
import { defaultLocale, getLocale } from '../locales';
import { SITE } from '../settings/site.settings';

describe('pageContext', () => {
  describe('getSiteMeta', () => {
    it('returns SITE.title and default locale description when no lang passed', () => {
      const meta = getSiteMeta();
      expect(meta.title).toBe(SITE.title);
      expect(meta.description).toBe(getLocale(defaultLocale).description);
    });

    it('returns description for specific language', () => {
      const meta = getSiteMeta('en-US');
      expect(meta.title).toBe(SITE.title);
      expect(meta.description).toBe(getLocale('en-US').description);
    });
  });

  describe('usePageContext', () => {
    it('falls back to defaultLocale when currentLocale is missing', () => {
      const ctx = usePageContext({ currentLocale: undefined });
      expect(ctx.lang).toBe(defaultLocale);
      expect(ctx.locale).toEqual(getLocale(defaultLocale));
      expect(ctx.siteMeta).toEqual(getSiteMeta(defaultLocale));
      expect(ctx.defaultLocale).toBe(defaultLocale);
    });

    it('resolves currentLocale when provided', () => {
      const ctx = usePageContext({ currentLocale: 'en-US' });
      expect(ctx.lang).toBe('en-US');
      expect(ctx.locale).toEqual(getLocale('en-US'));
      expect(ctx.siteMeta).toEqual(getSiteMeta('en-US'));
    });

    it('prioritizes opts.lang over currentLocale', () => {
      const ctx = usePageContext({ currentLocale: 'ko-KR' }, { lang: 'en-US' });
      expect(ctx.lang).toBe('en-US');
      expect(ctx.locale).toEqual(getLocale('en-US'));
    });

    it('falls back if opts.lang is empty string', () => {
      const ctx = usePageContext({ currentLocale: undefined }, { lang: '' });
      expect(ctx.lang).toBe(defaultLocale);
    });
  });
});
