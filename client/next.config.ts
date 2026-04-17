import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Turbopack root is a new property in Next.js 16
  turbopack: {
    root: "..",
  },
};

export default nextConfig;