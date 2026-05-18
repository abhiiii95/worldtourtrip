import React from 'react';
import styles from "./destinationCard.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import defaultBlog from "../../../../public/images/default-blog.webp";

const DestinationCard = ({ imgageAlt, routPath, thumbnail, title, featured }) => {
  return (
    <Link href={`/destination/${routPath}`} className={styles.card}>
      <div className={`${styles.imageWrap} ${featured ? styles.imageWrapFeatured : ''}`}>
        <Image
          src={thumbnail ? thumbnail : defaultBlog}
          alt={imgageAlt}
          fill
          quality={90}
          fetchPriority="high"
          className={styles.img}
        />
        <div className={styles.overlay} />

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <span className={styles.pin}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </span>
            <h5 className={styles.title}>{title}</h5>
          </div>
          <div className={styles.explore}>
            Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
