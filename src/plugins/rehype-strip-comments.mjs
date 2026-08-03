function strip(node) {
  if (!node.children) return;
  node.children = node.children.filter((child) => {
    if (child.type === 'comment') return false;
    const val = child.value || '';
    if (typeof val === 'string' && val.trimStart().startsWith('<!--')) return false;
    strip(child);
    return true;
  });
}

export function rehypeStripComments() {
  return (tree) => {
    strip(tree);
  };
}
