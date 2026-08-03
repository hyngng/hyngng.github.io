import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems } from '../../utils/posts';
import { getSiteMeta } from '../../settings/site.settings';
import { availableLocales, defaultLocale } from '../../locales';

export async function getStaticPaths() {
  const locales = availableLocales.map(l => l.code).filter(lang => lang !== defaultLocale);
  return locales.map((lang) => ({
    params: { lang },
    props: { lang },
  }));
}

export async function GET(context: APIContext) {
  const origin = new URL(context.request.url).origin;
  const { lang } = context.props;
  const items = await getRssItems({ lang });
  const siteMeta = getSiteMeta(lang);

  return rss({
    title: `${siteMeta.title} RSS`,
    description: siteMeta.description,
    site: origin,
    items,
  });
}
