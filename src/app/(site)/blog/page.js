import Blog from "@/Components/blogModule/Blog";
import { BaseUrl } from "@/static/static";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Travel Blogs – Destination Guides, Trip Tips & Package Ideas',
  description: 'Discover destination guides, budget trip ideas & travel tips for India and abroad. Read travel blogs on World Tour Trip and start planning your next trip.',
  keywords: [
    'travel blogs',
    'travel tips India',
    'destination guides',
    'trip planning India',
    'travel packages India',
    'budget travel India',
    'honeymoon packages India',
    'international tour packages',
    'best places to visit India',
  ],
  alternates: {
    canonical: `${BaseUrl}blog`,
  },
}

const BlogPage = () => {
  return (
    <>
      <Blog />
    </>
  );
};

export default BlogPage;

