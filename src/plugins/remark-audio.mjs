import { visit } from 'unist-util-visit';
import { resolveCdnPath } from '../utils/cdn.ts';

function getMimeType(src) {
  const ext = src.split('?')[0].split('.').pop().toLowerCase();
  if (ext === 'ogg' || ext === 'oga' || ext === 'opus') return 'audio/ogg';
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'flac') return 'audio/flac';
  if (ext === 'm4a') return 'audio/mp4';
  if (ext === 'aac') return 'audio/aac';
  return 'audio/mpeg';
}

export function remarkAudio() {
  return (tree) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name !== 'audio') return;

      const { src, type } = node.attributes || {};
      if (!src) {
        console.warn('[remark-audio] Missing src attribute');
        return;
      }

      const audioUrl = resolveCdnPath(src);
      const mimeType = type || getMimeType(src);

      const data = node.data || (node.data = {});
      data.hName = 'audio';
      data.hProperties = {
        class: 'audio-native',
        controls: true,
        preload: 'metadata',
      };
      data.hChildren = [
        {
          type: 'element',
          tagName: 'source',
          properties: { src: audioUrl, type: mimeType },
          children: [],
        },
      ];
    });
  };
}
