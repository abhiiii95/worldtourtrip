import React from 'react';
import styles from "./ourPackage.module.scss";
import Link from 'next/link';
import { getPackageList } from '@/services/packageServices';
import OurPackageCard from './ourPackageCard/OurPackageCard';

const OurPackage = async () => {
  const res = await getPackageList({ popular: "true", limit: 4 });
  const packages = res?.data || [];

  return (
    <section className={styles.ourPackage}>
      <div className='container'>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.heading}>Most Popular <span>Packages</span></h2>
            <p className={styles.subheading}>Handpicked tours loved by thousands of Indian travelers</p>
          </div>
          <Link href="/package" className={styles.viewAll}>
            View All Packages →
          </Link>
        </div>

        {packages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No packages available yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.wrapper}>
            {packages.map((pkg) => (
              <div className={styles.cardItem} key={pkg._id || pkg.slug}>
                <OurPackageCard
                  image={pkg.thumbnail || "/images/ladakh.webp"}
                  title={pkg.title}
                  location={pkg.location}
                  duration={pkg.subtitle || `${pkg.duration} Days`}
                  users={pkg.groupSize || "2+ Pax"}
                  price={`₹${(Number(pkg.price) + Number(pkg.margin || 0)).toLocaleString("en-IN")}`}
                  originalPrice={pkg.originalPrice ? `₹${Number(pkg.originalPrice).toLocaleString("en-IN")}` : null}
                  slug={pkg.slug}
                  badge={pkg.badge}
                  rating={pkg.rating}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurPackage;
