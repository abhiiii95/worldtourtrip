import React from 'react';
import styles from "./homeDestinations.module.scss";
import { getDestinationList } from '@/services/destinationapi';
import Link from 'next/link';
import DestinationCard from '@/Components/destination/destinationCard/DestinationCard';

const HomeDestinations = async () => {
  const data = await getDestinationList();
  const destinationListData = data?.destinations;

  return (
    <section className={styles.homeDestination}>
      <div className="container">

        <div className={styles.sectionHead}>
          <div className={styles.headLeft}>
            <span className={styles.eyebrow}>Where Do You Want to Go?</span>
            <h2 className={styles.heading}>
              Most Popular <span>Destinations</span>
            </h2>
            <p className={styles.sub}>
              Explore our handpicked collection of breathtaking destinations — from serene mountains to vibrant coastlines.
            </p>
          </div>
          <Link href="/destination" className={styles.viewAll}>
            View All
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className={styles.destWrapper}>
          {destinationListData?.map((val, i) => (
            <div
              key={i}
              className={`${styles.destItem} ${i === 0 ? styles.featured : ''}`}
            >
              <DestinationCard {...val} featured={i === 0} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeDestinations;
