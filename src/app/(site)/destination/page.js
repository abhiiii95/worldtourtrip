import Blog from "@/Components/blogModule/Blog";
import Destination from "@/Components/destination/Destination";
import { BaseUrl } from "@/static/static";
import React from "react";
// app/blog/page.jsx

export const metadata = {
  title: 'Top Travel Destinations — Explore Best Places in India & Abroad | World Tour Trip',
  
  description:
    'Explore top travel destinations in India and worldwide. Find best places to visit, destination guides, itinerary ideas, and tour packages to plan your perfect trip.',
  
  keywords: [
    'travel destinations',
    'best places to visit',
    'tourist destinations India',
    'international travel destinations',
    'holiday destinations',
    'popular destinations India',
    'destination guides',
    'trip destinations worldwide',
    'vacation spots India',
  ],

  alternates: {
    canonical: `${BaseUrl}/destination`,
  },
};

const DestinationPage = () => {
  return (
    <>
      <Destination />
    </>
  );
};

export default DestinationPage;

