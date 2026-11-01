export default function Record({ size }: { size: number }) {
  return (
    <div
      aria-hidden="true"
      className="scene-record"
      style={{ width: size, height: size }}
    >
      <div className="scene-record-disc" />
    </div>
  );
}
