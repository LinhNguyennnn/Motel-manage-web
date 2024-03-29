/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = {
  env: {
    BASE_API_LOCAL: process.env.BASE_API_LOCAL,
    BASE_API_PRODUCTION: '',
  },
  images: {
    domains: ['https://firebasestorage.googleapis.com'],
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/Introduce',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
