import React from "react";
import styles from "./homeWhyChoose.module.scss";
import { Icon } from "@iconify/react";

const HomeWhyChoose = () => {
    
  const data = [
    {
      id: 1,
      icon: <Icon icon="fluent:person-info-20-regular" width="24" height="24" />,
      heading: "Authentic Information",
      body: "Our writers have physically been to the places they describe. That ground-level knowledge is baked into everything we publish — and you can feel it when you read.",
      accent: "01",
    },
    {
      id: 2,
      icon: <Icon icon="streamline-ultimate:information-desk-customer" width="24" height="24" />,
      heading: "Accurate Details",
      body: "No brand deals, no affiliate structures, no hidden agenda shaping our opinions. We write about travel because we love it, full stop.",
      accent: "02",
    },
    {
      id: 3,
      icon: <Icon icon="prime:gift" width="24" height="24" />,
      heading: "Free Knowledge",
      body: "Every guide, every article, every tip we put out is sitting right there waiting for you the moment you arrive. Free today, free always.",
      accent: "03",
    },
    // {
    //   id: 4,
    //   icon: <Icon icon="majesticons:timer-line" width="24" height="24" />,
    //   heading: "Every Article Earned Its Place",
    //   body: "Nothing goes up on WorldTourTrip just to fill space. We are interested in writing that actually does something for the person reading it — and we hold that standard every single time.",
    //   accent: "04",
    // },
  ];
  return (
    <section className={styles?.whyWrapper}>
      <div className="container">
        <h2 className={styles?.heading}>
          Why <span>Choose</span> Us
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
