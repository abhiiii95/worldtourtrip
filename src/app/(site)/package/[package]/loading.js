import styles from "./packageLoading.module.css";

export default function PackageLoading() {
  return (
    <div className={styles.wrapper}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb} />

      <div className={styles.container}>
        {/* Category tag + title */}
        <div className={styles.tag} />
        <div className={styles.title} />
        <div className={styles.titleShort} />

        {/* Meta row */}
        <div className={styles.metaRow}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.metaChip} />)}
        </div>

        {/* Price strip */}
        <div className={styles.priceStrip} />

        {/* Gallery skeleton */}
        <div className={styles.gallery}>
          <div className={`${styles.galleryItem} ${styles.large}`} />
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.galleryItem} />
          ))}
        </div>

        {/* Content rows */}
        <div className={styles.contentRow}>
          <div className={styles.contentLeft}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.line} style={{ width: i % 3 === 2 ? "70%" : "100%" }} />
            ))}
          </div>
          <div className={styles.contentRight}>
            <div className={styles.card} />
            <div className={styles.card} />
          </div>
        </div>
      </div>
    </div>
  );
}
