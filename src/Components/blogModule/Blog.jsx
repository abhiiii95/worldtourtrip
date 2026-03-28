import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import Link from "next/link";
import React from "react";
import BlogCard from "./blogCard/BlogCard";
import styles from "./blog.module.scss";
import { getBlogList } from "@/services/blogservices";

const Blog = async () => {
const data = await getBlogList();
const blogListData = data?.data ;
 
  const bannerData = [
    {
      id: 1,
      route: "",
      routeText: "Blogs",
    },
  ];


  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={"Blogs"} 
      />
      <section className={styles?.blogWrapper}>
        <div className="container">
          <div className={styles?.blogContent}>
            {blogListData?.map((val, i) => {
              return (
                <div className={styles?.blogItem} key={i}>
                  <BlogCard {...val} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
