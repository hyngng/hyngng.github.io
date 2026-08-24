// Robust extraction of a post's `lang` from its frontmatter, without fully
// parsing YAML. Matches how Astro locates the frontmatter block (a `---` line
// on its own, then a closing `---` line), so it stays consistent with the
// content collection loader even when a file's frontmatter is unusual.
const LANG_RE = /^\s*lang\s*:\s*['"]?([A-Za-z-]+)/;

export function getFrontmatterLang(raw: string): string | undefined {
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const lines = text.split(/\r?\n/);

  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') { start = i; break; }
  }
  if (start < 0) return undefined;

  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end < 0) return undefined;

  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(LANG_RE);
    if (m) return m[1].toLowerCase();
  }
  return undefined;
}
