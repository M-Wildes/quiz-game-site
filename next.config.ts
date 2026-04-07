import path from "node:path";
import type { NextConfig } from "next";

const distDir =
  process.env.NEXT_DIST_DIR ??
  (process.env.VERCEL ? ".next" : ".next-build");

const nextConfig: NextConfig = {
  distDir,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
