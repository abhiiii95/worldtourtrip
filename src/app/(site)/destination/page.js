import Destination from "@/Components/destination/Destination";
import { BaseUrl } from "@/static/static";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Top Travel Destinations – Explore Best Places in India & Abroad',
  
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
    canonical: `${BaseUrl}destination`,
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

