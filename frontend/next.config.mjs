/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Cache-Control', value: 'no-store' },
      ],
    }];
  },
};

export default nextConfig;
