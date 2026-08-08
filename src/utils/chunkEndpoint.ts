import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './posts';
import { SITE } from '../settings/site.settings';
import { ALL_AUTHORS, type AuthorId } from '../settings/authors.settings';
import { defaultLocale } from '../locales';

interface ChunkProps {
  posts: CollectionEntry<'posts'>[];
  currentChunk: number;
  totalChunks: number;
  chunkBaseUrl: string;
  totalPosts: number;
}

interface ChunkStaticPath {
  params: { n: string };
  props: ChunkProps;
}

export async function getChunkStaticPaths(
  lang: string,
  chunkBaseUrl: string,
  authorId?: AuthorId,
): Promise<ChunkStaticPath[]> {
  const posts = await getPublishedPosts({ lang, authorId });
  const chunkSize = SITE.postsPerPage;
  const chunkCount = Math.ceil(posts.length / chunkSize);

  return Array.from({ length: chunkCount }, (_, i) => ({
    params: { n: String(i + 1) },
    props: {
      posts: posts.slice(i * chunkSize, Math.min((i + 1) * chunkSize + 1, posts.length)),
      currentChunk: i + 1,
      totalChunks: chunkCount,
      chunkBaseUrl,
      totalPosts: posts.length,
    },
  }));
}

export interface ChunkRoute {
  params: Record<string, string>;
  props: ChunkProps;
}

interface GetChunkRoutesOptions {
  /** Non-default language codes to emit. Omit for default-language-only routes. */
  langs?: string[];
  /** Emit a route per author (posts routes stay false). */
  authors?: boolean;
}

/**
 * Shared `getStaticPaths` builder for the four chunk routes:
 * `/posts/chunk/[n]`, `/[lang]/posts/chunk/[n]`,
 * `/[author]/chunk/[n]`, `/[lang]/[author]/chunk/[n]`.
 */
export async function getChunkRoutes(options: GetChunkRoutesOptions = {}): Promise<ChunkRoute[]> {
  const { langs = [], authors = false } = options;
  // Routes without a `[lang]` segment emit the default locale ('' -> defaultLocale);
  // routes with `[lang]` emit only the non-default locales (default is unprefixed).
  const langCodes = langs.length > 0 ? langs : [''];
  const authorIds = authors ? ALL_AUTHORS.map((a) => a.id) : [''];

  const routes: ChunkRoute[] = [];

  for (const lang of langCodes) {
    for (const authorId of authorIds) {
      const chunkBaseUrl = authorId
        ? lang
          ? `/${lang}/${authorId}/chunk`
          : `/${authorId}/chunk`
        : lang
          ? `/${lang}/posts/chunk`
          : '/posts/chunk';

      const chunkPaths = await getChunkStaticPaths(
        lang || defaultLocale,
        chunkBaseUrl,
        authorId ? (authorId as AuthorId) : undefined,
      );

      for (const p of chunkPaths) {
        routes.push({
          params: {
            ...(lang ? { lang } : {}),
            ...(authorId ? { author: authorId } : {}),
            n: p.params.n,
          },
          props: p.props,
        });
      }
    }
  }

  return routes;
}
