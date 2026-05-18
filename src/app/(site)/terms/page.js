import TermsConditions from '@/Components/TermsConditions/TermsConditions';
import { BaseUrl } from '@/static/static';
import React from 'react'

export const metadata = {
    title: "Terms and Conditions – Flight & Hotel Booking Policies",
    description:
      "Read the terms and conditions for flight bookings, hotel reservations, and holiday packages. Learn about payments, cancellations, refunds, and travel policies before booking.",
    alternates: {
        canonical: `${BaseUrl}/terms`,
      },
  
  };

const TermsPage = () => {
  return (
    <>
      <TermsConditions />
    </>
  )
}

export default TermsPage
