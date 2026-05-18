import BlogDetail from '@/Components/blogModule/blogDetail/BlogDetail'
import { getBlogList, getDetailBlog } from '@/services/blogservices'
import React from 'react'

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

  return {
    title: blogData?.metaTitle,
    description: blogData?.metaDescription,
    keywords: [blogData?.metaKeywords]
  };
}
