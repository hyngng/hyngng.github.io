import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems, localePath } from '../../utils/posts';
import { getSiteMeta, availableLocales, defaultLocale } from '../../locales';

export async function getStaticPaths() {
  const locales = availableLocales.map((l) => l.code).filter((code) => code !== defaultLocale);
  return locales.map((code) => ({
    params: { lang: localePath(code).slice(1) },
    props: { lang: code },
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
