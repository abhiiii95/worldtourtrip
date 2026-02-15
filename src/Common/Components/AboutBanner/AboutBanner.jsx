import React from "react";
import aboutBanner from "../../../../public/images/aboutBanner.webp";
import Image from "next/image";
import styles from "./aboutBanner.module.scss";
import Link from "next/link";
import { Icon } from "@iconify/react";

const AboutBanner = ({banner,heading}) => {

  return (
    <section className={styles?.aboutBanner}>
      <div className={styles?.imageWrapper}>
        <Image
          src={aboutBanner}
          alt="about-banner"
          fill
          fetchPriority="high"
          quality={100}
        />
      </div>
      <div className={"container"}>
        <div className={styles?.content}>     
        <h1 className={styles?.heading}>
       
          {heading}
        </h1>
        <ul className={styles?.contentUl}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Icon icon="ci:chevron-right-duo" width="18" height="18" />
          </li>
          {banner?.map((val, i) => {
            return (
              <React.Fragment key={i}>
                 {i > 0 && (
                  <li>
                    <Icon icon="ci:chevron-right-duo" width="18" height="18" />
                  </li>
                )}
                {val?.route ? (
                  <li>
                    <Link href={val?.route}>{val?.routeText}</Link>
                  </li>
                ) : (
                  <li>{val?.routeText}</li>
                )}

               
              </React.Fragment>
            );
          })}
        </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;
