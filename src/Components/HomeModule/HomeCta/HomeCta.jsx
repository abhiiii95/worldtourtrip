import React from 'react';
import styles from './homeCta.module.scss';
import Link from 'next/link';

const HomeCta = () => {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2>Ready to Plan Your Dream Trip?</h2>
            <p>
              Talk to our travel experts for free. We&apos;ll craft a personalised
              itinerary that fits your budget, dates, and travel style.
            </p>
          </div>
          <div className={styles.actions}>
            <Link href="/package" className={styles.btnPrimary}>
              Browse Packages
            </Link>
            <Link href="/contact" className={styles.btnOutline}>
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;
