import { visit } from 'unist-util-visit';

function findNode(root, predicate) {
  if (predicate(root)) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
  }
  return null;
}

function processFloats(tree) {
  visit(tree, 'element', (node) => {
    if (node.tagName !== 'span') return;

    const classes = Array.isArray(node.properties.className)
      ? node.properties.className
      : (node.properties.className || '').split(/\s+/).filter(Boolean);

    const isFloat = classes.includes('left') || classes.includes('right');
    if (!isFloat) return;

    const pNode = findNode(tree, n =>
      n.tagName === 'p' && n.children?.some(c => findNode(c, m => m === node)),
    );
    if (!pNode) return;

    const parentClasses = Array.isArray(pNode.properties.className)
      ? pNode.properties.className
      : (pNode.properties.className || '').split(/\s+/).filter(Boolean);
    pNode.properties.className = [...new Set([...parentClasses, 'has-float'])];

    const wrapperIndex = pNode.children.findIndex(
      c => findNode(c, m => m === node),
    );
    if (wrapperIndex === -1) return;

    const emIndex = pNode.children.findIndex(
      (c, i) => i > wrapperIndex && c.type === 'element' && c.tagName === 'em',
    );
    if (emIndex !== -1) {
      pNode.children.splice(emIndex, 1);
      return;
    }

    const nextP = pNode.next;
    if (nextP?.tagName === 'p') {
      const idx = nextP.children?.findIndex(
        c => c.type === 'element' && c.tagName === 'em',
      );
      if (idx !== undefined && idx !== -1) {
        nextP.children.splice(idx, 1);
      }
    }
  });
}

export function rehypeImageWrapper() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent) return;

      node.properties.loading = 'lazy';

      const alreadyWrapped = parent.tagName === 'span' || parent.tagName === 'a';
      const wrapper = alreadyWrapped ? parent : {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [node],
      };

      const existingWrapperClass = wrapper.properties.className ?? wrapper.properties.class ?? '';
      const existingImgClass = node.properties.className ?? node.properties.class ?? '';

      const parseClasses = (cls) => Array.isArray(cls) ? cls : String(cls || '').split(/\s+/).filter(Boolean);
      const existing = [...parseClasses(existingWrapperClass), ...parseClasses(existingImgClass)];

      const classes = [...new Set([...existing, 'img-wrapper'])];
      const source = String(node.properties.src || '').toLowerCase();
      const alt = String(node.properties.alt || '').toLowerCase();
      if (!classes.includes('img-light') && !classes.includes('img-dark') && !classes.includes('light') && !classes.includes('dark')) {
        if (/(^|[-_])light([._/-]|$)/.test(source) || /(^|[-_])light([._/-]|$)/.test(alt) || source.includes('#light')) classes.push('img-light');
        if (/(^|[-_])dark([._/-]|$)/.test(source) || /(^|[-_])dark([._/-]|$)/.test(alt) || source.includes('#dark')) classes.push('img-dark');
      }

      delete wrapper.properties.class;
      delete node.properties.class;
      delete node.properties.className;
      wrapper.properties.className = classes;

      if (!alreadyWrapped) parent.children[index] = wrapper;
    });

    processFloats(tree);
  };
}
