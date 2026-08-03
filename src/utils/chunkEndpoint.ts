import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './posts';
import { SITE } from '../settings/site.settings';

import type { AuthorId } from '../settings/authors.settings';

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
