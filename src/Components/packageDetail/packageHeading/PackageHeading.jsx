import React from 'react';
import styles from "./packageHeading.module.scss";
import { Icon } from '@iconify/react';
import PhotoGallery from '../photoGallery/PhotoGallery';
import TourDetail from '../TourDetail';
import { getPackageBySlug } from '@/services/packageServices';
import Script from 'next/script';
import { BaseUrl } from '@/static/static';

const PackageHeading = async ({ slug }) => {
  const res = await getPackageBySlug(slug);
  console.log(slug,"slug")
  const pkg = res?.data;

  if (!pkg) {
    return (
      <section className={styles.packageHeading}>
        <div className="container">
          <p style={{ padding: "40px 0", color: "#64748b" }}>Package not found.</p>
        </div>
      </section>
    );
  }

  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.subtitle || pkg.description || pkg.title,
    url: `${BaseUrl}package/${pkg.slug}`,
    image: pkg.gallery?.[0] || pkg.thumbnail || `${BaseUrl}images/og-default.jpg`,
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: pkg.duration || 1,
    },
    offers: {
      "@type": "Offer",
      price: Number(pkg.price) + Number(pkg.margin || 0),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${BaseUrl}package/${pkg.slug}`,
      validFrom: new Date().toISOString().split("T")[0],
    },
    ...(pkg.location && {
      touristType: "Leisure",
      itinerary: {
        "@type": "ItemList",
        numberOfItems: pkg.duration || 1,
        name: `${pkg.title} Itinerary`,
      },
    }),
  };

  return (
    <section className={styles.packageHeading}>
      <Script
        id="schema-tourist-trip"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />
      <div className='container'>
        <span className={styles.categoryTag}>{pkg.category}</span>

        <h1 className={styles.h1}>{pkg.title}</h1>

        <div className={styles.metaRow}>
          {pkg.location && (
            <span className={styles.metaItem}>
              <Icon icon="mdi:map-marker-outline" width="16" height="16" />
              {pkg.location}
            </span>
          )}
          <span className={styles.metaItem}>
            <Icon icon="mdi:clock-outline" width="16" height="16" />
            {pkg.subtitle || `${pkg.duration} Days`}
          </span>
          {pkg.groupSize && (
            <span className={styles.metaItem}>
              <Icon icon="mdi:account-group-outline" width="16" height="16" />
              {pkg.groupSize}
            </span>
          )}
          <span className={styles.metaRating}>
            <Icon icon="mdi:star" width="16" height="16" />
            {pkg.rating || 4.5}
            {pkg.reviews > 0 && <em>({pkg.reviews} reviews)</em>}
          </span>
        </div>

        <div className={styles.priceStrip}>
          <div className={styles.priceInfo}>
            <span className={styles.priceLabel}>Starting from</span>
            <span className={styles.price}>₹{(Number(pkg.price) + Number(pkg.margin || 0)).toLocaleString("en-IN")}</span>
            {pkg.originalPrice && (
              <span className={styles.originalPrice}>₹{Number(pkg.originalPrice).toLocaleString("en-IN")}</span>
            )}
            <span className={styles.pricePer}>/person*</span>
          </div>
          <div className={styles.trustBadges}>
            <span><Icon icon="mdi:shield-check-outline" /> Free Cancellation</span>
            <span><Icon icon="mdi:headset" /> 24/7 Support</span>
            <span><Icon icon="mdi:currency-inr" /> Best Price</span>
          </div>
        </div>

        <PhotoGallery images={pkg.gallery || []} />

        <TourDetail pkg={pkg} />
      </div>
    </section>
  );
};

export default PackageHeading;
