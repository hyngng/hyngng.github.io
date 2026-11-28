function strip(node) {
  if (!node.children) return;
  node.children = node.children.filter((child) => {
    if (child.type === 'comment') return false;
    strip(child);
    return true;
  });
}

export function rehypeStripComments() {
  return (tree) => {
    strip(tree);
  };
}
