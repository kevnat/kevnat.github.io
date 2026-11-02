import { intro } from "../home/sleeves";

// Static holding page, shown in place of the whole site while
// the flag in app/lib/site.ts is on (the default for production builds).
export default function ComingSoon() {
  return (
    <main className="home-stage relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6">
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
  );
}
