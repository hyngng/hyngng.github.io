import { rewriteToCdnUrl, shouldRewriteCdnUrl } from '../utils/cdn';

type MarkdownNode = {
  type?: string;
  url?: string;
  children?: MarkdownNode[];
};

function visitImages(node: MarkdownNode) {
  if (node.type === 'image' && node.url && shouldRewriteCdnUrl(node.url)) {
    node.url = rewriteToCdnUrl(node.url);
  }

  node.children?.forEach(visitImages);
}

export function remarkCdnImages() {
  return (tree: MarkdownNode) => {
    visitImages(tree);
  };
}
