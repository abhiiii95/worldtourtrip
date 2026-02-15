import React from 'react';
import styles from "./blogCard.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate } from '@/static/static';
import defaultBlog from "../../../../public/images/default-blog.webp";

const BlogCard = ({title,
    routPath,
    description,
    thumbnail,
    imgageAlt,
    updatedAt}) => {
  return (
    <div className={styles?.blogCard}>
      <Link href={`/blog/${routPath}`} className={styles?.imageWrapper}>
        <Image src={thumbnail ?thumbnail :defaultBlog} alt={imgageAlt} fill quality={100} fetchPriority='high' />
      <span className={styles?.dateText}>{formatBlogDate(updatedAt)}</span>
      </Link>
      <h5 className={styles?.title}>
        <Link href={`/blog/${routPath}`}>
            {
                title
            }
        </Link>
      </h5>
      <p className={styles?.desc}>{description}</p>
    </div>
  )
}

export default BlogCard
