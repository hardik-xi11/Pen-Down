import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  output: 'standalone',
  // This tells Vercel to ignore ESLint errors and deploy anyway
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;