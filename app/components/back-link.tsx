import Link from "next/link";

export default function BackLink() {
  return (
    <Link
      href="/"
      className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-accent"
    >
      &larr; Home
    </Link>
  );
}
