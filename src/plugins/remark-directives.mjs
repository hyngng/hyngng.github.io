import { visit } from 'unist-util-visit';

const ADMONITION_TYPES = ['tip', 'warning', 'danger', 'info'];

/**
 * remark plugin: Unified directive processor.
 *
 * textDirective  → <span class="name class1 class2">content</span>
 *   Syntax: :name[content]{ .class1 .class2 }
 *
 * containerDirective (:::tip, :::warning, :::danger, :::info)
 *   → <div class="admonition admonition-{type}">…</div>
 */
export function remarkDirectives() {
  return (tree) => {
    visit(tree, 'textDirective', (node) => {
      const data = node.data || (node.data = {});
      const classes = [];

      if (node.name) {
        classes.push(node.name);
      }

      if (node.attributes) {
        for (const [key, value] of Object.entries(node.attributes)) {
          if (key === 'class' && typeof value === 'string') {
            classes.push(...value.split(/\s+/).filter(Boolean));
          } else if (key.startsWith('.')) {
            classes.push(key.slice(1));
          }
        }
      }

      data.hName = 'span';
      data.hProperties = { className: classes.join(' ') };
    });

    visit(tree, 'containerDirective', (node) => {
      if (!ADMONITION_TYPES.includes(node.name)) return;

      const data = node.data || (node.data = {});
      data.hName = 'div';
      data.hProperties = {
        class: `admonition admonition-${node.name}`,
      };

      const iconNode = {
        type: 'html',
        value: '<span class="admonition-icon" aria-hidden="true"></span>',
      };

      const bodyOpen = { type: 'html', value: '<div class="admonition-body">' };
      const bodyClose = { type: 'html', value: '</div>' };

      node.children = [iconNode, bodyOpen, ...node.children, bodyClose];
    });
  };
}
