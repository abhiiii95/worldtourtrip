"use client";

import styles from "./TourDetail.module.scss";
import TourInfo from "./TourInfo";
import BookingCard from "./BookingCard";

export default function TourDetail({ pkg }) {
  return (
    <div className={styles.tourPage}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <main className={styles.mainContent}>
            <TourInfo pkg={pkg} />
          </main>
          <aside className={styles.sidebar}>
            <BookingCard packageTitle={pkg?.title || ""} />
          </aside>
        </div>
      </div>
    </div>
  );
}
