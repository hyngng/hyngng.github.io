import { readdir, readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import subsetFont from 'subset-font';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'src', 'assets', 'fonts', 'Pretendard-1.3.9');
const OUTPUT_DIR = path.join(ROOT, 'public', 'fonts', 'Pretendard');
const FONT_WEIGHTS = [
  { weight: 400, source: 'full/Pretendard-Regular.woff2', output: 'Pretendard-Regular.woff2' },
  { weight: 700, source: 'full/Pretendard-Bold.woff2', output: 'Pretendard-Bold.woff2' },
];

async function collectFiles(directory, extensions) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext)))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function addIntlText(characters) {
  const locales = ['ko-KR', 'en-US', 'es-ES', 'fr-FR', 'ja-JP', 'ru-RU', 'zh-CN'];
  const dates = [
    new Date(Date.UTC(2026, 0, 1)),
    new Date(Date.UTC(2026, 5, 15)),
    new Date(Date.UTC(2026, 11, 31)),
  ];

  for (const locale of locales) {
    for (const date of dates) {
      for (const options of [
        { dateStyle: 'full' },
        { year: 'numeric', month: 'long', day: 'numeric' },
        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' },
      ]) {
        for (const character of new Intl.DateTimeFormat(locale, options).format(date)) {
          characters.add(character);
        }
      }
    }
  }
}

async function collectCharacters() {
  const characters = new Set(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\n\t\r\u00a0');
  const files = [
    ...(await collectFiles(path.join(ROOT, 'posts'), ['.md', '.mdx'])),
    ...(await collectFiles(path.join(ROOT, 'src'), ['.ts', '.astro', '.mjs', '.css'])),
  ];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    for (const character of content) characters.add(character);
  }

  addIntlText(characters);
  return [...characters].filter((character) => character.isWellFormed()).join('');
}

async function buildFonts() {
  const text = await collectCharacters();
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const { weight, source, output } of FONT_WEIGHTS) {
    const sourcePath = path.join(SOURCE_DIR, source);
    const sourceBuffer = await readFile(sourcePath);
    const subset = await subsetFont(sourceBuffer, text, { targetFormat: 'woff2' });
    const outputPath = path.join(OUTPUT_DIR, output);
    await writeFile(outputPath, subset);
    const { size } = await stat(outputPath);
    console.log(`[fonts] ${output} (${weight}) ${(size / 1024).toFixed(1)} KiB`);
  }
}

await buildFonts();
