import BackLink from "./back-link";
import Markdown from "./markdown";

export type SectionContent = {
  eyebrow: string;
  title: string;
  lede: string;
  introHtml: string;
  items: { slug: string; title: string; html: string }[];
};

export default function SectionPage({ content }: { content: SectionContent }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 lg:px-8">
      <BackLink />
      <header className="mt-12">
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl tracking-[0.15em]">{content.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {content.lede}
        </p>
        <Markdown html={content.introHtml} className="mt-6" />
      </header>
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {content.items.map((item) => (
          <li key={item.slug} className="py-6">
            <h2 className="text-xl tracking-wide">{item.title}</h2>
            <Markdown
              html={item.html}
              className="mt-2 text-muted-foreground"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
