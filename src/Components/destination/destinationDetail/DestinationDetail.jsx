import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import React from "react";
import styles from "./destinationDetail.module.scss";
import { getDatePart, removeInlineStyles } from "@/static/static";
import { Icon } from "@iconify/react";
import FaqSection from "@/Components/faqSection/FaqSection";
import RecentDestinationCard from "./RecentDestinationCard";
import Image from "next/image";
import Link from "next/link";

const DestinationDetail = ({ data, destination, allDest }) => {
  const destinationData = data?.destinations;
  const packages = data?.packages || [];
  const cleanContent = removeInlineStyles(destinationData?.content);

  const bannerData = [
    { id: 1, route: "/destination", routeText: "Destinations" },
    { id: 2, route: `/destination/${destination}`, routeText: destinationData?.title },
  ];

  return (
    <>
      <AboutBanner banner={bannerData} heading={destinationData?.title} bannerData={destinationData} />

      {/* Packages for this destination */}
      {packages.length > 0 && (
        <section className={styles.packagesSection}>
          <div className="container">
            <div className={styles.packagesSectionHead}>
              <h2 className={styles.packagesSectionTitle}>
                Packages in <span>{destinationData?.title}</span>
              </h2>
              <p className={styles.packagesSectionSub}>
                {packages.length} handcrafted {packages.length === 1 ? "package" : "packages"} available
              </p>
            </div>

            <div className={styles.packagesGrid}>
              {packages.map((pkg) => {
                const discount = pkg.originalPrice
                  ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                  : null;
                return (
                  <div key={pkg._id || pkg.slug} className={styles.pkgCard}>
                    <div className={styles.pkgImageWrap}>
                      <Image
                        src={pkg.thumbnail || "/images/ladakh.webp"}
                        alt={pkg.title}
                        fill
                        className={styles.pkgImage}
                      />
                      {pkg.badge && <span className={styles.pkgBadge}>{pkg.badge}</span>}
                      {discount && <span className={styles.pkgDiscount}>-{discount}%</span>}
                    </div>
                    <div className={styles.pkgBody}>
                      <div className={styles.pkgMeta}>
                        <span><Icon icon="mdi:clock-outline" /> {pkg.subtitle || `${pkg.duration} Days`}</span>
                        <span className={styles.pkgRating}><Icon icon="mdi:star" /> {pkg.rating || 4.5}</span>
                      </div>
                      <h3 className={styles.pkgTitle}>{pkg.title}</h3>
                      {pkg.highlights?.length > 0 && (
                        <div className={styles.pkgHighlights}>
                          {pkg.highlights.slice(0, 2).map((h, i) => (
                            <span key={i}><Icon icon="mdi:check-circle-outline" /> {h}</span>
                          ))}
                        </div>
                      )}
                      <div className={styles.pkgFooter}>
                        <div>
                          <span className={styles.pkgFrom}>From</span>
                          <span className={styles.pkgPrice}>₹{Number(pkg.price).toLocaleString("en-IN")}</span>
                          <span className={styles.pkgPer}>/person</span>
                        </div>
                        <Link href={`/package/${pkg.slug}`} className={styles.pkgBtn}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Destination content */}
      <section className={styles.blogWrapper}>
        <div className="container">
          <div className={styles.rows}>
            <div className={styles.leftContent}>
              <div className={styles.blogDateWrapper}>
                <div className={styles.date}>
                  <span className={styles.getDate}>{getDatePart(destinationData?.updatedAt, "day")}</span>
                  <span className={styles.month}>
                    {getDatePart(destinationData?.updatedAt, "month")},{" "}
                    {getDatePart(destinationData?.updatedAt, "year")}
                  </span>
                </div>
                <p className={styles.category}>
                  <Icon icon="wordpress:category" width="24" height="24" />
                  Destinations
                </p>
              </div>

              <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: cleanContent }} />
              {data?.faq?.faqs && <FaqSection faqs={data.faq.faqs} />}
            </div>

            {allDest?.length > 1 && (
              <div className={styles.rightContent}>
                <h5 className={styles.recentArticleHeading}>Other Destinations</h5>
                <div className={styles.recentBlogWrapper}>
                  {allDest.filter((item) => item.routPath !== destination).map((item, i) => (
                    <React.Fragment key={item._id || i}>
                      <RecentDestinationCard {...item} />
                      {i !== allDest.length - 2 && <hr className={styles.hr} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DestinationDetail;
