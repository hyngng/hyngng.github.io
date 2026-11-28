import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems, localePath } from '../../../utils/posts';
import { ALL_PERSONAS, getPersona } from '../../../settings/personas.settings';
import { availableLocales, defaultLocale } from '../../../locales';

export async function getStaticPaths() {
  const locales = availableLocales.map((l) => l.code).filter((code) => code !== defaultLocale);
  return ALL_PERSONAS.flatMap((persona) =>
    locales.map((code) => ({
      params: { lang: localePath(code).slice(1), persona: persona.name },
      props: { persona, lang: code },
    }))
  );
}

export async function GET(context: APIContext) {
  const origin = new URL(context.request.url).origin;
  const { persona, lang } = context.props;
  const resolved = getPersona(persona.name, lang);
  const items = await getRssItems({ lang, personaId: persona.name });

  return rss({
    title: `${persona.name} RSS`,
    description: resolved.description,
    site: origin,
    items,
  });
}
