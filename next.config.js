/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    // Supabase storage domain'i buraya eklenecek
    // remotePatterns: [{ hostname: 'your-project.supabase.co' }]
  },
}

module.exports = nextConfig

