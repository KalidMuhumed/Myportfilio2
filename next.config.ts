import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production DevTools from exposing original TypeScript sources.
  productionBrowserSourceMaps: false,
  // Dev only: lets a phone on the same Wi-Fi load /_next/* (Next 16).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
};

export default nextConfig;
