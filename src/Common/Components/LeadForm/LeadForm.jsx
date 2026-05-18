"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { submitContactForm } from "@/services/contact.services";
import styles from "./leadForm.module.scss";

const initialState = {
  firstName: "",
  phone: "",
  email: "",
  travelDate: "",
};

/**
 * LeadForm — reusable enquiry / lead capture form.
 *
 * Props:
 *  - title        {string}  Card heading
 *  - subtitle     {string}  Sub-heading below title
 *  - source       {string}  Identifies where the lead came from (e.g. "package-detail", "home", "contact")
 *  - prefillDest  {string}  Pre-fill the destination field (e.g. package name)
 *  - compact      {boolean} Smaller padding variant for sidebar use
 */
export default function LeadForm({
  title = "Get Free Quote",
  subtitle = "Our travel experts will call you back within 2 hours",
  source = "contact",
  prefillDest = "",
  compact = false,
  noCard = false,
}) {
  const [formData, setFormData] = useState({
    ...initialState,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await submitContactForm({ ...formData, source, destination: prefillDest });

    if (res?.status) {
      setSuccess(true);
      setFormData({ ...initialState });
    } else {
      setError(res?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className={noCard ? "" : `${styles.card} ${compact ? styles.compact : ""}`}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <Icon icon="mdi:check-circle" width={48} height={48} />
          </div>
          <h3>Thank You!</h3>
          <p>We&apos;ve received your enquiry. Our travel expert will call you within 2 hours.</p>
          <button className={styles.resetBtn} onClick={() => setSuccess(false)}>
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={noCard ? "" : `${styles.card} ${compact ? styles.compact : ""}`}>
      {/* Header — hidden in noCard mode (modal provides its own header) */}
      {!noCard && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${styles.form} ${noCard ? styles.formNoCard : ""}`} noValidate>
        {/* Name + Phone */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="lf-firstName">Your Name *</label>
            <div className={styles.inputWrap}>
              <Icon icon="mdi:account-outline" className={styles.inputIcon} />
              <input
                id="lf-firstName"
                type="text"
                name="firstName"
                placeholder="Full name"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="lf-phone">Phone Number *</label>
            <div className={styles.inputWrap}>
              <Icon icon="mdi:phone-outline" className={styles.inputIcon} />
              <input
                id="lf-phone"
                type="tel"
                name="phone"
                placeholder="+91 8506805391"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="lf-email">Email Address</label>
          <div className={styles.inputWrap}>
            <Icon icon="mdi:email-outline" className={styles.inputIcon} />
            <input
              id="lf-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Travel Date */}
        <div className={styles.field}>
          <label htmlFor="lf-travelDate">Travel Date</label>
          <div className={styles.inputWrap}>
            <Icon icon="mdi:calendar-outline" className={styles.inputIcon} />
            <input
              id="lf-travelDate"
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <>
              <Icon icon="mdi:loading" className={styles.spinner} />
              Sending...
            </>
          ) : (
            <>
              <Icon icon="mdi:send-outline" />
              Send Enquiry — It&apos;s Free
            </>
          )}
        </button>

        <p className={styles.privacyNote}>
          <Icon icon="mdi:shield-check-outline" />
          Your details are safe. No spam, ever.
        </p>
      </form>
    </div>
  );
}
