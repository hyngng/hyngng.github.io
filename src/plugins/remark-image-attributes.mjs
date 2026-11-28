import { visit } from 'unist-util-visit';

export function remarkImageAttributes() {
  return (tree) => {
    visit(tree, 'image', (node, index, parent) => {
      if (!parent || !Array.isArray(parent.children)) return;

      for (let i = index + 1; i < parent.children.length; i++) {
        const nextNode = parent.children[i];
        if (nextNode.type !== 'text') break;

        const match = nextNode.value.match(/\{([^}]+)\}/);
        if (match) {
          const attrString = match[1];
          const classes = [];
          const parts = attrString.split(/\s+/).filter(Boolean);

          for (const part of parts) {
            if (part.startsWith('.')) {
              classes.push(part.slice(1));
            } else if (part.startsWith('class=')) {
              const val = part.slice(6).replace(/^["']|["']$/g, '');
              classes.push(...val.split(/\s+/).filter(Boolean));
            }
          }

          if (classes.length > 0) {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};

            const existingClass = node.data.hProperties.className ?? node.data.hProperties.class ?? '';
            const existing = Array.isArray(existingClass)
              ? existingClass
              : String(existingClass).split(/\s+/).filter(Boolean);

            const merged = [...new Set([...existing, ...classes])];
            node.data.hProperties.className = merged;
            node.data.hProperties.class = merged.join(' ');
          }

          // Consume attribute text from nextNode
          const matchIndex = match.index ?? 0;
          const before = nextNode.value.slice(0, matchIndex);
          const after = nextNode.value.slice(matchIndex + match[0].length);
          const remainingText = before + after;

          if (/^\s*$/.test(remainingText)) {
            parent.children.splice(i, 1);
          } else {
            nextNode.value = remainingText;
          }
          break;
        }
      }
    });
  };
}
