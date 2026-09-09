import fs from 'node:fs';
import path from 'node:path';

export interface PostFileInfo {
  /** Absolute path to the post file. */
  fullPath: string;
  /** Path relative to the base posts directory. */
  relativePath: string;
  /** Slug extracted from filename (date prefix and extension stripped). */
  slug: string;
}

const POST_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}-(.+)\.(md|mdx)$/;

/**
 * Recursively scans the posts directory and returns metadata for all published post files.
 * Uses only node:fs and node:path so it can be safely invoked at config/build time
 * without depending on `astro:content`.
 */
export function listPostFiles(baseDir = path.resolve('posts')): PostFileInfo[] {
  if (!fs.existsSync(baseDir)) return [];

  const results: PostFileInfo[] = [];

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const match = entry.name.match(POST_FILE_PATTERN);
      if (!match) continue;

      results.push({
        fullPath,
        relativePath: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
        slug: match[1],
      });
    }
  }

  walk(baseDir);
  return results;
}
