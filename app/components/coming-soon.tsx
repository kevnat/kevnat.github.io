import { intro } from "../home/sleeves";
import Scene from "./scene/scene";

// Holding page, shown in place of the site while the flag in app/lib/site.ts
// is on (the default for production builds). On desktop it's the home scene
// with the objects switched off; phones get a plain dark page.
export default function ComingSoon() {
  return (
    <>
      <Scene locked />

      <main className="home-stage relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 md:hidden">
        <div className="home-fallback fixed inset-0" aria-hidden="true" />
        <div className="home-rise relative z-10 text-center">
          <h1 className="text-3xl tracking-[0.3em] text-foreground sm:text-4xl">
            {intro.name}
          </h1>
          <p className="mt-5 font-mono text-xs tracking-[0.35em] text-accent uppercase">
            Coming soon
          </p>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 hidden justify-center md:flex">
        <div
          className="scene-glass home-stage text-center"
          style={{ padding: "1.5rem 3rem" }}
        >
          <h1 className="text-3xl tracking-[0.3em] text-foreground">
            {intro.name}
          </h1>
          <p className="mt-3 font-mono text-xs tracking-[0.35em] text-foreground/85 uppercase">
            Coming soon
          </p>
        </div>
      </div>
    </>
  );
}
