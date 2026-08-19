import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems } from '../../utils/posts';
import { ALL_AUTHORS, getAuthor } from '../../settings/authors.settings';
import { defaultLocale } from '../../locales';

export async function getStaticPaths() {
  return ALL_AUTHORS.map((author) => ({
    params: { author: author.id },
    props: { author },
  }));
}

export async function GET(context: APIContext) {
  const origin = new URL(context.request.url).origin;
  const { author } = context.props;
  const resolved = getAuthor(author.id, defaultLocale);
  const items = await getRssItems({ lang: defaultLocale, authorId: author.id });

  return rss({
    title: `${author.name} RSS`,
    description: resolved.description,
    site: origin,
    items,
  });
}
