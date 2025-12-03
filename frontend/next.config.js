/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Set output file tracing root to silence lockfile warning
  outputFileTracingRoot: require('path').join(__dirname),
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

module.exports = nextConfig;

