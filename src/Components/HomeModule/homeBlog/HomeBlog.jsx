import React from 'react';
import styles from "./homeBlog.module.scss";
import { getBlogList } from '@/services/blogservices';
import BlogCard from '@/Components/blogModule/blogCard/BlogCard';
import Link from 'next/link';

const HomeBlog = async() => {
const data = await getBlogList();
const blogListData = data?.data ;
  return (
    <section className={styles?.homeBlog}>
      <div className='container'>
        <div className={styles?.headingWrapper}>
            <h4 className={styles?.heading}>Our <span>Blogs</span></h4>
            <Link href="/blog" className={styles?.viewText}>View All</Link>
        </div>
      <div className={styles?.blogRow}>
      {blogListData.slice(0,3)?.map((val, i) => {
              return (
                <div className={styles?.blogItem} key={i}>
                  <BlogCard {...val} />
                </div>
              );
            })}
      </div>
      </div>
    </section>
  )
}

export default HomeBlog
