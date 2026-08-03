import type { Locale } from '../locales';

export function getRelativeTime(date: Date, locale: Locale): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const t = locale.relativeTime;

  if (days === 0) return t.today;
  if (days === 1) return t.yesterday;
  if (days < 30) return t.daysAgo(days);
  if (months === 1) return t.monthAgo;
  if (months < 12) return t.monthsAgo(months);
  if (years === 1) return t.yearAgo;
  return t.yearsAgo(years);
}
