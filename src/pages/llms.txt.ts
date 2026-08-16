import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { buildLlmsTxt } from '../utils/llms';

export async function GET({ request }: APIContext) {
  const origin = new URL(request.url).origin;
  const posts = await getCollection('posts');
  const text = buildLlmsTxt({ origin, posts });

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
