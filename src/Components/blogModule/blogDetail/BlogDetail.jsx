import AboutBanner from '@/Common/Components/AboutBanner/AboutBanner';
import React from 'react'



const BlogDetail = () => {
    const bannerData = [
        {
          id: 1,
          route: "/blog",
          routeText: "Blogs",
        },
        {
          id: 2,
          route: "",
          routeText: "Blogs",
        },
      ];
  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={"About Us – Your Trusted Travel Booking Platform"}
      />
    </>
  )
}

export default BlogDetail
