import Contact from '@/Components/ContactModule/Contact/Contact'
import { BaseUrl } from '@/static/static';
import React from 'react'

export const metadata = {
    title: "Contact Us – Online Travel Support, Flight & Hotel Booking Assistance",
    description:
      "Reach out to our team for support with flight bookings, hotel reservations, holiday packages, or any travel-related inquiries. We’re here to help you plan your perfect trip.",
    keywords: [
      "Contact travel agency",
      "Travel support",
      "Flight booking assistance",
      "Hotel reservation help",
      "Travel inquiry",
      "Customer support travel",
      "Holiday package assistance",
      "Online travel help"
    ],
    alternates: {
      canonical: `${BaseUrl}/contact`,
    },
  
  };

const ContactPage = () => {
  return (
    <>
      <Contact />
    </>
  )
}

export default ContactPage
