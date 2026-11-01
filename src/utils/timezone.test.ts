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

  it('applies daylight saving time offsets for the requested date', () => {
    expect(
      getTimezoneOffsetMs('America/New_York', new Date('2026-01-15T12:00:00Z')),
    ).toBe(-5 * 60 * 60 * 1000);
    expect(
      getTimezoneOffsetMs('America/New_York', new Date('2026-07-15T12:00:00Z')),
    ).toBe(-4 * 60 * 60 * 1000);
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

  it('treats date-only input as midnight in the given timezone', () => {
    expect(parseDateWithTimezone('2026-01-01', 'Asia/Seoul').toISOString()).toBe(
      '2025-12-31T15:00:00.000Z',
    );
  });

  it('resolves offset-less timestamps in the timezone offset for that date', () => {
    expect(parseDateWithTimezone('2026-01-15 12:00:00', 'America/New_York').toISOString()).toBe(
      '2026-01-15T17:00:00.000Z',
    );
    expect(parseDateWithTimezone('2026-07-15 12:00:00', 'America/New_York').toISOString()).toBe(
      '2026-07-15T16:00:00.000Z',
    );
  });
});
