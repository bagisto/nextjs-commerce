/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextjsv2.bagisto.com'
      }
    ]
  },
  env: {
    NEXTAUTH_SECRET: '/lLj/OWKqymAisCWbatVdCaovgIOvQeFNaQEtZTSR1Q='
  }
};

module.exports = nextConfig;
