import type { APIContext } from 'astro';

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const sitemapUrl = new URL('sitemap.xml', origin).toString();

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
  ].join('\n');

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
