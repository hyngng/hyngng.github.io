import { promises as fs } from 'node:fs';
import path from 'node:path';

const sourceRoot = path.resolve('posts/ko');
const targets = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  ja: 'ja',
  zh: 'zh-CN',
  ru: 'ru',
};

async function filesIn(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(file);
    return entry.name.endsWith('.md') ? [file] : [];
  }));
  return nested.flat();
}

function protect(text) {
  const saved = [];
  const token = value => {
    const key = `ZXQPROTECT${saved.length}QXZ`;
    saved.push(value);
    return key;
  };

  const protectedText = text
    .replace(/`[^`]*`/g, token)
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, match => match.replace(/\([^)]*\)/, token))
    .replace(/\{:\s*[^}]*\}/g, token)
    .replace(/::[\w-]+\{[^}]*\}/g, token)
    .replace(/https?:\/\/[^\s)]+/g, token);

  return {
    text: protectedText,
    restore: value => value.replace(/ZXQPROTECT(\d+)QXZ/g, (_, index) => saved[Number(index)]),
  };
}

async function translate(text, target) {
  if (!text.trim() || !/[가-힣]/.test(text)) return text;
  const { text: protectedText, restore } = protect(text);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'ko');
  url.searchParams.set('tl', target);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', protectedText);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const data = await response.json();
  return restore(data[0].map(part => part[0]).join(''));
}

async function translateLong(text, target) {
  const lines = text.split(/(?<=\n)/);
  const parts = [];
  let current = '';
  for (const line of lines) {
    if (line.length > 1000) {
      if (current) {
        parts.push(current);
        current = '';
      }
      for (let index = 0; index < line.length; index += 1000) {
        parts.push(line.slice(index, index + 1000));
      }
      continue;
    }
    if (current.length && current.length + line.length > 1000) {
      parts.push(current);
      current = '';
    }
    current += line;
  }
  if (current) parts.push(current);
  return (await Promise.all(parts.map(part => translate(part, target)))).join('');
}

async function translateFrontmatter(frontmatter, target) {
  const lines = frontmatter.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(title|description):\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    const quote = raw.startsWith('"') && raw.endsWith('"') ? '"' : '';
    const value = quote ? raw.slice(1, -1) : raw;
    const translated = await translate(value, target);
    lines[index] = `${key}: ${quote}${translated}${quote}`;
  }
  return lines.join('\n');
}

async function translateBody(body, target) {
  const withoutComments = body.replace(/<!--[\s\S]*?-->/g, '');
  const chunks = withoutComments.split(/(```[\s\S]*?```)/g);
  const translated = [];

  for (const chunk of chunks) {
    if (chunk.startsWith('```')) {
      translated.push(chunk);
      continue;
    }
    translated.push(await translateLong(chunk, target));
  }
  return translated.join('');
}

async function translateFile(source, language, target) {
  const input = await fs.readFile(source, 'utf8');
  const match = input.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) throw new Error(`Missing YAML front matter: ${source}`);
  const [, opening, frontmatter, closing, body] = match;
  const result = `${opening}${await translateFrontmatter(frontmatter, target)}${closing}${await translateBody(body, target)}`;
  const relative = path.relative(sourceRoot, source);
  const output = path.resolve('posts', language, relative);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, result, 'utf8');
}

const requested = process.argv.slice(2);
const selected = requested.length
  ? Object.fromEntries(requested.map(language => [language, targets[language]]).filter(([, target]) => target))
  : targets;
const sources = await filesIn(sourceRoot);
for (const [language, target] of Object.entries(selected)) {
  for (let index = 0; index < sources.length; index += 4) {
    const batch = sources.slice(index, index + 4);
    await Promise.all(batch.map(source => translateFile(source, language, target)));
    process.stdout.write(`Translated ${language}: ${Math.min(index + batch.length, sources.length)}/${sources.length}\n`);
  }
}
