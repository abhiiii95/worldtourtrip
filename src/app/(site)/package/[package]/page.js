import PackageDetail from '@/Components/packageDetail/PackageDetail';
import { getPackageBySlug } from '@/services/packageServices';
import { BaseUrl } from '@/static/static';

export async function generateMetadata({ params }) {
  const { package: slug } = await params;
  const res = await getPackageBySlug(slug);
  const pkg = res?.data;

  if (!pkg) {
    return {
      title: "Package Not Found | World Tour Trip",
      description: "The requested tour package could not be found.",
    };
  }

  const title = `${pkg.title} | World Tour Trip`;
  const description = pkg.subtitle
    ? `${pkg.subtitle} — Book now starting from ₹${Number(pkg.price).toLocaleString("en-IN")} per person. ${pkg.location ? `Explore ${pkg.location}.` : ""}`
    : `Explore ${pkg.title} starting from ₹${Number(pkg.price).toLocaleString("en-IN")} per person. Book your dream holiday with World Tour Trip.`;

  const image = pkg.gallery?.[0] || `${BaseUrl}images/ladakh.webp`;
  const canonical = `${BaseUrl}package/${slug}`;

  return {
    title,
    description,
    keywords: [
      pkg.title,
      pkg.location,
      pkg.category,
      "tour package India",
      "holiday package",
      "World Tour Trip",
    ].filter(Boolean),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "World Tour Trip",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pkg.title,
        },
      ],
      type: "article",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const PackageDetailPage = async ({ params }) => {
  const path = await params;
  return <PackageDetail path={path} />;
};

export default PackageDetailPage;
