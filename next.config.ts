import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the same Wi-Fi (http://192.168.x.x:3000) load
  // /_next/* client JS. Without this Next 16 blocks it → page never hydrates
  // → chat demo / Live Demo do nothing on mobile. Each `*` = one IP segment.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  async rewrites() {
    return [
      // File on disk is currently named Favoicon.png
      { source: "/favicon.png", destination: "/Favoicon.png" },
    ];
  },
};

export default nextConfig;
