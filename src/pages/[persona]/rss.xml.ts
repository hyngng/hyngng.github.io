import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems } from '../../utils/posts';
import { ALL_PERSONAS, getPersona } from '../../settings/personas.settings';
import { defaultLocale } from '../../locales';

export async function getStaticPaths() {
  return ALL_PERSONAS.map((persona) => ({
    params: { persona: persona.name },
    props: { persona },
  }));
}

export async function GET(context: APIContext) {
  const origin = new URL(context.request.url).origin;
  const { persona } = context.props;
  const resolved = getPersona(persona.name, defaultLocale);
  const items = await getRssItems({ lang: defaultLocale, personaId: persona.name });

  return rss({
    title: `${persona.name} RSS`,
    description: resolved.description,
    site: origin,
    items,
  });
}
