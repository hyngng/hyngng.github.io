import { SITE } from '../settings/site.settings';

type MarkdownNode = {
  type?: string;
  url?: string;
  children?: MarkdownNode[];
};

const cdnImageBaseUrl = SITE.cdn.imageBaseUrl.replace(/\/$/, '');

function shouldRewrite(url: string): boolean {
  if (url.startsWith('//')) return false;
  if (/^https?:\/\//i.test(url)) return false;
  return true;
}

function visitImages(node: MarkdownNode) {
  if (node.type === 'image' && node.url && shouldRewrite(node.url)) {
    node.url = cdnImageBaseUrl + (node.url.startsWith('/') ? '' : '/') + node.url;
  }

  node.children?.forEach(visitImages);
}

export function remarkCdnImages() {
  return (tree: MarkdownNode) => {
    visitImages(tree);
  };
}
