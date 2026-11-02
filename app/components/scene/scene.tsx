"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { intro, sleeves } from "../../home/sleeves";
import { hotspots, lamp } from "./hotspots";

const AmbientCanvas = dynamic(() => import("../../home/ambient-canvas"), {
  ssr: false,
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WALL = "#866754";
// next/image doesn't add basePath to unoptimized srcs.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ZOOM = 2.6;

type Geo = {
  W: number;
  H: number;
  L: number;
  T: number;
  vw: number;
  vh: number;
};

// The stage is a 16:9 box covering the viewport (capped so the credenza never
// crops at the sides), bottom-aligned so the floor stays put.
function computeGeo(): Geo {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = Math.min(Math.max(vw, (vh * 16) / 9), vw * 1.155);
  const H = (W * 9) / 16;
  return { W, H, L: (vw - W) / 2, T: vh - H, vw, vh };
}

// Camera that centres a hotspot in the viewport at ZOOM, clamped so the stage
// never leaves the screen. The stage always covers the viewport (L <= 0, T <= 0).
function cameraFor(h: (typeof hotspots)[number], g: Geo) {
  const cx = g.L + (h.left + h.width / 2) * g.W;
  const cy = g.T + (h.top + h.height / 2) * g.H;
  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));
  const tx = clamp(
    g.vw / 2 - ZOOM * cx,
    g.vw - ZOOM * (g.L + g.W),
    -ZOOM * g.L,
  );
  const ty = clamp(
    g.vh * 0.45 - ZOOM * cy,
    g.vh - ZOOM * (g.T + g.H),
    -ZOOM * g.T,
  );
  return `translate(${tx}px, ${ty}px) scale(${ZOOM})`;
}

// `locked` is the coming-soon mode: always the home view, with the objects inert.
export default function Scene({ locked = false }: { locked?: boolean }) {
  const pathname = usePathname();
  const isHome = locked || pathname === "/";
  const [geo, setGeo] = useState<Geo | null>(null);
  const [animate, setAnimate] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  // On first landing, each label shows briefly in turn to say what's clickable.
  const [introDone, setIntroDone] = useState(false);
  const introActive = isHome && animate && !introDone && !locked;

  useEffect(() => {
    if (!introActive) return;
    const t = setTimeout(() => setIntroDone(true), 5400);
    return () => clearTimeout(t);
  }, [introActive]);

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
  const fade = animate ? "opacity 1s ease" : "none";
  const stageBox = geo
    ? { left: geo.L, top: geo.T, width: geo.W, height: geo.H }
    : undefined;
  const activeHotspot = hotspots.find((h) => h.id === activeId);
  const camera =
    geo && !isHome && activeHotspot ? cameraFor(activeHotspot, geo) : "none";

  return (
    <div className="hidden md:block">
      {/* Everything inside zooms together, so layers stay aligned. */}
      <div
        aria-hidden={!isHome}
        className="scene-camera fixed inset-0 z-[1]"
        style={{
          transformOrigin: "0 0",
          willChange: "transform",
          transform: camera,
          transition: animate
            ? "transform 1.1s cubic-bezier(0.65, 0.05, 0.2, 1)"
            : "none",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{ background: WALL }}
        />

        {geo && (
          <div
            aria-hidden="true"
            className="absolute z-[1]"
            style={{
              ...stageBox,
              maskImage:
                geo.T > 1
                  ? "linear-gradient(to bottom, transparent, #000 8%)"
                  : undefined,
            }}
          >
            <Image
              src={`${BASE}/scene/room.webp`}
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
          className="absolute inset-0 z-[2]"
          style={{
            // Blend here, not on the canvas: this wrapper's stacking context
            // would otherwise isolate the canvas from the room behind it.
            mixBlendMode: "screen",
          }}
        >
          <AmbientCanvas overlay glowX={lamp.x} glowY={lamp.y} />
        </div>

        {geo && (
          <div className="pointer-events-none absolute z-20" style={stageBox}>
            <div className="scene-floor-shadow" aria-hidden="true" />
            <Image
              src={`${BASE}/scene/credenza.webp`}
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              aria-hidden="true"
            />
            {/* Each object has its own glow that eases in and out on hover.
                The sculpture sits right beside the shelf light, so it's subdued. */}
            {hotspots.map((h) => {
              const on = isHome && hoverId === h.id;
              const mask = `radial-gradient(ellipse ${h.width * 85}% ${h.height * 110}% at ${(h.left + h.width / 2) * 100}% ${(h.top + h.height / 2) * 100}%, #000 35%, transparent 100%)`;
              return (
                <div
                  key={h.id}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: on ? (h.id === "about" ? 0.5 : 1) : 0,
                    transition: on
                      ? "opacity 1.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      : "opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Image
                    src={`${BASE}/scene/credenza.webp`}
                    alt=""
                    fill
                    unoptimized
                    sizes="100vw"
                    className={`scene-highlight${on ? " is-on" : ""}`}
                    style={{ maskImage: mask, WebkitMaskImage: mask }}
                  />
                </div>
              );
            })}

            {!locked && (
              <nav
                aria-label="Sections"
                className="absolute inset-0"
                inert={!isHome}
              >
                {hotspots.map((h) => {
                  const sleeve = sleeves.find((s) => s.id === h.id);
                  if (!sleeve) return null;
                  return (
                    <Link
                      key={h.id}
                      href={sleeve.href}
                      aria-label={sleeve.title}
                      className="scene-hotspot"
                      style={{
                        left: `${h.left * 100}%`,
                        top: `${h.top * 100}%`,
                        width: `${h.width * 100}%`,
                        height: `${h.height * 100}%`,
                      }}
                      // The link goes inert on navigation, so mouseleave never
                      // fires; clear here or the hover glow pops on when we return.
                      onClick={() => {
                        setHoverId(null);
                        setIntroDone(true);
                      }}
                      onMouseEnter={() => {
                        setHoverId(h.id);
                        setIntroDone(true);
                      }}
                      onMouseLeave={() => setHoverId(null)}
                      onFocus={() => setHoverId(h.id)}
                      onBlur={() => setHoverId(null)}
                    >
                      <span
                        className="scene-label"
                        data-intro={introActive ? "" : undefined}
                        style={{
                          transform: "translateX(-50%)",
                          animationDelay: introActive
                            ? `${1.4 + sleeves.indexOf(sleeve) * 0.55}s`
                            : undefined,
                        }}
                      >
                        {sleeve.title}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        )}
      </div>

      {/* Dim and soften the zoomed scene so page content reads over it. The blur
          lives here, not as a filter on the zoomed layer: filtering a huge
          scaled layer forces expensive re-rasterising and flashes on zoom-out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(20,13,8,.55) 0%, rgba(20,13,8,.78) 100%)",
          WebkitBackdropFilter: "blur(1.5px) brightness(0.85)",
          backdropFilter: "blur(1.5px) brightness(0.85)",
          opacity: isHome ? 0 : 1,
          transition: fade,
        }}
      />

      {!locked && (
        <div
          className="pointer-events-none fixed z-20"
          style={{
            left: 24,
            bottom: 18,
            opacity: isHome ? 1 : 0,
            transition: animate ? "opacity 0.8s ease" : "none",
          }}
        >
          <h1 className="scene-name">{intro.name}</h1>
          <p className="sr-only">{intro.line}</p>
        </div>
      )}
    </div>
  );
}
