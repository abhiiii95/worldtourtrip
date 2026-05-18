import HomePage from "@/Components/HomeModule/Home/HomePage";
import { BaseUrl } from "@/static/static";
export const metadata = {
  title: "World Tour Trip – Best Travel Guides, Weekend Trips & Budget Travel",
  description:
    "Explore India with World Tour Trip — your guide to weekend trips, budget travel, itineraries, hotel recommendations, and real travel tips.",
  keywords: [
    "travel india",
    "weekend trips",
    "budget travel",
    "itineraries",
    "best places to visit",
    "travel tips",
    "World Tour Trip",
  ],
  alternates: {
    canonical: BaseUrl,
  },

};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
