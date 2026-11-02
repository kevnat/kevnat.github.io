"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import Scene from "./scene/scene";
import SectionTabs from "./section-tabs";

export default function SceneShell({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";
  const router = useRouter();

  // Clicking the dimmed scene outside the glass pane (and outside links and
  // the nav) goes home. Desktop only: phones have no scene behind the page.
  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isHome || !window.matchMedia("(min-width: 768px)").matches) return;
    if ((e.target as HTMLElement).closest(".scene-glass, nav, a, button")) return;
    if (window.getSelection()?.toString()) return; // finished a text drag
    router.push("/");
  };

  return (
    <>
      <Scene />
      {/* At md+ the home page is the scene itself; keep this layer from
          swallowing clicks. Elsewhere, content floats over the zoomed scene. */}
      <div
        className={`relative z-10 flex flex-1 flex-col ${
          isHome ? "md:pointer-events-none" : "scene-overlay min-h-screen"
        }`}
        onClick={onBackdropClick}
      >
        {!isHome && <SectionTabs />}
        {children}
      </div>
    </>
  );
}
