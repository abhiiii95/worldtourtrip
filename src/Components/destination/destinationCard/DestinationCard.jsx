import React from 'react';
import styles from "./destinationCard.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import defaultBlog from "../../../../public/images/default-blog.webp";

const DestinationCard = ({imgageAlt,
  routPath,
  thumbnail,
  title}) => {
  return (
    <div className={styles?.destinationCard}>
      <Link href={`/destination/${routPath}`} className={styles?.imageWrapper}>
        <Image src={thumbnail ?thumbnail :defaultBlog} alt={imgageAlt} fill quality={100} fetchPriority='high' />
      {/* <span className={styles?.dateText}>{formatBlogDate(updatedAt)}</span> */}
      </Link>
      <h5 className={styles?.title}>
        <Link href={`/destination/${routPath}`}>
            {
                title
            }
        </Link>
      </h5>
      {/* <p className={styles?.desc}>{description}</p> */}
    </div>
  )
}

export default DestinationCard
