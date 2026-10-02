import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { listPostFiles } from './postFiles';
import { getFrontmatterLang, getFrontmatterAuthor } from './frontmatter-lang';

describe('listPostFiles', () => {
  it('returns valid post metadata for existing posts directory', () => {
    const posts = listPostFiles();
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.fullPath).toBeDefined();
      expect(post.relativePath).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.slug.length).toBeGreaterThan(0);
      expect(post.slug).not.toMatch(/^\d{4}-\d{2}-\d{2}-/);
      expect(post.slug).not.toMatch(/\.(md|mdx)$/);
      expect(post.relativePath).not.toContain('\\');
    }
  });

  it('returns empty array if directory does not exist', () => {
    const nonExistentDir = path.resolve('posts-does-not-exist');
    const posts = listPostFiles(nonExistentDir);
    expect(posts).toEqual([]);
  });
});

describe('frontmatter-lang & author extraction', () => {
  it('extracts lang from frontmatter', () => {
    const raw = `---
title: Test
lang: ko-KR
---
Content`;
    expect(getFrontmatterLang(raw)).toBe('ko-KR');
  });

  it('extracts primary author from authors array', () => {
    const raw = `---
title: Test
authors: [blog, dev]
---
Content`;
    expect(getFrontmatterAuthor(raw)).toBe('blog');
  });

  it('extracts primary author from single authors string', () => {
    const raw = `---
title: Test
authors: essay
---
Content`;
    expect(getFrontmatterAuthor(raw)).toBe('essay');
  });

  it('falls back to dev when author is omitted', () => {
    const raw = `---
title: Test
---
Content`;
    expect(getFrontmatterAuthor(raw)).toBe('dev');
  });
});
