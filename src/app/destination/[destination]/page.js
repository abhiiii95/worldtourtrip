import DestinationDetail from '@/Components/destination/destinationDetail/DestinationDetail'
import { getBlogList, getDetailBlog } from '@/services/blogservices'
import { getDestinationList, getDetailDestination } from '@/services/destinationapi'
import React from 'react'

const DestinationDetailPage = async({params}) => {
    const {destination} = await params
    const data = await getDetailDestination(destination);
    const allDestination = await getDestinationList();
    console.log(data,"dest");
    console.log(allDestination,"allDestination");
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

  return {
    title: destinationgData?.metaTitle,
    description: destinationgData?.metaDescription,
    keywords: [destinationgData?.metaKeywords]
  };
}
