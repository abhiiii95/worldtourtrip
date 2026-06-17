import DestinationDetail from '@/Components/destination/destinationDetail/DestinationDetail'
import { getDestinationList, getDetailDestination } from '@/services/destinationapi'
import { BaseUrl } from '@/static/static'
import React from 'react'

export const revalidate = 3600

export async function generateStaticParams() {
  const data = await getDestinationList()
  return (data?.destinations || [])
    .filter(d => d?.routPath)
    .map(d => ({ destination: d.routPath }))
}

const DestinationDetailPage = async({params}) => {
    const {destination} = await params
    const data = await getDetailDestination(destination);
    const allDestination = await getDestinationList();
    const destinationListData =allDestination?.destinations ;

  return (
    <>
    <DestinationDetail data={data} destination={destination} allDest={destinationListData}/>
    </>
  )
}

export default DestinationDetailPage;
export async function generateMetadata({ params }) {
  const {destination} = await params
  const data = await getDetailDestination(destination);
  const destinationgData = data?.destinations;

  const title = destinationgData?.metaTitle;
  const description = destinationgData?.metaDescription;
  const canonical = `${BaseUrl}destination/${destination}`;
  const image = destinationgData?.thumbnail || `${BaseUrl}images/og-default.jpg`;

  return {
    title,
    description,
    keywords: destinationgData?.metaKeywords?.split(',').map(k => k.trim()) ?? [],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "World Tour Trip",
      type: "website",
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
