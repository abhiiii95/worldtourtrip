import React from "react";
import styles from "./homeWhyChoose.module.scss";
import { Icon } from "@iconify/react";

const HomeWhyChoose = () => {
    
  const data = [
    {
      id: 1,
      icon: <Icon icon="mdi:currency-inr" width="24" height="24" />,
      heading: "Best Price Guarantee",
      body: "We work directly with hotels, transport providers, and local guides — cutting out middlemen so you get the best possible price on every package.",
      accent: "01",
    },
    {
      id: 2,
      icon: <Icon icon="mdi:headset" width="24" height="24" />,
      heading: "24/7 Travel Support",
      body: "Our dedicated travel experts are available round the clock. Whether it's a last-minute change or an on-trip emergency, we've got you covered.",
      accent: "02",
    },
    {
      id: 3,
      icon: <Icon icon="mdi:map-check-outline" width="24" height="24" />,
      heading: "Handcrafted Itineraries",
      body: "Every package is designed by travel experts who have personally visited the destinations — no cookie-cutter tours, just authentic experiences.",
      accent: "03",
    },
    {
      id: 4,
      icon: <Icon icon="mdi:shield-check-outline" width="24" height="24" />,
      heading: "100% Safe & Trusted",
      body: "5000+ happy travelers, verified accommodations, and fully insured trips. Your safety and satisfaction are our top priority on every journey.",
      accent: "04",
    },
  ];
  return (
    <section className={styles?.whyWrapper}>
      <div className="container">
        <h2 className={styles?.heading}>
          Why <span>Book</span> With Us
        </h2>
        <div className={styles?.row}>
          {data?.map((item, i) => {
            return (
              <div className={styles?.cardItem} key={i}>
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardInner}>
                    <span className={styles.watermark} aria-hidden="true">
                      {item.accent}
                    </span>
                    <div className={styles.iconWrap}>
                      {item?.icon}
                    </div>
                    <h3 className={styles.cardHeading}>{item.heading}</h3>

                    <p className={styles.cardBody}>{item.body}</p>
                    <div className={styles.stripe} aria-hidden="true" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChoose;
