"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sleeves } from "../home/sleeves";

export default function SectionTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Switch section"
      className="mx-auto hidden w-full max-w-6xl px-6 pt-6 md:flex lg:px-8"
    >
      <ul className="flex gap-6">
        {sleeves.map((s) => {
          const active = s.href === pathname;
          return (
            <li key={s.id}>
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                  active
                    ? "border-b border-accent pb-1 text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {s.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
