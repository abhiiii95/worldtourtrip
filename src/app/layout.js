import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import "../../src/Common/styles/global.scss"
import Header from "@/Common/Components/Header/Header";
import Footer from "@/Common/Components/Footer/Footer";

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={baiJamjuree.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}