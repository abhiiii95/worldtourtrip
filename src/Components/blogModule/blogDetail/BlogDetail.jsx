import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import React from "react";
import styles from "./blogDetail.module.scss";
import { getDatePart } from "@/static/static";
import { Icon } from "@iconify/react";
import Image from "next/image";
import FaqSection from "@/Components/faqSection/FaqSection";
import RecentBlogCard from "./RecentBlogCard";

const BlogDetail = ({ data, blog, allblog }) => {
  const blogData = data?.data;
  const bannerData = [
    {
      id: 1,
      route: "/blog",
      routeText: "Blogs",
    },
    {
      id: 2,
      route: "/blog",
      routeText: blogData?.title,
    },
  ];

  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={blogData?.title}
        bannerData={blogData}
      />
      <section className={styles?.blogWrapper}>
        <div className="container">
          <div className={styles?.rows}>
            <div className={styles?.leftContent}>
              <div className={styles?.blogDateWrapper}>
                <div className={styles?.date}>
                  <span className={styles?.getDate}>
                    {getDatePart(blogData?.updatedAt, "day")}
                  </span>

                  <span className={styles?.month}>
                    {getDatePart(blogData?.updatedAt, "month")},{" "}
                    {getDatePart(blogData?.updatedAt, "year")}
                  </span>
                </div>
                <p className={styles?.category}>
                  <Icon icon="wordpress:category" width="24" height="24" />
                  {blogData?.category?.categoryName}
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
                dangerouslySetInnerHTML={{ __html: blogData?.content?.content }}
              />
              {data?.faq?.faqs && <FaqSection faqs={data?.faq?.faqs} />}
            </div>
            {allblog.length > 1 && (
              <div className={styles?.rightContent}>
                <h5 className={styles?.recentArticleHeading}>
                  Recent Articles
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

export default BlogDetail;
