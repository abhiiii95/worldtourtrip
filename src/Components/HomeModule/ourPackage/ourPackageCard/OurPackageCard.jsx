"use client";

import React from "react";
import styles from "./ourPackageCard.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const OurPackageCard = ({
  image = "/images/ladakh.webp",
  title = "Tour Package",
  location = "India",
  duration = "—",
  users = "2+ Pax",
  price = "₹9,999",
  originalPrice = null,
  slug = "package",
  badge = null,
  rating = 4.8,
}) => {
  const discount = originalPrice
    ? Math.round(((Number(originalPrice.toString().replace(/[^0-9]/g, "")) - Number(price.toString().replace(/[^0-9]/g, ""))) / Number(originalPrice.toString().replace(/[^0-9]/g, ""))) * 100)
    : null;

  return (
    <Link href={`/package/${slug}`} className={styles.card}>
      {/* Image Section */}
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill className={styles.image} sizes="(max-width:580px) 100vw, (max-width:991px) 50vw, 25vw" />
        <div className={styles.overlay} />

        {/* Top badges */}
        <div className={styles.topRow}>
          {badge && <span className={styles.badge}>{badge}</span>}
          {discount > 0 && <span className={styles.discountBadge}>-{discount}% OFF</span>}
        </div>

        {/* Floating price tag */}
        <div className={styles.priceTag}>
          {originalPrice && <span className={styles.origPrice}>{originalPrice}</span>}
          <span className={styles.priceFrom}>Starting from</span>
          <span className={styles.priceVal}>{price}</span>
          <span className={styles.priceSub}>per person</span>
        </div>

        {/* Bottom info strip on image */}
        <div className={styles.imageBottom}>
          <span className={styles.ratingChip}>
            <Icon icon="mdi:star" width={12} />
            {rating}
          </span>
          <span className={styles.durationChip}>
            <Icon icon="mdi:clock-fast" width={12} />
            {duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.locationRow}>
          <span className={styles.locationDot} />
          <span className={styles.locationText}>{location}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.footer}>
          <span className={styles.pax}>
            <Icon icon="mdi:account-group-outline" width={14} />
            {users}
          </span>
          <span className={styles.bookBtn}>
            Explore <Icon icon="mdi:arrow-right" width={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OurPackageCard;
