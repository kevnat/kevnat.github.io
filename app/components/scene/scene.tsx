"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { intro, sleeves } from "../../home/sleeves";
import { credenzaBounds, hotspots, lamp } from "./hotspots";
import Record from "./record";

const AmbientCanvas = dynamic(() => import("../../home/ambient-canvas"), {
  ssr: false,
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WALL = "#866754";
const MINI_MARGIN = 24;

type Geo = {
  W: number;
  H: number;
  L: number;
  T: number;
  S: number;
  tx: number;
  ty: number;
  miniW: number;
  miniH: number;
  recordSize: number;
};

// The stage is a 16:9 box covering the viewport (capped so the credenza never
// crops at the sides), bottom-aligned so the floor stays put.
function computeGeo(): Geo {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = Math.min(Math.max(vw, (vh * 16) / 9), vw * 1.155);
  const H = (W * 9) / 16;
  const L = (vw - W) / 2;
  const T = vh - H;
  const miniW = Math.min(Math.max(vw * 0.18, 240), 340);
  const S = miniW / ((credenzaBounds.right - credenzaBounds.left) * W);
  const tx = MINI_MARGIN - L - S * credenzaBounds.left * W;
  const ty = vh - MINI_MARGIN - T - S * credenzaBounds.bottom * H;
  const miniH = (credenzaBounds.bottom - credenzaBounds.top) * H * S;
  const recordSize = Math.round(Math.min(Math.max(miniW * 0.3, 64), 96));
  return { W, H, L, T, S, tx, ty, miniW, miniH, recordSize };
}

export default function Scene() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [geo, setGeo] = useState<Geo | null>(null);
  const [animate, setAnimate] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useIsoLayoutEffect(() => {
    const update = () => setGeo(computeGeo());
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    // Enable transitions only after the first placement, so a direct load of
    // an inner page starts in the mini state instead of animating into it.
    // Re-measure once the first frame has painted: some browsers report a
    // stale viewport height during the initial layout effect.
    const raf = requestAnimationFrame(() => {
      update();
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeId = isHome
    ? null
    : (sleeves.find((s) => s.href === pathname)?.id ?? null);
  const litId = hoverId ?? activeId;
  const lit = hotspots.find((h) => h.id === litId);

  const glowX = lit ? lit.left + lit.width / 2 : lamp.x;
  const glowY = lit ? 1 - (lit.top + lit.height / 2) : lamp.y;

  const fade = animate ? "opacity 1s ease" : "none";
  const stageBox = geo
    ? { left: geo.L, top: geo.T, width: geo.W, height: geo.H }
    : undefined;

  return (
    <div className="hidden md:block">
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{ background: WALL, opacity: isHome ? 1 : 0, transition: fade }}
      />

      {geo && (
        <div
          aria-hidden="true"
          className="fixed z-[1]"
          style={{
            ...stageBox,
            opacity: isHome ? 1 : 0,
            transition: fade,
            maskImage:
              geo.T > 1
                ? "linear-gradient(to bottom, transparent, #000 8%)"
                : undefined,
          }}
        >
          <Image
            src="/scene/room.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
          />
        </div>
      )}

      <div
        aria-hidden="true"
        className="fixed inset-0 z-[2]"
        style={{
          opacity: isHome ? 1 : 0,
          transition: fade,
          // Blend here, not on the canvas: this wrapper's stacking context
          // would otherwise isolate the canvas from the room behind it.
          mixBlendMode: "screen",
        }}
      >
        <AmbientCanvas
          overlay
          paused={!isHome}
          glowX={glowX}
          glowY={glowY}
        />
      </div>

      {/* Page backdrop for inner pages: solid, so existing pages read as before */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[3] bg-background"
        style={{ opacity: isHome ? 0 : 1, transition: fade }}
      />

      {geo && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 z-[15]"
          style={{
            width: MINI_MARGIN + geo.miniW + 40 + geo.recordSize + 80,
            height: geo.miniH + MINI_MARGIN + 90,
            background:
              "radial-gradient(ellipse at 0% 100%, var(--background) 55%, transparent 100%)",
            opacity: isHome ? 0 : 1,
            transition: fade,
          }}
        />
      )}

      {geo && (
        <div
          className="scene-credenza pointer-events-none fixed z-20"
          style={{
            ...stageBox,
            transformOrigin: "0 0",
            transform: isHome
              ? "none"
              : `translate(${geo.tx}px, ${geo.ty}px) scale(${geo.S})`,
            transition: animate
              ? "transform 1.1s cubic-bezier(0.65, 0.05, 0.2, 1)"
              : "none",
          }}
        >
          <div className="scene-floor-shadow" aria-hidden="true" />
          <Image
            src="/scene/credenza.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            aria-hidden="true"
          />
          {lit && (
            <Image
              src="/scene/credenza.webp"
              alt=""
              fill
              unoptimized
              sizes="100vw"
              aria-hidden="true"
              className="scene-highlight"
              style={{
                opacity: hoverId ? 1 : 0.55,
                maskImage: `radial-gradient(ellipse ${lit.width * 85}% ${lit.height * 110}% at ${(lit.left + lit.width / 2) * 100}% ${(lit.top + lit.height / 2) * 100}%, #000 35%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(ellipse ${lit.width * 85}% ${lit.height * 110}% at ${(lit.left + lit.width / 2) * 100}% ${(lit.top + lit.height / 2) * 100}%, #000 35%, transparent 100%)`,
              }}
            />
          )}

          <nav aria-label="Sections" className="absolute inset-0">
            {hotspots.map((h) => {
              const sleeve = sleeves.find((s) => s.id === h.id);
              if (!sleeve) return null;
              return (
                <Link
                  key={h.id}
                  href={sleeve.href}
                  aria-label={sleeve.title}
                  aria-current={h.id === activeId ? "page" : undefined}
                  className="scene-hotspot"
                  style={{
                    left: `${h.left * 100}%`,
                    top: `${h.top * 100}%`,
                    width: `${h.width * 100}%`,
                    height: `${h.height * 100}%`,
                  }}
                  onMouseEnter={() => setHoverId(h.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(h.id)}
                  onBlur={() => setHoverId(null)}
                >
                  <span
                    className="scene-label"
                    style={{
                      transform: `translateX(-50%) scale(${isHome ? 1 : 1 / geo.S})`,
                    }}
                  >
                    {sleeve.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {geo && (
        <div
          className="fixed z-20"
          style={{
            left: MINI_MARGIN + geo.miniW + 16,
            bottom: MINI_MARGIN,
            opacity: isHome ? 0 : 1,
            transition: animate
              ? `opacity 0.8s ease ${isHome ? "0s" : "0.7s"}`
              : "none",
          }}
        >
          <Record size={geo.recordSize} />
        </div>
      )}

      <div
        className="pointer-events-none fixed z-20"
        style={{
          left: MINI_MARGIN,
          bottom: 18,
          opacity: isHome ? 1 : 0,
          transition: animate ? "opacity 0.8s ease" : "none",
        }}
      >
        <h1 className="scene-name">{intro.name}</h1>
        <p className="sr-only">{intro.line}</p>
      </div>
    </div>
  );
}
