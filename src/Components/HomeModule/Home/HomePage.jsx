import React from 'react'
import HomeBanner from '../HomeBanner/HomeBanner'
import HomeDestinations from '../HomeDestinations/HomeDestinations'
import HomeAbout from '../HomeAbout/HomeAbout'
import HomeBlog from '../homeBlog/HomeBlog'
import HomeWhyChoose from '../homeWhyChoose/HomeWhyChoose'
import NewsLetter from '../newsLetter/NewsLetter'

const HomePage = () => {

  return (
    <>
     <HomeBanner /> 
     <HomeDestinations />
     {/* <HomeAbout /> */}
     <HomeWhyChoose />
     <HomeBlog />
     <NewsLetter />
    </>
  )
}

export default HomePage
