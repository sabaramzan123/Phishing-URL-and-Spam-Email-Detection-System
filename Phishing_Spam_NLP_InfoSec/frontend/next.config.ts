import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    // If an external backend URL is explicitly configured, proxy requests to it
    if (process.env.BACKEND_API_URL) {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.BACKEND_API_URL}/api/:path*`,
        },
      ];
    }
    // Otherwise, route natively to Next.js API Route Handlers in src/app/api
    return [];
  },
};

export default nextConfig;
