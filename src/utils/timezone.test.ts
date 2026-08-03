import { describe, it, expect } from 'vitest';
import { getTimezoneOffsetMs, parseDateWithTimezone } from './timezone';

describe('getTimezoneOffsetMs', () => {
  it('returns the KST (+09:00) offset for a sample date', () => {
    expect(getTimezoneOffsetMs('Asia/Seoul', new Date('2026-01-01T00:00:00Z'))).toBe(
      9 * 60 * 60 * 1000,
    );
  });

  it('returns 0 for UTC', () => {
    expect(getTimezoneOffsetMs('UTC', new Date('2026-07-01T00:00:00Z'))).toBe(0);
  });
});

describe('parseDateWithTimezone', () => {
  it('passes through explicit-offset timestamps unchanged', () => {
    expect(parseDateWithTimezone('2026-01-01 12:00:00 +0900', 'Asia/Seoul').toISOString()).toBe(
      '2026-01-01T03:00:00.000Z',
    );
  });

  it('passes through ISO Z timestamps unchanged', () => {
    expect(parseDateWithTimezone('2026-01-01T00:00:00Z', 'Asia/Seoul').toISOString()).toBe(
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('treats offset-less timestamps as being in the given timezone', () => {
    expect(parseDateWithTimezone('2026-01-01 00:00:00', 'Asia/Seoul').toISOString()).toBe(
      '2025-12-31T15:00:00.000Z',
    );
  });
});
