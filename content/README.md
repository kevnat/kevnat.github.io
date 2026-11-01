# Content

Page text lives here as Markdown and is read at build time.

    content/<page>/index.md        frontmatter: title, lede. Body = optional intro
    content/<page>/items/*.md      one file per block on the page, sorted by filename
                                   frontmatter: title. Body = markdown

Pages: `about`, `focus`, `side-projects`. Prefix item files with `01-`, `02-`... to set order.

To add a new page, create `content/<name>/`, add a route that renders `<ContentPage id="<name>" />`,
and add an entry in `app/home/sleeves.ts`. To use a single file elsewhere, call
`readMarkdown("<page>/<name>")` from `app/lib/content.ts` and render it with `<Markdown html={...} />`.
The resume still uses `app/resume/data.ts`.
