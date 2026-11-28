import { SITE } from '../settings/site.settings';

const cdnImageBaseUrl = SITE.cdn.imageBaseUrl.replace(/\/$/, '');
const siteBaseUrl = SITE.url.replace(/\/$/, '');

export function isLocalAbsolutePath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

function withCdnBase(path: string): string {
  if (!cdnImageBaseUrl) return path.startsWith('/') ? path : `/${path}`;
  return cdnImageBaseUrl + (path.startsWith('/') ? '' : '/') + path;
}

export function shouldRewriteCdnUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('//')) return false;
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) return false;
  return true;
}

export function rewriteToCdnUrl(url: string): string {
  return withCdnBase(url);
}

export function toAbsoluteImageUrl(val?: string): string | undefined {
  if (!val) return undefined;
  if (!isLocalAbsolutePath(val)) return val;
  return `${cdnImageBaseUrl || siteBaseUrl}${val}`;
}

export function resolveCdnPath(path?: string): string {
  if (!path || !path.trim()) return '';
  if (path.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(path)) return path;
  return withCdnBase(path);
}
