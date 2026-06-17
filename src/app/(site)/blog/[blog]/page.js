import BlogDetail from '@/Components/blogModule/blogDetail/BlogDetail'
import { getBlogList, getDetailBlog } from '@/services/blogservices'
import { BaseUrl } from '@/static/static'
import React from 'react'

export const revalidate = 3600

export async function generateStaticParams() {
  const data = await getBlogList()
  return (data?.data || [])
    .filter(b => b?.routPath)
    .map(b => ({ blog: b.routPath }))
}

const BlogDetailPage = async({params}) => {
    const {blog} = await params
    const data = await getDetailBlog(blog);
    const allblog = await getBlogList();
    const blogListData =allblog?.data ;

  return (
    <>
    <BlogDetail data={data} blog={blog} allblog={blogListData}/>
    </>
  )
}

export default BlogDetailPage;
export async function generateMetadata({ params }) {
  const {blog} = await params
  const data = await getDetailBlog(blog);
  const blogData = data?.data;

  const title = blogData?.metaTitle;
  const description = blogData?.metaDescription;
  const canonical = `${BaseUrl}blog/${blog}`;
  const image = blogData?.thumbnail || `${BaseUrl}images/og-default.jpg`;

  return {
    title,
    description,
    keywords: blogData?.metaKeywords?.split(',').map(k => k.trim()) ?? [],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "World Tour Trip",
      type: "article",
      locale: "en_IN",
      publishedTime: blogData?.createdAt,
      modifiedTime: blogData?.updatedAt,
      authors: [blogData?.author?.authorName || "World Tour Trip"],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
