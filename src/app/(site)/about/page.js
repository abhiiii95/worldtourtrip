import About from '@/Components/AboutModule/About/About'
import { BaseUrl } from '@/static/static';
import React from 'react'

export const metadata = {
  title: "World Tour Trip – Online Flight Booking, Hotel Booking & Holiday Packages",
  description:
    "Discover World Tour Trip, a premium online travel agency offering seamless flight booking, hotel reservations, and curated holiday packages. Book your trips easily, securely, and with trusted recommendations.",
  keywords: [
    "Online travel agency",
    "Flight booking",
    "Hotel booking",
    "Holiday packages",
    "best places to visit",
    "Travel platform",
    "Book flights and hotels",
  ],
  alternates: {
    canonical: `${BaseUrl}/about`,
  },

};

const AboutPage = () => {
  return (
    <>
     <About />
    </>
  )
}

export default AboutPage
