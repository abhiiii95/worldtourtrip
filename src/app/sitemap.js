import { getBlogList } from "@/services/blogservices";
import { getDestinationList } from "@/services/destinationapi";
import { getPackageList } from "@/services/packageServices";

function safeDate(val) {
  if (!val) return new Date('2025-01-01');
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date('2025-01-01') : d;
}

export default async function sitemap() {
  const baseUrl = 'https://www.worldtourtrip.com'

  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date('2025-06-01'), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/about`, lastModified: new Date('2025-06-01'), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog`, lastModified: new Date('2025-06-01'), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/destination`, lastModified: new Date('2025-06-01'), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/package`, lastModified: new Date('2025-06-01'), priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/contact`, lastModified: new Date('2025-06-01'), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/privacy`, lastModified: new Date('2025-01-01'), priority: 0.5, changeFrequency: 'yearly' },
    { url: `${baseUrl}/terms`, lastModified: new Date('2025-01-01'), priority: 0.5, changeFrequency: 'yearly' },
  ]

  let blogRoutes = [];
  let destinationRoutes = [];
  let packageRoutes = [];

  try {
    const data = await getBlogList()
    const blogListData = data?.data
    if (Array.isArray(blogListData)) {
      blogRoutes = blogListData
        .filter((blog) => blog?.routPath)
        .map((blog) => ({
          url: `${baseUrl}/blog/${blog.routPath}`,
          lastModified: safeDate(blog.updatedAt || blog.createdAt),
          priority: 0.8,
          changeFrequency: 'weekly',
        }))
    }
  } catch (error) {
    console.error('Blog sitemap fetch failed:', error)
  }

  try {
    const data = await getDestinationList()
    const destListData = data?.destinations;
    if (Array.isArray(destListData)) {
      destinationRoutes = destListData
        .filter((dest) => dest?.routPath)
        .map((dest) => ({
          url: `${baseUrl}/destination/${dest.routPath}`,
          lastModified: safeDate(dest.updatedAt || dest.createdAt),
          priority: 0.8,
          changeFrequency: 'weekly',
        }))
    }
  } catch (error) {
    console.error('Destination sitemap fetch failed:', error)
  }

  try {
    const data = await getPackageList()
    const pkgListData = data?.data
    if (Array.isArray(pkgListData)) {
      packageRoutes = pkgListData
        .filter((pkg) => pkg?.slug)
        .map((pkg) => ({
          url: `${baseUrl}/package/${pkg.slug}`,
          lastModified: safeDate(pkg.updatedAt || pkg.createdAt),
          priority: 0.9,
          changeFrequency: 'daily',
        }))
    }
  } catch (error) {
    console.error('Package sitemap fetch failed:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...destinationRoutes, ...packageRoutes]
}