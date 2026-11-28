const chunkCache = new Map<string, Promise<string>>();

export function fetchChunkHtml(chunkBaseUrl: string, n: number): Promise<string> {
  const key = `${chunkBaseUrl}/${n}`;
  const cached = chunkCache.get(key);
  if (cached) return cached;
  const promise = fetch(key).then(r => {
    if (!r.ok) throw new Error(`chunk fetch failed (${r.status}) for ${key}`);
    return r.text();
  }).catch(err => {
    chunkCache.delete(key);
    throw err;
  });
  chunkCache.set(key, promise);
  return promise;
}
