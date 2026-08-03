const fs = require('fs');
const path = require('path');

function findMdFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findMdFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function transformFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const origContent = content;

  // Normalize CRLF to LF for processing
  content = content.replace(/\r\n/g, '\n');

  // Split into frontmatter and body
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return false;

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];

  let newBody = body;

  // ─── Code block aware processing ───
  // Split into code blocks and non-code-block segments to avoid
  // modifying content inside code blocks
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const segments = [];
  let lastIndex = 0;
  let m;
  while ((m = codeBlockRegex.exec(newBody)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: 'text', content: newBody.slice(lastIndex, m.index) });
    }
    segments.push({ type: 'code', content: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < newBody.length) {
    segments.push({ type: 'text', content: newBody.slice(lastIndex) });
  }

  for (const seg of segments) {
    if (seg.type !== 'text') continue;
    let t = seg.content;

    // 1. Jekyll prompt blocks: "> content\n{: .prompt-type }" -> ":::type\ncontent\n:::"
    t = t.replace(
      /^(> .+?)\n\{: \\.prompt-(tip|info|warning|danger) \}$/gm,
      (_match, blockquote, type) => {
        const lines = blockquote.split('\n');
        const content = lines.map(l => l.replace(/^> /, '')).join('\n').trim();
        return `:::${type}\n${content}\n:::`;
      }
    );

    // 2. Remove 
    t = t.replace(/\{: \\.filepath \}/g, '');

    // 3. Remove {: .nolineno }
    t = t.replace(/\{: \\.nolineno \}/g, '');

    // 4. Definition lists: "term\n: - content" -> "**term**  \n- content"
    //    Also handle multi-line definitions where continuation lines are indented
    t = t.replace(
      /^(.+)\n: (- )/gm,
      (_match, term, dash) => `**${term}**  \n${dash}`
    );

    // 5. Jekyll include: youtube
    t = t.replace(
      /\{%\s*include\s+embed\/youtube\.html\s+id=['"]([^'"]+)['"]\s*%\}/g,
      '::youtube{id="$1"}'
    );

    // 6. Jekyll include: audio (remove - no direct Astro equivalent)
    t = t.replace(
      /\{%\s*include\s+embed\/audio\.html[\s\S]*?%\}/g,
      ''
    );

    // 7. Jekyll include: no-linenos (remove)
    t = t.replace(
      /\{%\s*include\s+no-linenos\.html[\s\S]*?%\}/g,
      ''
    );

    // 8. Jekyll include: lang.html (remove)
    t = t.replace(
      /\{%\s*include\s+lang\.html\s*%\}/g,
      ''
    );

    // 9. Jekyll include: head.html (remove)
    t = t.replace(
      /\{%\s*include\s+head\.html[\s\S]*?%\}/g,
      ''
    );

    // 10. Remove {% raw %} and {% endraw %}
    t = t.replace(/\{%\s*raw\s*%\}/g, '');
    t = t.replace(/\{%\s*endraw\s*%\}/g, '');

    seg.content = t;
  }

  newBody = segments.map(s => s.content).join('');

  if (newBody !== body) {
    // Write back with original line endings
    const finalContent = `---\n${frontmatter}\n---\n${newBody}`;
    fs.writeFileSync(filePath, finalContent.replace(/\n/g, origContent.includes('\r\n') ? '\r\n' : '\n'));
    return true;
  }

  return false;
}

// Main
const postsDir = path.join(__dirname, '..', 'posts');
const files = findMdFiles(postsDir);

console.log(`Found ${files.length} markdown files`);

let changedCount = 0;
for (const file of files) {
  try {
    if (transformFile(file)) {
      changedCount++;
      console.log(`Transformed: ${path.relative(postsDir, file)}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

console.log(`\nDone! Transformed ${changedCount} files.`);
