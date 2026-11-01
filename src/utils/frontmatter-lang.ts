// Extraction of a post's `lang` from its frontmatter. The content collection
// schema validates the same YAML, and both paths run normalizeLang so the
// config-time scan and the schema agree on one canonical form. Parsing errors
// are not swallowed here — callers own error handling so each can emit a
// context-appropriate message.
import yaml from 'js-yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.replace(/^\uFEFF/, '').match(FRONTMATTER);
  if (!match) return {};
  const data = yaml.load(match[1]);
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
}

export function getFrontmatterLang(raw: string): string | undefined {
  const data = parseFrontmatter(raw);
  return typeof data.lang === 'string' ? data.lang : undefined;
}

export function getFrontmatterPersona(raw: string): string {
  const data = parseFrontmatter(raw);
  const rawPersonas = data.personas;
  if (Array.isArray(rawPersonas) && rawPersonas.length > 0 && typeof rawPersonas[0] === 'string' && rawPersonas[0].trim()) {
    return rawPersonas[0].trim();
  }
  if (typeof rawPersonas === 'string' && rawPersonas.trim()) {
    return rawPersonas.trim();
  }
  return 'dev';
}
