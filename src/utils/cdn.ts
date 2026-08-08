import { SITE } from '../settings/site.settings';

const cdnImageBaseUrl = SITE.cdn.imageBaseUrl.replace(/\/$/, '');

export function isLocalAbsolutePath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

function withCdnBase(path: string): string {
  return cdnImageBaseUrl + (path.startsWith('/') ? '' : '/') + path;
}

export function shouldRewriteCdnUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('//')) return false;
  if (/^https?:\/\//i.test(url)) return false;
  return true;
}

export function rewriteToCdnUrl(url: string): string {
  return withCdnBase(url);
}

export function toAbsoluteImageUrl(val?: string): string | undefined {
  if (!val) return undefined;
  return isLocalAbsolutePath(val) ? `${cdnImageBaseUrl}${val}` : val;
}

export function resolveCdnPath(path?: string): string {
  if (!path || !path.trim()) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return withCdnBase(path);
}
