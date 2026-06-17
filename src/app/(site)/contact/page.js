import Contact from '@/Components/ContactModule/Contact/Contact'
import { BaseUrl } from '@/static/static'
import React from 'react'
import Script from 'next/script'

export const metadata = {
  title: "Contact Us – Travel Support & Holiday Booking Assistance",
  description:
    "Reach out to our team for support with flight bookings, hotel reservations, holiday packages, or any travel-related inquiries. We're here to help you plan your perfect trip.",
  keywords: [
    "Contact travel agency",
    "Travel support",
    "Flight booking assistance",
    "Hotel reservation help",
    "Travel inquiry",
    "Customer support travel",
    "Holiday package assistance",
    "Online travel help",
  ],
  alternates: {
    canonical: `${BaseUrl}contact`,
  },
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "World Tour Trip",
  url: "https://www.worldtourtrip.com",
  logo: "https://www.worldtourtrip.com/logo.svg",
  image: "https://www.worldtourtrip.com/images/og-default.jpg",
  description:
    "World Tour Trip offers handcrafted holiday packages, weekend trips, and tour packages across India and abroad.",
  telephone: "+91-XXXXXXXXXX",
  email: "info@worldtourtrip.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.facebook.com/worldtourtrip",
    "https://www.instagram.com/worldtourtrip",
  ],
}

const ContactPage = () => {
  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Contact />
    </>
  )
}

export default ContactPage
