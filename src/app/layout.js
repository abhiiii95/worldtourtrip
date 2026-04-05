import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import "../../src/Common/styles/global.scss"
import Header from "@/Common/Components/Header/Header";
import Footer from "@/Common/Components/Footer/Footer";
import Script from "next/script";
export const dynamic = "force-dynamic";


const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={baiJamjuree.variable}>
          {/* Google Analytics */}
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}