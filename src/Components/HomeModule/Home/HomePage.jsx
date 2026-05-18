import React from 'react'
import HomeBanner from '../HomeBanner/HomeBanner'
import HomeDestinations from '../HomeDestinations/HomeDestinations'
import HomeBlog from '../homeBlog/HomeBlog'
import HomeWhyChoose from '../homeWhyChoose/HomeWhyChoose'
import NewsLetter from '../newsLetter/NewsLetter'
import OurPackage from '../ourPackage/OurPackage'
import HomeCta from '../HomeCta/HomeCta'
import DiscountBanner from '../DiscountBanner/DiscountBanner'

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <OurPackage />
      <DiscountBanner />
      <HomeDestinations />
      <HomeWhyChoose />
      <HomeCta />
      <HomeBlog />
      <NewsLetter />
    </>
  )
}

export default HomePage
