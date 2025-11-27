/**
 * Robots.txt
 * 
 * Search engine crawler instructions
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/business/', '/customer/'],
      },
    ],
    sitemap: 'https://hizmetgo.app/sitemap.xml',
  }
}

