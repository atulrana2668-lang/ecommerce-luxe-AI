/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  // Vercel will automatically handle these optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
