import React from "react";
import styles from "./contact.module.scss";
import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import Image from "next/image";
import contact from "../../../../public/images/contact.webp";
import LeadForm from "@/Common/Components/LeadForm/LeadForm";

const Contact = () => {
  const bannerData = [{ id: 1, route: "/contact", routeText: "Contact Us" }];

  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={"Contact Us – Get in Touch with Our Travel Experts"}
      />

      <section className={styles.contact}>
        <div className="container">
          <div className={styles.content}>
            {/* Left — form */}
            <div className={styles.leftContent}>
              <p className={styles.helpText}>
                We&apos;re here to help! Whether you have questions about flight bookings,
                hotel reservations, or holiday packages, our dedicated travel experts
                are just a message away. Fill in the form and we&apos;ll call you back
                within 2 hours.
              </p>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <div>
                    <strong>Call Us</strong>
                    <p>+91 8506805391</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉️</span>
                  <div>
                    <strong>Email Us</strong>
                    <p>info@worldtourtrip.com</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>🕐</span>
                  <div>
                    <strong>Working Hours</strong>
                    <p>Mon–Sat, 9 AM – 7 PM IST</p>
                  </div>
                </div>
              </div>

              <LeadForm
                title="Send Us a Message"
                subtitle="We'll get back to you within 2 hours"
                source="contact-page"
              />
            </div>

            {/* Right — image */}
            <div className={styles.imageWrapper}>
              <Image src={contact} alt="Contact World Tour Trip" fill />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
