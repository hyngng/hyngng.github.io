import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { listPostFiles } from './postFiles';
import { getFrontmatterLang, getFrontmatterPersona } from './frontmatter-lang';

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

describe('frontmatter-lang & persona extraction', () => {
  it('extracts lang from frontmatter', () => {
    const raw = `---
title: Test
lang: ko-KR
---
Content`;
    expect(getFrontmatterLang(raw)).toBe('ko-KR');
  });

  it('extracts primary persona from personas array', () => {
    const raw = `---
title: Test
personas: [blog, dev]
---
Content`;
    expect(getFrontmatterPersona(raw)).toBe('blog');
  });

  it('extracts primary persona from single personas string', () => {
    const raw = `---
title: Test
personas: essay
---
Content`;
    expect(getFrontmatterPersona(raw)).toBe('essay');
  });

  it('falls back to dev when persona is omitted', () => {
    const raw = `---
title: Test
---
Content`;
    expect(getFrontmatterPersona(raw)).toBe('dev');
  });
});
