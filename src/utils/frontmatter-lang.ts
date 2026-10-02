// Extraction of a post's `lang` from its frontmatter, reusing the same YAML
// parser Astro's content layer uses (gray-matter) so this config-time scan and
// the content collection schema can never disagree on what `lang` is. Both
// paths then run normalizeLang, guaranteeing one canonical form. Parsing errors
// are not swallowed here — callers (scanPostLangValues, validate-routes) own
// error handling so each can emit a context-appropriate message.
import matter from 'gray-matter';

export function getFrontmatterLang(raw: string): string | undefined {
  const { data } = matter(raw);
  return typeof data.lang === 'string' ? data.lang : undefined;
}

export function getFrontmatterAuthor(raw: string): string {
  const { data } = matter(raw);
  const rawAuthors = data.authors;
  if (Array.isArray(rawAuthors) && rawAuthors.length > 0 && typeof rawAuthors[0] === 'string' && rawAuthors[0].trim()) {
    return rawAuthors[0].trim();
  }
  if (typeof rawAuthors === 'string' && rawAuthors.trim()) {
    return rawAuthors.trim();
  }
  return 'dev';
}
