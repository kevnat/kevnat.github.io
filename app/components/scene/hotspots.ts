// Clickable objects on the credenza. Boxes are fractions (0..1) of the
// 2560x1440 scene canvas, measured from public/scene/credenza.webp.
// `id` matches a sleeve in app/home/sleeves.ts, which supplies title and href.
export type Hotspot = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export const hotspots: Hotspot[] = [
  // Tube amp
  { id: "focus", left: 0.55, top: 0.3653, width: 0.12, height: 0.0944 },
  // Vinyl crate
  { id: "side-projects", left: 0.6469, top: 0.6472, width: 0.1258, height: 0.1972 },
  // Bronze sculpture on books
  { id: "about", left: 0.2426, top: 0.4854, width: 0.1156, height: 0.1424 },
  // Burl-wood box
  { id: "resume", left: 0.5418, top: 0.5576, width: 0.1129, height: 0.0701 },
];

// Credenza bounds within the canvas (from the cutout's alpha channel).
export const credenzaBounds = {
  left: 257 / 2560,
  top: 315 / 1440,
  right: 2296 / 2560,
  bottom: 1378 / 1440,
};

// Where the lamp sits (x from left, y from bottom), for the resting glow.
export const lamp = { x: 0.93, y: 0.74 };
