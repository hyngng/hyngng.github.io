import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems, localePath } from '../../../utils/posts';
import { ALL_AUTHORS, getAuthor } from '../../../settings/authors.settings';
import { availableLocales, defaultLocale } from '../../../locales';

export async function getStaticPaths() {
  const locales = availableLocales.map((l) => l.code).filter((code) => code !== defaultLocale);
  return ALL_AUTHORS.flatMap((author) =>
    locales.map((code) => ({
      params: { lang: localePath(code).slice(1), author: author.id },
      props: { author, lang: code },
    }))
  );
}

export async function GET(context: APIContext) {
  const origin = new URL(context.request.url).origin;
  const { author, lang } = context.props;
  const resolved = getAuthor(author.id, lang);
  const items = await getRssItems({ lang, authorId: author.id });

  return rss({
    title: `${author.name} RSS`,
    description: resolved.description,
    site: origin,
    items,
  });
}
