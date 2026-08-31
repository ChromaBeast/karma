/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@karma/ui'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
