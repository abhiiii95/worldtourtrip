import BlogDetail from '@/Components/blogModule/blogDetail/BlogDetail'
import { getDetailBlog } from '@/services/blogservices'
import React from 'react'

const BlogDetailPage = async({params}) => {
    const path = await params
    const data = await getDetailBlog(path?.blog);
 

  return (
    <>
    <BlogDetail />
    </>
  )
}

export default BlogDetailPage
