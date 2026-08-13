import { visit } from 'unist-util-visit';
import { getLocale } from '../locales/index';

const LOCALE_FROM_PATH = /[\\/]posts[\\/]([a-z]{2})[\\/]/;

function localeLabel(file) {
  const path = file?.history?.[0] ?? '';
  const match = LOCALE_FROM_PATH.exec(path);
  return getLocale(match?.[1]).footnote.label;
}

function toInlineSafe(node) {
  if (node.type === 'element' && (node.tagName === 'p' || node.tagName === 'div')) {
    return {
      ...node,
      tagName: 'span',
      properties: {
        ...node.properties,
        className: [...(node.properties?.className ?? []), 'footnote-block'],
      },
      children: node.children.map(toInlineSafe),
    };
  }
  return node;
}

export function rehypeFootnoteTooltip() {
  return (tree, file) => {
    const label = localeLabel(file);

    visit(tree, 'element', (node) => {
      if (node.properties?.id === 'footnote-label') {
        node.children = [{ type: 'text', value: label }];
      }
    });

    const definitions = new Map();
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'li' &&
        typeof node.properties?.id === 'string' &&
        node.properties.id.startsWith('user-content-fn-')
      ) {
        definitions.set(node.properties.id, node.children);
      }
    });

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'a' || node.properties?.dataFootnoteRef === undefined || !parent) return;

      const targetId = String(node.properties.href).replace('#', '');
      const original = definitions.get(targetId);
      if (!original) return;

      const cloned = structuredClone(original).map(toInlineSafe);

      const lastBlock = cloned[cloned.length - 1];
      if (lastBlock?.children) {
        lastBlock.children = lastBlock.children.filter(
          (child) => !(child.type === 'element' && child.properties?.dataFootnoteBackref !== undefined)
        );
      }

      const label = targetId.replace('user-content-fn-', '');
      const tooltipId = `fn-tooltip-${label}`;
      const tooltip = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['footnote-tooltip'], role: 'tooltip', id: tooltipId },
        children: cloned,
      };

      const wrapper = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['footnote-ref-wrapper'] },
        children: [node, tooltip],
      };

      const existing = node.properties.ariaDescribedby;
      node.properties.ariaDescribedby = existing ? `${existing} ${tooltipId}` : tooltipId;

      parent.children[index] = wrapper;
    });
  };
}
