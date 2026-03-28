import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import React from "react";
import styles from "./destinationDetail.module.scss";
import { BaseUrl, getDatePart, removeInlineStyles } from "@/static/static";
import { Icon } from "@iconify/react";
import Image from "next/image";
import FaqSection from "@/Components/faqSection/FaqSection";
import RecentBlogCard from "./RecentBlogCard";
import Script from "next/script";

const DestinationDetail = ({ data, destination, allblog }) => {
  const destinationData = data?.destinations;
  console.log(destinationData,"destinationData destinationData")
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
            {allblog.length > 1 && (
              <div className={styles?.rightContent}>
                <h5 className={styles?.recentArticleHeading}>
                  Recent Destinations
                </h5>
                <div className={styles?.recentBlogWrapper}>
                  {allblog.filter((item)=>item.routPath !==blog).map((item, i) => (
                    <React.Fragment key={item.id || i}>
                      <RecentBlogCard {...item} />
                      {i !== allblog.length - 1 && (
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
