import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
  output: 'standalone',
  esLint: {
	ignoreDuringBuilds: true,
  },
};

export default nextConfig;
