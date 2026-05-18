import { getBlogList } from "@/services/blogservices";
import { getDestinationList } from "@/services/destinationapi";
import { getPackageList } from "@/services/packageServices";

const fallbackDate = new Date('2026-03-20T18:08:11+00:00');

function safeDate(val) {
  if (!val) return fallbackDate;
  const d = new Date(val);
  return isNaN(d.getTime()) ? fallbackDate : d;
}

export default async function sitemap() {
  const baseUrl = 'https://worldtourtrip.com'

  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: fallbackDate, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: fallbackDate, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: fallbackDate, priority: 0.8 },
    { url: `${baseUrl}/destination`, lastModified: fallbackDate, priority: 0.8 },
    { url: `${baseUrl}/package`, lastModified: fallbackDate, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: fallbackDate, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: fallbackDate, priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: fallbackDate, priority: 0.8 },
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
        }))
    }
  } catch (error) {
    console.error('Package sitemap fetch failed:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...destinationRoutes, ...packageRoutes]
}
