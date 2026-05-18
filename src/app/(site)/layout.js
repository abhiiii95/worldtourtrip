import Header from "@/Common/Components/Header/Header";
import Footer from "@/Common/Components/Footer/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
