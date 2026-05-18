import React from 'react';
import styles from "./blogCard.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate } from '@/static/static';
import defaultBlog from "../../../../public/images/default-blog.webp";

const BlogCard = ({ title, routPath, description, thumbnail, imgageAlt, updatedAt }) => {
  return (
    <div className={styles.blogCard}>
      <Link href={`/blog/${routPath}`} className={styles.imageWrapper}>
        <Image
          src={thumbnail || defaultBlog}
          alt={imgageAlt || title}
          fill
          quality={85}
          fetchPriority="high"
          className={styles.image}
          sizes="(max-width:580px) 100vw, (max-width:991px) 50vw, 33vw"
        />
        <div className={styles.overlay} />
        <span className={styles.dateText}>{formatBlogDate(updatedAt)}</span>
      </Link>

      <div className={styles.body}>
        <h5 className={styles.title}>
          <Link href={`/blog/${routPath}`}>{title}</Link>
        </h5>
        <p className={styles.desc}>{description}</p>
        <Link href={`/blog/${routPath}`} className={styles.readMore}>
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
