"use client";

import { useState } from "react";
import BackLink from "../components/back-link";
import { profile, timeline, type Highlight, type TimelineEntry } from "./data";

const TYPE_LABEL: Record<Highlight["type"], string> = {
  screenshot: "Screenshot",
  press: "Press",
  demo: "Demo",
};

export default function ResumeClient() {
  const [activeId, setActiveId] = useState(timeline[0].id);
  const activeEntry =
    timeline.find((entry) => entry.id === activeId) ?? timeline[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 md:pt-10 md:pb-16 lg:px-8">
      <div className="scene-glass">
      <div className="mb-6 md:hidden">
        <BackLink />
      </div>
      <ProfileHeader />
      <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[220px_1fr_320px] lg:gap-12">
        <TimelineNav
          entries={timeline}
          activeId={activeEntry.id}
          onSelect={setActiveId}
        />
        <Narrative entry={activeEntry} />
        <HighlightsPanel key={activeEntry.id} highlights={activeEntry.highlights} />
      </div>
      </div>
    </div>
  );
}

function ProfileHeader() {
  return (
    <header className="border-b border-border pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>{profile.location}</span>
        <span aria-hidden>·</span>
        <a className="hover:text-accent" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span aria-hidden>·</span>
        <span>{profile.phone}</span>
        <span aria-hidden>·</span>
        <a
          className="hover:text-accent"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin.com/in/kevnat
        </a>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <p className="leading-7 text-foreground/85 lg:col-span-2">
          {profile.summary}
        </p>
        <div className="space-y-4">
          {profile.focusAreas.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.category}
              </h2>
              <SkillsMarquee items={group.items} />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function SkillsMarquee({ items }: { items: string[] }) {
  const duration = Math.max(items.length * 7, 20);

  return (
    <div className="marquee mt-1.5" tabIndex={0}>
      <div
        className="marquee-track flex gap-1.5"
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((item) => (
          <span
            key={item}
            className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
        {items.map((item) => (
          <span
            key={`${item}-dup`}
            aria-hidden="true"
            className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineNav({
  entries,
  activeId,
  onSelect,
}: {
  entries: TimelineEntry[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Career timeline"
      className="flex gap-4 overflow-x-auto pb-2 lg:sticky lg:top-16 lg:block lg:h-fit lg:overflow-visible lg:pb-0"
    >
      <ol className="flex gap-4 lg:block lg:gap-0">
        {entries.map((entry, index) => {
          const active = entry.id === activeId;
          const isLast = index === entries.length - 1;
          return (
            <li key={entry.id} className="flex shrink-0 gap-3 pb-0 lg:pb-6 last:lg:pb-0">
              <div className="hidden w-2 shrink-0 flex-col items-center self-stretch lg:flex">
                <span
                  aria-hidden
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    active ? "bg-accent" : "bg-border"
                  }`}
                />
                {!isLast && (
                  <span aria-hidden className="w-px flex-1 bg-border" />
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelect(entry.id)}
                aria-current={active ? "true" : undefined}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 text-left transition-colors lg:whitespace-normal lg:px-0 lg:py-0 ${
                  active
                    ? "bg-accent/10 lg:bg-transparent"
                    : "hover:bg-surface lg:hover:bg-transparent"
                }`}
              >
                <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {entry.dateRange}
                </span>
                <span
                  className={`block text-sm font-semibold ${
                    active ? "text-accent" : "text-foreground/85"
                  }`}
                >
                  {entry.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {entry.org}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Narrative({ entry }: { entry: TimelineEntry }) {
  return (
    <article className="min-w-0">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{entry.title}</h1>
        <p className="text-muted-foreground">
          {entry.org}
          {entry.location ? ` · ${entry.location}` : ""} · {entry.dateRange}
        </p>
      </header>
      {entry.summary && (
        <p className="mb-6 leading-7 text-foreground/85">{entry.summary}</p>
      )}
      <ul className="space-y-3">
        {entry.achievements.map((achievement, i) => (
          <li key={i} className="flex gap-3 leading-6 text-foreground/85">
            <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function HighlightsPanel({ highlights }: { highlights: Highlight[] }) {
  const [index, setIndex] = useState(0);
  const active = highlights[index];

  if (!active) {
    return (
      <aside className="text-sm text-muted-foreground">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Product Highlights
        </h2>
        No highlights yet for this role.
      </aside>
    );
  }

  const goPrev = () =>
    setIndex((i) => (i - 1 + highlights.length) % highlights.length);
  const goNext = () => setIndex((i) => (i + 1) % highlights.length);

  return (
    <aside className="lg:sticky lg:top-16 lg:h-fit">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Product Highlights
      </h2>
      <div className="rounded-xl border border-border p-4">
        <span className="mb-3 inline-block rounded-full bg-surface px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {TYPE_LABEL[active.type]}
        </span>

        {active.type === "screenshot" && (
          <div
            aria-hidden
            className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-surface to-border text-xs text-muted-foreground"
          >
            Screenshot placeholder
          </div>
        )}

        <h3 className="font-semibold">{active.title}</h3>
        <p className="mb-2 text-xs text-muted-foreground">{active.source}</p>
        <p className="mb-4 text-sm leading-6 text-foreground/85">
          {active.description}
        </p>

        {active.href && (
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline underline-offset-4"
          >
            {active.type === "demo" ? "Launch demo" : "Read more"} &rarr;
          </a>
        )}
      </div>

      {highlights.length > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous highlight"
            className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            &larr; Prev
          </button>
          <span className="text-xs text-muted-foreground">
            {index + 1} / {highlights.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next highlight"
            className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </aside>
  );
}
