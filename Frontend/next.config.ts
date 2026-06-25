import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'autotubeapi-production-8e42.up.railway.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
      {
        protocol: 'https',
        hostname: 'autotubeapi-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'autotubeapi-production-f4a4.up.railway.app',
      },
      {
        protocol: "https",
        hostname: "autotubeapi-production.up.railway.app",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
  },
};

export default nextConfig;
