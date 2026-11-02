import type { NextConfig } from "next";

// GitHub Pages serves this repo at /portfolio, so CI sets NEXT_PUBLIC_BASE_PATH.
// Locally it's unset and the site runs at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
