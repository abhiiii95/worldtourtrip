import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import React from "react";
import styles from "./blogDetail.module.scss";
import { BaseUrl, getDatePart, removeInlineStyles } from "@/static/static";
import { Icon } from "@iconify/react";
import Image from "next/image";
import FaqSection from "@/Components/faqSection/FaqSection";
import RecentBlogCard from "./RecentBlogCard";
import Script from "next/script";

const BlogDetail = ({ data, blog, allblog }) => {
  const blogData = data?.data;
  const cleanContent = removeInlineStyles(blogData?.content?.content);
  console.log(blogData,"blogData")
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
  // === faq schema 
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data?.faq?.faqs.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.faqAnswer
      }
    }))
  };
  // === blog schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
  
    headline: blogData?.title,
    description: blogData?.description,
  
    image: [
      blogData?.thumbnail // must be array
    ],
  
    datePublished: blogData?.createdAt,
    dateModified: blogData?.updatedAt,
  
    author: {
      "@type": "Person",
      name: blogData?.author?.authorName || "Admin"
    },
  
    publisher: {
      "@type": "Organization",
      name: "WorldTourTrip", // keep brand name fixed (important)
      logo: {
        "@type": "ImageObject",
        url: `${BaseUrl}/logo.svg` // add your actual logo URL
      }
    },
  
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BaseUrl}/blog/${blogData?.routPath}`
    },
  
    articleSection: "Travel",
  
    keywords: blogData?.metaKeywords || "travel, tourism, blog",
  
    inLanguage: "en"
  };
  // === bread crumb schema
  const breadSchema ={
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BaseUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${BaseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blogData?.title,
        "item": `${BaseUrl}/blog/${blogData?.routPath}`
      }
    ]
  }
  return (
    <>
      <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadSchema) }}
        />
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
                dangerouslySetInnerHTML={{ __html: cleanContent }}
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
