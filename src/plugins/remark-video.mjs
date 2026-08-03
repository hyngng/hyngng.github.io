import { visit } from 'unist-util-visit';

function getMimeType(src) {
  const ext = src.split('?')[0].split('.').pop().toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogv') return 'video/ogg';
  return 'video/mp4';
}

export function remarkVideo() {
  return (tree) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name !== 'video') return;

      const { src, type } = node.attributes || {};
      if (!src) {
        console.warn('[remark-video] Missing src attribute');
        return;
      }

      const mimeType = type || getMimeType(src);

      const data = node.data || (node.data = {});
      data.hName = 'video';
      data.hProperties = {
        class: 'video-native',
        controls: true,
        playsinline: true,
      };
      data.hChildren = [
        {
          type: 'element',
          tagName: 'source',
          properties: { src, type: mimeType },
          children: [],
        },
      ];
    });
  };
}
