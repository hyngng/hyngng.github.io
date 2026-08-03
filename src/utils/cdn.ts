import { SITE } from '../settings/site.settings';

const cdnImageBaseUrl = SITE.cdn.imageBaseUrl.replace(/\/$/, '');

export function isLocalAbsolutePath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

export function toAbsoluteImageUrl(val?: string): string | undefined {
  if (!val) return undefined;
  return isLocalAbsolutePath(val) ? `${cdnImageBaseUrl}${val}` : val;
}

export function resolveCdnPath(path?: string): string {
  if (!path || !path.trim()) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return cdnImageBaseUrl + (path.startsWith('/') ? '' : '/') + path;
}
