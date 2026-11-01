// Renders HTML produced from our own /content markdown (trusted, build-time).
export default function Markdown({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html.trim()) return null;
  return (
    <div
      className={`md ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
