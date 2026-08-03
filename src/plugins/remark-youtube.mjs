import { visit } from 'unist-util-visit';

/**
 * remark plugin: Converts ::youtube{id="..."} leafDirective to YouTube iframe.
 *
 * Syntax: ::youtube{id="VIDEO_ID"}
 * Output: <div class="video-embed"><iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe></div>
 */
export function remarkYoutube() {
  return (tree) => {
    visit(tree, 'leafDirective', (node) => {
      if (node.name !== 'youtube') return;

      const { id } = node.attributes || {};
      if (!id) {
        console.warn('[remark-youtube] Missing id attribute');
        return;
      }

      const data = node.data || (node.data = {});
      data.hName = 'div';
      data.hProperties = { class: 'video-embed' };
      data.hChildren = [
        {
          type: 'element',
          tagName: 'iframe',
          properties: {
            src: `https://www.youtube.com/embed/${id}`,
            frameborder: '0',
            allowfullscreen: true,
            loading: 'lazy'
          },
          children: []
        }
      ];
    });
  };
}
