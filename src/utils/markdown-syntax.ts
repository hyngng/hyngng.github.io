import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';
import { math } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';

const syntax = {
  table: {
    micromark: () => gfmTable(),
    fromMarkdown: () => gfmTableFromMarkdown(),
  },
  directive: {
    micromark: () => directive(),
    fromMarkdown: () => directiveFromMarkdown(),
    remarkPlugin: remarkDirective,
  },
  math: {
    micromark: () => math({ singleDollarTextMath: true }),
    fromMarkdown: () => mathFromMarkdown(),
    remarkPlugin: remarkMath,
  },
} as const;

export const markdownRemarkPlugins = {
  directive: syntax.directive.remarkPlugin,
  math: syntax.math.remarkPlugin,
};

interface MarkdownSyntaxOptions {
  includeMath?: boolean;
}

export function getMarkdownSyntax({ includeMath = false }: MarkdownSyntaxOptions = {}) {
  const extensions = [syntax.table, syntax.directive, ...(includeMath ? [syntax.math] : [])];

  return {
    extensions: extensions.map(({ micromark }) => micromark()),
    mdastExtensions: extensions.map(({ fromMarkdown }) => fromMarkdown()),
  };
}
