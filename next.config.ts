import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // File on disk is currently named Favoicon.png
      { source: "/favicon.png", destination: "/Favoicon.png" },
    ];
  },
};

export default nextConfig;
