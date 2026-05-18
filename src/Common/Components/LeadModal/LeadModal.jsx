"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import LeadForm from "../LeadForm/LeadForm";
import styles from "./leadModal.module.scss";

export default function LeadModal({ prefillDest = "", onClose }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry form"
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <Icon icon="mdi:close" width={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Icon icon="mdi:map-search-outline" width={32} />
          </div>
          <h2>We&apos;ll Build It For You!</h2>
          <p>
            We don&apos;t have a listed package for <strong>&quot;{prefillDest}&quot;</strong> yet,
            but our experts can craft a custom itinerary just for you.
          </p>
        </div>

        <div className={styles.formWrap}>
          <LeadForm
            title="Request Custom Package"
            subtitle="Tell us your requirements — we'll call back in 2 hours"
            source="search-no-result"
            prefillDest={prefillDest}
            noCard
          />
        </div>
      </div>
    </div>
  );
}
