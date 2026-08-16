import { visit } from 'unist-util-visit';

const BLOCK_MEDIA = ['video', 'youtube', 'audio'];

function getClasses(node) {
  const props = node.data && node.data.hProperties;
  if (!props) return [];
  const cls = props.className ?? props.class;
  return Array.isArray(cls) ? cls : String(cls || '').split(/\s+/).filter(Boolean);
}

function hasFloatClass(node) {
  const classes = getClasses(node);
  return classes.includes('left') || classes.includes('right');
}

function containsImage(node) {
  if (node.type === 'image') return true;
  return Boolean(node.children && node.children.some(containsImage));
}

function isMediaChild(node) {
  if (node.type === 'emphasis') return false;
  if (node.type === 'image') return true;
  if (node.type === 'leafDirective' && BLOCK_MEDIA.includes(node.name)) return true;
  return containsImage(node);
}

function toFigure(node) {
  const data = node.data || (node.data = {});
  const props = data.hProperties || (data.hProperties = {});
  const classes = [...new Set([...getClasses(node), 'media-figure'])];
  delete props.className;
  props.class = classes.join(' ');

  data.hName = 'figure';

  for (const child of node.children || []) {
    if (child.type !== 'emphasis') continue;
    const childData = child.data || (child.data = {});
    childData.hName = 'figcaption';
  }
}

export function remarkMediaCaption() {
  return (tree) => {
    const paragraphs = [];
    visit(tree, 'paragraph', (node, parent) => {
      paragraphs.push({ node, parent });
    });

    for (const { node, parent } of paragraphs) {
      // Rule B: a block media directive (::video / ::youtube / ::audio)
      // immediately followed by an emphasis-only paragraph merges into one figure.
      if (!parent || !parent.children) continue;
      const idx = parent.children.indexOf(node);
      if (idx > 0) {
        const prev = parent.children[idx - 1];
        if (prev && prev.type === 'leafDirective' && BLOCK_MEDIA.includes(prev.name)) {
          const children = node.children || [];
          if (children.length > 0 && children.every((c) => c.type === 'emphasis')) {
            node.children.unshift(prev);
            parent.children.splice(idx - 1, 1);
          }
        }
      }

      // Rule A: any media paragraph with a direct <em> child is a figure.
      // Float-aligned media keeps the legacy <p> + processFloats path.
      const mediaChildren = (node.children || []).filter(isMediaChild);
      if (mediaChildren.length === 0) continue;
      if (mediaChildren.some(hasFloatClass)) continue;
      if (!node.children.some((c) => c.type === 'emphasis')) continue;

      toFigure(node);
    }
  };
}
