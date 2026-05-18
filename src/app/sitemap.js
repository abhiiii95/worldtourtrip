import { getBlogList } from "@/services/blogservices";
import { getDestinationList } from "@/services/destinationapi";
import { getPackageList } from "@/services/packageServices";

export default async function sitemap() {
  const baseUrl = 'https://worldtourtrip.com'

  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destination`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/package`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-03-20T18:08:11+00:00'),
      priority: 0.8,
    },
  ]

  let blogRoutes = [];
  let destinationRoutes = [];
  let packageRoutes = [];

  try {
    const data = await getBlogList()
    const blogListData = data?.data
    if (Array.isArray(blogListData)) {
      blogRoutes = blogListData.map((blog) => ({
        url: `${baseUrl}/blog/${blog.routPath}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Blog sitemap fetch failed:', error)
  }

  try {
    const data = await getDestinationList()
    const destListData = data?.destinations;
    if (Array.isArray(destListData)) {
      destinationRoutes = destListData.map((dest) => ({
        url: `${baseUrl}/destination/${dest.routPath}`,
        lastModified: new Date(dest.updatedAt || dest.createdAt),
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Destination sitemap fetch failed:', error)
  }

  try {
    const data = await getPackageList()
    const pkgListData = data?.data
    if (Array.isArray(pkgListData)) {
      packageRoutes = pkgListData.map((pkg) => ({
        url: `${baseUrl}/package/${pkg.slug}`,
        lastModified: new Date(pkg.updatedAt || pkg.createdAt),
        priority: 0.9,
      }))
    }
  } catch (error) {
    console.error('Package sitemap fetch failed:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...destinationRoutes, ...packageRoutes]
}
