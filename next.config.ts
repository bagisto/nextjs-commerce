import { configHeader } from '@/utils/constants';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT
        ? (() => {
          try {
            const url = new URL(process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT);
            return [
              {
                protocol: url.protocol.replace(":", "") as "https" | "http",
                hostname: url.hostname,
              },
            ];
          } catch {
            console.warn(
              "Invalid NEXT_PUBLIC_BAGISTO_ENDPOINT URL:",
              process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT,
            );
            return [];
          }
        })()
        : []),
      { protocol: "https", hostname: "**.bagisto.com" },
    ],
  },

  async headers() {
    return configHeader;
  },
  compress: true,
  experimental: {
    useCache: true,
    optimizePackageImports: [
      "@heroui/react",
      "framer-motion",
      "@apollo/client",
      "@reduxjs/toolkit",
      "lucide-react",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
