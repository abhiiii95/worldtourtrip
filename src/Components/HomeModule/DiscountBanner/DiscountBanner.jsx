import React from 'react';
import Link from 'next/link';
import styles from './discountBanner.module.scss';

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    label: 'Global Destinations',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: 'Expert Local Guides',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: 'Tailored Itineraries',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    label: 'Best Price Promise',
  },
];

const DiscountBanner = () => {
  return (
    <section className={styles.wrapper}>
      <span className={styles.blob1} aria-hidden="true" />
      <span className={styles.blob2} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <div className={styles.badge}>
            <span className={styles.pulse} />
            Now Accepting Bookings
          </div>
          <h2 className={styles.headline}>
            Your Next Adventure <span className={styles.accent}>Starts Here</span>
          </h2>
          <p className={styles.sub}>
            Handcrafted journeys built around you — from mountain trails to coastal escapes.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.pills}>
            {features.map((f) => (
              <span key={f.label} className={styles.pill}>
                <span className={styles.pillIcon}>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href="/package" className={styles.ctaPrimary}>
              Browse Packages
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountBanner;
