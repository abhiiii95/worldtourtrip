import HomePage from "@/Components/HomeModule/Home/HomePage";
import { BaseUrl } from "@/static/static";
import Script from "next/script";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "World Tour Trip – Best Travel Packages & Holiday Tours India" },
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "World Tour Trip",
  url: "https://www.worldtourtrip.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.worldtourtrip.com/logo.svg",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-XXXXXXXXXX",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.facebook.com/worldtourtrip",
    "https://www.instagram.com/worldtourtrip",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "World Tour Trip",
  url: "https://www.worldtourtrip.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.worldtourtrip.com/package?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePage />
    </>
  );
}
