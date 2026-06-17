import PackageListing from "@/Components/packageModule/PackageListing";
import { BaseUrl } from "@/static/static";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tour Packages – Best Travel Packages in India",
  description:
    "Browse handcrafted tour packages across India — Leh Ladakh, Kerala, Goa, Rajasthan & more. Filter by destination, duration, and budget. Get a free quote today.",
  keywords: [
    "tour packages India",
    "travel packages",
    "holiday packages India",
    "Leh Ladakh package",
    "Kerala tour package",
    "Goa holiday package",
    "budget tour packages",
    "honeymoon packages India",
  ],
  alternates: {
    canonical: `${BaseUrl}package`,
  },
  openGraph: {
    title: "Tour Packages – Best Travel Packages in India | World Tour Trip",
    description:
      "Browse handcrafted tour packages across India — Leh Ladakh, Kerala, Goa, Rajasthan & more. Filter by destination, duration, and budget.",
    url: `${BaseUrl}package`,
    siteName: "World Tour Trip",
    images: [
      {
        url: `${BaseUrl}images/ladakh.webp`,
        width: 1200,
        height: 630,
        alt: "Tour Packages – World Tour Trip",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Packages – Best Travel Packages in India | World Tour Trip",
    description:
      "Browse handcrafted tour packages across India — Leh Ladakh, Kerala, Goa, Rajasthan & more.",
    images: [`${BaseUrl}images/ladakh.webp`],
  },
};

const PackagePage = () => {
  return <PackageListing />;
};

export default PackagePage;
