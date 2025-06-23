import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  experimental: {
    serverActions: true,
    instrumentationHook: true,
  },
};

export default nextConfig;
