import { getBaseUrl } from 'lib/utils';
const baseUrl = getBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL);

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
