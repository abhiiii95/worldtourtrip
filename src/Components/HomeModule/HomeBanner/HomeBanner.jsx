import React from 'react';
import styles from "./homeBanner.module.scss";
import banner from "../../../../public/images/small-banner.webp";
import Image from 'next/image';
import SearchEngine from '@/Common/Components/SearchEngine/SearchEngine';

const HomeBanner = () => {
  return (
    <section className={styles.HomeBanner}>
      {/* Background image */}
      <div className={styles.banner}>
        <Image src={banner} alt="Explore India with World Tour Trip" fetchPriority="high" fill />
      </div>

      <div className="container">
        <div className={styles.content}>
          <span className={styles.badge}>🇮🇳 India&apos;s Trusted Travel Partner</span>

          <h1 className={styles.headline}>
            Your Next Adventure<br />
            <span>Starts Here</span>
          </h1>

          <p className={styles.subline}>
            Search from 200+ handcrafted packages across India. Can&apos;t find what you need? We&apos;ll build it for you.
          </p>

          {/* Smart search engine */}
          <SearchEngine />

          {/* Trust stats */}
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>5000+</span>
              <span className={styles.trustLabel}>Happy Travelers</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>200+</span>
              <span className={styles.trustLabel}>Packages</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>50+</span>
              <span className={styles.trustLabel}>Destinations</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>4.8★</span>
              <span className={styles.trustLabel}>Avg Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
