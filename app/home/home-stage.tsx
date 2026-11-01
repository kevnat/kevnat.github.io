"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { intro, sleeves } from "./sleeves";

const AmbientCanvas = dynamic(() => import("./ambient-canvas"), {
  ssr: false,
});

const RESTING_GLOW = 0.5;

export default function HomeStage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = sleeves.find((s) => s.id === activeId);

  return (
    <div className="home-stage relative flex min-h-screen flex-1 flex-col overflow-hidden md:hidden">
      <div className="home-fallback fixed inset-0" aria-hidden="true" />
      <AmbientCanvas glowX={active?.glowX ?? RESTING_GLOW} />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 py-16 lg:px-8 lg:py-24">
        <header className="home-rise" style={{ animationDelay: "0.8s" }}>
          <h1 className="text-3xl tracking-[0.3em] text-foreground sm:text-4xl">
            {intro.name}
          </h1>
          <p className="mt-4 max-w-md font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {intro.line}
          </p>
        </header>

        <nav aria-label="Sections">
          <ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            onMouseLeave={() => setActiveId(null)}
          >
            {sleeves.map((sleeve, i) => {
              const dimmed = activeId !== null && activeId !== sleeve.id;
              return (
                <li
                  key={sleeve.id}
                  className="home-rise"
                  style={{ animationDelay: `${1.4 + i * 0.15}s` }}
                >
                  <Link
                    href={sleeve.href}
                    onMouseEnter={() => setActiveId(sleeve.id)}
                    onFocus={() => setActiveId(sleeve.id)}
                    onBlur={() => setActiveId(null)}
                    data-dimmed={dimmed}
                    className="home-sleeve group flex aspect-[4/5] flex-col justify-between border border-border bg-surface/40 p-5 backdrop-blur-sm sm:aspect-[3/4]"
                  >
                    <span className="font-mono text-xs tracking-widest text-muted-foreground">
                      {sleeve.index}
                    </span>
                    <span>
                      <span className="block text-2xl tracking-[0.2em] text-foreground">
                        {sleeve.title}
                      </span>
                      <span className="mt-3 block font-mono text-xs leading-relaxed text-muted-foreground">
                        {sleeve.caption}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </main>
    </div>
  );
}
