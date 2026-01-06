import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow:  ['/customer/*', '/checkout'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_NEXT_AUTH_URL}/sitemap.xml`,
  }
}
