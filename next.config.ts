import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones/tablets on the same LAN load dev chunks (/_next/*) and HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
