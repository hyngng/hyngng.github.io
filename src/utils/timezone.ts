export function getTimezoneOffsetMs(timezone: string, date: Date): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezone });
  return new Date(tzStr).getTime() - new Date(utcStr).getTime();
}

export function parseDateWithTimezone(raw: string, timezone: string): Date {
  if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(raw.trim())) {
    return new Date(raw);
  }
  const date = new Date(raw);
  const offsetMs = getTimezoneOffsetMs(timezone, date);
  return new Date(date.getTime() - offsetMs);
}
