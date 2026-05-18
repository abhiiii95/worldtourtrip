import React from 'react'
import BreadPackage from './packageBread/BreadPackage';
import PackageHeading from './packageHeading/PackageHeading';

const PackageDetail = ({path}) => {
  const slug = path?.package || "";
  return (
    <>
      <BreadPackage path={path}/>
      <PackageHeading slug={slug} />
    </>
  )
}

export default PackageDetail
