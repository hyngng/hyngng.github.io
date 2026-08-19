import { visit } from 'unist-util-visit';

const ADMONITION_TYPES = ['tip', 'warning', 'danger', 'info'];

const ADMONITION_ICONS = {
  tip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 287.2 0 184 0S0 78.8 0 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c19.8 27.1 39.7 54.4 49.2 86.2c.7 2.3 1.1 4.7 1.1 7.1c0 8.8-7.2 16-16 16H144c-8.8 0-16 7.2-16 16s7.2 16 16 16H240c8.8 0 16-7.2 16-16s-7.2-16-16-16c-8.8 0-16-7.2-16-16s.4-4.8 1.1-7.1zM112 480c0-8.8 7.2-16 16-16H256c8.8 0 16 7.2 16 16s-7.2 16-16 16H128c-8.8 0-16-7.2-16-16zm80-432a144 144 0 1 1 0 288 144 144 0 1 1 0-288z"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216.4 374.6c6.8 11.8 7.1 26 1.1 38.1s-16.2 19.5-29.5 19.5H33.5c-13.3 0-25.6-7.4-29.5-19.5s-5.6-26.3 1.1-38.1L221.5 51.8C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm0 176a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  danger: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm0 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/></svg>',
};

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
        value: `<span class="admonition-icon" aria-hidden="true">${ADMONITION_ICONS[node.name]}</span>`,
      };

      const bodyOpen = { type: 'html', value: '<div class="admonition-body">' };
      const bodyClose = { type: 'html', value: '</div>' };

      node.children = [iconNode, bodyOpen, ...node.children, bodyClose];
    });
  };
}
