import { visit } from 'unist-util-visit';
import { resolveCdnPath } from '../utils/cdn';

function getMimeType(src, mimeMap, fallback) {
  const ext = src.split('?')[0].split('.').pop().toLowerCase();
  return mimeMap[ext] || fallback;
}

function createMediaDirective(name, className, mimeMap, fallback) {
  return () => (tree) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name !== name) return;

      const { src, type } = node.attributes || {};
      if (!src) {
        console.warn(`[${name}] Missing src attribute`);
        return;
      }

      const url = resolveCdnPath(src);
      const mimeType = type || getMimeType(src, mimeMap, fallback);

      const data = node.data || (node.data = {});
      data.hName = name;
      data.hProperties = {
        class: className,
        controls: true,
        ...(name === 'audio' ? { preload: 'metadata' } : { playsinline: true }),
      };
      data.hChildren = [
        {
          type: 'element',
          tagName: 'source',
          properties: { src: url, type: mimeType },
          children: [],
        },
      ];
    });
  };
}

export const remarkVideo = createMediaDirective(
  'video', 'video-native',
  { webm: 'video/webm', ogv: 'video/ogg' },
  'video/mp4',
);

export const remarkAudio = createMediaDirective(
  'audio', 'audio-native',
  { ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', m4a: 'audio/mp4', aac: 'audio/aac' },
  'audio/mpeg',
);
