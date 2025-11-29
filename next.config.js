/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains deprecated - using remotePatterns instead
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Webpack configuration for better chunk loading
  webpack: (config, { isServer }) => {
    // Increase chunk loading timeout
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Faster refresh in development
    reactStrictMode: true,
  }),
}

module.exports = nextConfig

