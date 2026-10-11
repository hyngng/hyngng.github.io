import type { CollectionEntry } from 'astro:content';
import { ALL_PERSONAS, getPersona, type PersonaId } from '../settings/personas.settings';
import {
  SITE,
  defaultLocaleBcp47,
  supportedLocales,
} from '../settings/site.settings';
import { getSiteMeta } from './pageContext';
import { getPostLang, getPostPath, getPersonaPath, extractExcerpt } from './posts';

export const LLMS_LOCALE = SITE.llms.locale;
export const LLMS_MAX_POSTS_PER_PERSONA = 10;
export const LLMS_DESCRIPTION_MAX_LENGTH = 155;

interface LlmsTxtInput {
  origin: string;
  posts: CollectionEntry<'posts'>[];
}

interface LlmsPost {
  title: string;
  url: string;
  description: string;
}

interface LlmsPersona {
  name: string;
  url: string;
  description: string;
}

interface LlmsPersonaSection {
  name: string;
  posts: LlmsPost[];
}

interface LlmsDoc {
  title: string;
  description: string;
  defaultLanguage: string;
  availableLocales: string[];
  personas: LlmsPersona[];
  personaSections: LlmsPersonaSection[];
}

// Pure data assembly. `locale` is the single source of truth for every URL so
// the LLMS document (written in `LLMS_LOCALE`) never emits links to a
// different locale's path.
export function buildLlmsData({ origin, posts }: LlmsTxtInput): LlmsDoc {
  const locale = LLMS_LOCALE;
  const siteMeta = getSiteMeta(locale);

  const published = posts.filter(
    (post) => !post.data.draft && getPostLang(post) === locale,
  );

  const byDateDesc = [...published].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const postsByPersona = new Map<PersonaId, CollectionEntry<'posts'>[]>();
  for (const post of byDateDesc) {
    const id = post.data.personas[0] as PersonaId;
    const list = postsByPersona.get(id);
    if (list) list.push(post);
    else postsByPersona.set(id, [post]);
  }

  const personas: LlmsPersona[] = ALL_PERSONAS.map((persona) => {
    const meta = getPersona(persona.name, locale);
    return {
      name: persona.name,
      url: `${origin}${getPersonaPath(persona.name, locale)}`,
      description: meta.description,
    };
  });

  const personaSections: LlmsPersonaSection[] = ALL_PERSONAS.map((persona) => ({
    name: persona.name,
    posts: (postsByPersona.get(persona.name as PersonaId) ?? [])
      .slice(0, LLMS_MAX_POSTS_PER_PERSONA)
      .map((post) => ({
        title: post.data.title,
        url: `${origin}${getPostPath(post.id, post.data.personas[0] as PersonaId, locale)}`,
        description:
          post.data.description ||
          extractExcerpt(undefined, post.body, LLMS_DESCRIPTION_MAX_LENGTH, '...'),
      })),
  })).filter((section) => section.posts.length > 0);

  return {
    title: SITE.title,
    description: siteMeta.description,
    defaultLanguage: defaultLocaleBcp47,
    availableLocales: supportedLocales,
    personas,
    personaSections,
  };
}

// Pure markdown rendering — no locale/URL logic.
function renderLlmsTxt(doc: LlmsDoc, origin: string): string {
  const lines: string[] = [];

  lines.push(`# ${doc.title}`);
  lines.push('');
  lines.push(`> ${doc.description}`);
  lines.push('');
  lines.push(
    `Default language: ${doc.defaultLanguage}. ` +
      `This document is written in English for LLM accessibility. ` +
      `Available locales: ${doc.availableLocales.join(', ')}.`,
  );
  lines.push('');
  lines.push('## Sections');
  lines.push('');
  lines.push(`- [Home](${origin}/)`);
  lines.push(`- [RSS](${origin}/rss.xml)`);
  lines.push('');
  lines.push('## Personas');
  lines.push('');

  for (const persona of doc.personas) {
    lines.push(`- [${persona.name}](${persona.url}): ${persona.description}`);
  }

  for (const section of doc.personaSections) {
    lines.push('');
    lines.push(`### ${section.name}`);
    lines.push('');
    for (const post of section.posts) {
      lines.push(`- [${post.title}](${post.url}): ${post.description}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function buildLlmsTxt(input: LlmsTxtInput): string {
  return renderLlmsTxt(buildLlmsData(input), input.origin);
}
