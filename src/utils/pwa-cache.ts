// Chirpy-style PWA cache versioning.
//
// Cache names are stamped with the build time so cached pages and images can
// never go stale across deployments: a fresh service worker reads from a
// fresh cache and wipes every cache left by the previous build on activation
// (see astro-pwa.ts). The stamp is evaluated once per process at import
// time, and the same module instance is shared by astro.config.mjs (cache
// names) and astro-pwa.ts (activate cleanup), so both sides always agree on
// the current stamp.

const stamp = Date.now().toString(36);

/** Root of every PWA cache name; the activate cleanup matches on this. */
export const pwaCacheRoot = 'hyngng-';

/** Build-time stamp identifying the current cache namespace. */
export const pwaCacheStamp = stamp;

/** Prefix for the current build's cache names: `<root><stamp>`. */
export const pwaCachePrefix = `${pwaCacheRoot}${stamp}`;
