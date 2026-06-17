import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import "../../src/Common/styles/global.scss";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.worldtourtrip.com"),
  title: {
    default: "World Tour Trip | Best Travel Packages & Holiday Tours",
    template: "%s | World Tour Trip",
  },
  description:
    "Explore handcrafted travel packages, top destinations, and holiday tours with World Tour Trip. Book affordable trips across India and abroad.",
  keywords: [
    "travel packages",
    "holiday packages",
    "tour packages India",
    "best travel packages",
    "World Tour Trip",
    "affordable trips",
    "holiday tours",
  ],
  authors: [{ name: "World Tour Trip" }],
  creator: "World Tour Trip",
  publisher: "World Tour Trip",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.worldtourtrip.com",
    siteName: "World Tour Trip",
    title: "World Tour Trip | Best Travel Packages & Holiday Tours",
    description:
      "Explore handcrafted travel packages, top destinations, and holiday tours with World Tour Trip.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "World Tour Trip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Tour Trip | Best Travel Packages & Holiday Tours",
    description:
      "Explore handcrafted travel packages, top destinations, and holiday tours with World Tour Trip.",
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={baiJamjuree.variable}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9DTRVJWC5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-W9DTRVJWC5');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
