export function getTimezoneOffsetMs(timezone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const values: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = Number(part.value);
  }

  const wallClockAsUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );
  const wholeSecond = Math.floor(date.getTime() / 1000) * 1000;
  return wallClockAsUtc - wholeSecond;
}

const NAIVE_DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/;

export function parseDateWithTimezone(raw: string, timezone: string): Date {
  const trimmed = raw.trim();
  if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  const match = trimmed.match(NAIVE_DATE);
  if (!match) {
    return new Date(trimmed);
  }

  const [, year, month, day, hour = '0', minute = '0', second = '0', fraction = '0'] = match;
  const milliseconds = Number(fraction.padEnd(3, '0'));
  const localAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    milliseconds,
  );

  let offsetMs = getTimezoneOffsetMs(timezone, new Date(localAsUtc));
  let result = new Date(localAsUtc - offsetMs);

  const resolvedOffsetMs = getTimezoneOffsetMs(timezone, result);
  if (resolvedOffsetMs !== offsetMs) {
    offsetMs = resolvedOffsetMs;
    result = new Date(localAsUtc - offsetMs);
  }

  return result;
}
