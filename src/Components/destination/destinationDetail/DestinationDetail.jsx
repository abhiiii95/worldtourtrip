import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import React from "react";
import styles from "./destinationDetail.module.scss";
import { BaseUrl, getDatePart, removeInlineStyles } from "@/static/static";
import { Icon } from "@iconify/react";
import FaqSection from "@/Components/faqSection/FaqSection";
import RecentDestinationCard from "./RecentDestinationCard";

const DestinationDetail = ({ data, destination, allDest }) => {
  const destinationData = data?.destinations;
  const cleanContent = removeInlineStyles(destinationData?.content);
  const bannerData = [
    {
      id: 1,
      route: "/destination",
      routeText: "Destinations",
    },
    {
      id: 2,
      route: "/destination",
      routeText: destinationData?.title,
    },
  ];
  
  return (
    <>
      
      <AboutBanner
        banner={bannerData}
        heading={destinationData?.title}
        bannerData={destinationData}
      />
      <section className={styles?.blogWrapper}>
        <div className="container">
          <div className={styles?.rows}>
            <div className={styles?.leftContent}>
              <div className={styles?.blogDateWrapper}>
                <div className={styles?.date}>
                  <span className={styles?.getDate}>
                    {getDatePart(destinationData?.updatedAt, "day")}
                  </span>

                  <span className={styles?.month}>
                    {getDatePart(destinationData?.updatedAt, "month")},{" "}
                    {getDatePart(destinationData?.updatedAt, "year")}
                  </span>
                </div>
                <p className={styles?.category}>
                  <Icon icon="wordpress:category" width="24" height="24" />
                  {/* {destinationData?.category?.categoryName} */}
                  Destinations
                </p>
              </div>
              {/* {
                blogData?.thumbnail &&
              <div className={styles?.imageWrapper}>
                <Image src={blogData?.thumbnail} alt={blogData?.imgageAlt} layout="fill" fetchPriority="high" priority quality={100} />
              </div>
              } */}
              <div
                className={styles?.blogContent}
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />
              {data?.faq?.faqs && <FaqSection faqs={data?.faq?.faqs} />}
            </div>
            {allDest.length > 1 && (
              <div className={styles?.rightContent}>
                <h5 className={styles?.recentArticleHeading}>
                  Recent Destinations
                </h5>
                <div className={styles?.recentBlogWrapper}>
                  {allDest.filter((item)=>item.routPath !== destination).map((item, i) => (
                    <React.Fragment key={item.id || i}>
                      <RecentDestinationCard {...item} />
                      {i !== allDest.length - 1 && (
                        <hr className={styles?.hr} />
                      )}
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
