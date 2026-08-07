import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems } from '../../utils/posts';
import { ALL_AUTHORS } from '../../settings/authors.settings';
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
  const items = await getRssItems({ lang: defaultLocale, authorId: author.id });

  return rss({
    title: `${author.name} RSS`,
    description: author.description,
    site: origin,
    items,
  });
}
