'use client'
import { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./faq.module.scss";

const FaqSection = ({ faqs }) => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqWrapper}>
        <h3>Frequently Asked Questions</h3>

      {faqs.map((item, index) => (
        <div key={index} className={styles.faqItem}>

          <div
            className={styles.faqQuestion}
            onClick={() => toggleFAQ(index)}
          >
            <span>{item.question}</span>

            <Icon
              icon="mdi:chevron-down"
              className={`${styles.chevron} ${
                activeIndex === index ? styles.rotate : ""
              }`}
              width="22"
            />
          </div>

          {activeIndex === index && (
            <div className={styles.faqAnswer} dangerouslySetInnerHTML={{__html:item.answer}} />
          )}

        </div>
      ))}

    </div>
  );
};

export default FaqSection;