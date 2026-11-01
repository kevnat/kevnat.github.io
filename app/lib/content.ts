import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Markdown content lives in /content and is read at build time.
//   content/<page>/index.md        page frontmatter (title, lede) + optional intro
//   content/<page>/items/*.md      one file per block on the page, sorted by filename
// Any other file can be pulled in with readMarkdown("<page>/<name>").
const ROOT = path.join(process.cwd(), "content");

export type Markdown<T = Record<string, unknown>> = {
  slug: string;
  data: T;
  html: string;
};

function render(source: string): string {
  return marked.parse(source, { async: false });
}

export function readMarkdown<T = Record<string, unknown>>(
  rel: string,
): Markdown<T> {
  const raw = fs.readFileSync(path.join(ROOT, `${rel}.md`), "utf8");
  const { data, content } = matter(raw);
  return { slug: path.basename(rel), data: data as T, html: render(content) };
}

export function readCollection<T = Record<string, unknown>>(
  dir: string,
): Markdown<T>[] {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => readMarkdown<T>(`${dir}/${f.replace(/\.md$/, "")}`));
}

export type PageMeta = { title: string; lede?: string };
export type ItemMeta = { title: string };

export function readPage(page: string) {
  const index = readMarkdown<PageMeta>(`${page}/index`);
  return {
    title: index.data.title,
    lede: index.data.lede ?? "",
    introHtml: index.html,
    items: readCollection<ItemMeta>(`${page}/items`).map((m) => ({
      slug: m.slug,
      title: m.data.title,
      html: m.html,
    })),
  };
}
