/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.15.84'
      }
    ]
  },
  env: {
    NEXTAUTH_SECRET: '/lLj/OWKqymAisCWbatVdCaovgIOvQeFNaQEtZTSR1Q='
  }
};

module.exports = nextConfig;
