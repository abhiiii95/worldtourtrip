import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from "./destinationDetail.module.scss"

const RecentDestinationCard = ({title,imgageAlt,routPath,thumbnail}) => {
  return (
    <Link href={`/destination/${routPath}`} className={styles?.recentCard}>
      <span className={styles?.imageWrapper}>
        <Image src={thumbnail} alt={imgageAlt} fill unoptimized priority quality={100}/>
      </span>
      <span className={styles?.titleText}>{title}</span>
    </Link>
  )
}

export default RecentDestinationCard
