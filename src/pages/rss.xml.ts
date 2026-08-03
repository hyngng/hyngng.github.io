import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getRssItems } from '../utils/posts';
import { getSiteMeta } from '../settings/site.settings';
import { defaultLocale } from '../locales';

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const items = await getRssItems({ lang: defaultLocale });
  const siteMeta = getSiteMeta(defaultLocale);

  return rss({
    title: `${siteMeta.title} RSS`,
    description: siteMeta.description,
    site: origin,
    items,
  });
}
