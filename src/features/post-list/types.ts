export interface PostItem {
  path: string;
  title: string;
  description?: string;
}

export interface PostListConfig {
  chunkBaseUrl: string;
  chunkSize: number;
  currentChunk: number;
  totalChunks: number;
  totalPosts: number;
  posts: PostItem[];
}

export interface ChunkPayload {
  cards: HTMLElement[];
  loadMore: HTMLElement | null;
}

export interface PostListController {
  appendChunk(payload: ChunkPayload): HTMLElement[];
  showSearchResults(paths: string[]): Promise<void>;
  clearSearch(): void;
  restoreChunkCount(target: number): void;
  relayout(): void;
  fetchSearchChunk(n: number): Promise<void>;
  destroy(): void;
}
