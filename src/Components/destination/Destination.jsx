import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import Link from "next/link";
import React from "react";
import styles from "./destination.module.scss";
import { getDestinationList } from "@/services/destinationapi";
import DestinationCard from "./destinationCard/DestinationCard";

const Destination = async () => {
const data = await getDestinationList();
const destinationListData = data?.destinations ;
 
  const bannerData = [
    {
      id: 1,
      route: "",
      routeText: "Destination",
    },
  ];


  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={"Destination"} 
      />
      <section className={styles?.destinationWrapper}>
        <div className="container">
        <h4 className={styles?.heading}>Most Popular <span>Destinations</span></h4>

          <div className={styles?.destinationContent}>
            {destinationListData?.map((val, i) => {
              return (
                <div className={styles?.destinationItem} key={i}>
                  <DestinationCard {...val} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Destination;
