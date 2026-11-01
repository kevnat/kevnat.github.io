"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Scene from "./scene/scene";

export default function SceneShell({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <>
      <Scene />
      {/* At md+ the home page is the scene itself; keep this layer from
          swallowing clicks, and leave room for the mini credenza elsewhere. */}
      <div
        className={`relative z-10 flex flex-1 flex-col ${
          isHome ? "md:pointer-events-none" : "md:pb-[280px]"
        }`}
      >
        {children}
      </div>
    </>
  );
}
