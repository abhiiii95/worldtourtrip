import { getBlogList } from "@/services/blogservices"


export default async function sitemap() {
  const baseUrl = 'https://worldtourtrip.com'

  // 1. Static routes
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

  // 2. Dynamic blog routes
  let blogRoutes = []

  try {
    const data = await getBlogList()
    const blogListData = data?.data

    if (Array.isArray(blogListData)) {
      blogRoutes = blogListData.map((blog) => ({
        url: `${baseUrl}/blog/${blog.routPath}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        priority: 0.64,
      }))
    }
  } catch (error) {
    console.error('Blog sitemap fetch failed:', error)
  }

  return [...staticRoutes, ...blogRoutes]
}