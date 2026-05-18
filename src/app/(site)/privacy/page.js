import Privacy from '@/Components/PrivacyModule/Privacy/Privacy'
import { BaseUrl } from '@/static/static';
import React from 'react'
export const metadata = {
    title: "Privacy Policy – Flight & Hotel Booking Platform",
    description:
      "Learn how we collect, use, and protect your personal information when booking flights, hotels, and holiday packages through our online travel platform.",
    alternates: {
        canonical: `${BaseUrl}/privacy`,
      },
  
  };

const PrivacyPage = () => {
  return (
    <>
      <Privacy />
    </>
  )
}

export default PrivacyPage
