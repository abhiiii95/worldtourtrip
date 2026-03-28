import React from 'react'
import HomeBanner from '../HomeBanner/HomeBanner'
import HomeDestinations from '../HomeDestinations/HomeDestinations'
import HomeAbout from '../HomeAbout/HomeAbout'
import HomeBlog from '../homeBlog/HomeBlog'

const HomePage = () => {

  return (
    <>
     <HomeBanner /> 
     <HomeDestinations />
     {/* <HomeAbout /> */}
     <HomeBlog />
    </>
  )
}

export default HomePage
