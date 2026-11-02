import BackLink from "./back-link";
import Markdown from "./markdown";

export type SectionContent = {
  title: string;
  lede: string;
  introHtml: string;
  items: { slug: string; title: string; html: string }[];
};

export default function SectionPage({ content }: { content: SectionContent }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 md:pt-10 md:pb-16 lg:px-8">
    <main className="scene-glass">
      <div className="md:hidden">
        <BackLink />
      </div>
      <header className="mt-12 md:mt-0">
        <h1 className="text-4xl tracking-[0.15em]">{content.title}</h1>
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
    </div>
  );
}
