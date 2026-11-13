// Generates tiny inline LQIP placeholders for persona avatars.
//
// Why: avatars are cross-origin CDN images served through the SW's
// runtime cache. On a cold SW start the cache round-trip can take
// ~200ms, so the placeholder circle is painted first and the avatar
// "pops" in afterwards on every reload. Inlining a ~20px webp data URI
// as the initial `src` makes the placeholder itself a (blurry) image
// that paints with the first frame, removing the race entirely.
// The real URL is swapped in on the same element (blur-up, as used by
// Medium / Next.js blurDataURL / Hugo inline LQIP).
//
// Output: src/generated/avatar-lqip.json ({ urls, sources })
// The map is committed, so builds work offline; the script re-fetches
// only when the avatar list changes. A missing or stale entry simply
// falls back to the direct src in the component.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'src', 'generated', 'avatar-lqip.json');
const SITE_SETTINGS = path.join(ROOT, 'src', 'settings', 'site.settings.ts');
const PERSONA_SETTINGS = path.join(ROOT, 'src', 'settings', 'personas.settings.ts');

async function extract(regex, file) {
  const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  const content = await readFile(file, 'utf8');
  return [...content.matchAll(globalRegex)].map((m) => m[1]);
}

async function fetchTinyDataUri(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const tiny = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(20, 20, { fit: 'cover' })
    .webp({ quality: 35 })
    .toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function main() {
  const [baseUrl] = await extract(/imageBaseUrl:\s*'([^']+)'/, SITE_SETTINGS);
  const avatarPaths = await extract(/avatar:\s*'([^']+)'/, PERSONA_SETTINGS);
  if (!baseUrl || avatarPaths.length === 0) {
    throw new Error('Failed to read avatar paths / CDN base url from settings');
  }
  const urls = avatarPaths.map((p) => `${baseUrl.replace(/\/$/, '')}/${p.replace(/^\//, '')}`);

  let existing = { urls: [], sources: {} };
  try {
    existing = JSON.parse(await readFile(OUTPUT, 'utf8'));
  } catch {
    // first run
  }

  const sources = {};
  let fetched = 0;
  for (const url of urls) {
    try {
      sources[url] = await fetchTinyDataUri(url);
      fetched++;
    } catch (err) {
      // Offline / CDN hiccup: keep the previous placeholder if we have one.
      if (existing.sources?.[url]) {
        sources[url] = existing.sources[url];
        console.warn(`avatar-lqip: fetch failed for ${url}, kept existing (${err.message})`);
      } else {
        console.warn(`avatar-lqip: fetch failed for ${url} — omitted, component falls back to direct src (${err.message})`);
      }
    }
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify({ urls, sources }, null, 2)}\n`);
  console.log(`avatar-lqip: wrote ${fetched}/${urls.length} placeholders`);
}

main().catch((err) => {
  console.error('avatar-lqip failed:', err);
  // Never break the build: a missing/stale map degrades gracefully.
  process.exit(0);
});
