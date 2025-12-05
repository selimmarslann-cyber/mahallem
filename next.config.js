/** @type {import('next').NextConfig} */

const nextConfig = {
  // Temel ayarlar
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    instrumentationHook: true,
  },

  images: {
    // Eski domains yerine remotePatterns kullanılıyor
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Prod için ekstra optimizasyonlar
  ...(process.env.NODE_ENV === "production" && {
    swcMinify: true,
    compiler: {
      removeConsole:
        process.env.NODE_ENV === "production"
          ? {
              exclude: ["error", "warn"],
            }
          : false,
    },
  }),

  // Cache header'ların aynısını koruyoruz
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
