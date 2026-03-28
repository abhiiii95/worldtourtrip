// import React from 'react';
// import styles from "./contact.module.scss";
// import AboutBanner from '@/Common/Components/AboutBanner/AboutBanner';
// import Image from 'next/image';
// import contact from "../../../../public/images/contact.webp"
// import ContactForm from '../ContactForm/ContactForm';

// const Contact = () => {
//     const bannerData = [
//         {
//             id:1,
//             route:"/contact",
//             routeText:"Contact Us"
//         }
//     ]
//   return (
//     <>
//       <AboutBanner banner={bannerData} heading={"Contact Us – Get in Touch with Our Travel Experts"}/>
//       <section className={styles?.contact}>
//         <div className='container'>

//         <div className={styles?.content}>
//             <div className={styles?.leftContent}>
//                 <p className={styles?.helpText}>We’re here to help! Whether you have questions about flight bookings, hotel reservations, or holiday packages, our dedicated travel experts are just a message away.</p>
//                 <ContactForm />
//             </div>
//         <div className={styles?.imageWrapper}>
//             <Image src={contact} alt="contact" fill />
//         </div>
//         </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default Contact

"use client";

import React, { useState } from "react";
import styles from "./contact.module.scss";
import AboutBanner from "@/Common/Components/AboutBanner/AboutBanner";
import Image from "next/image";
import contact from "../../../../public/images/contact.webp";
import { submitContactForm } from "@/services/contact.services";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  comment: "",
};

const Contact = () => {
  const bannerData = [{ id: 1, route: "/contact", routeText: "Contact Us" }];

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await submitContactForm(formData);

    if (res?.status) {
      setFormData(initialState);
      setShowPopup(true);
    } else {
      setErrorMsg(res.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <AboutBanner
        banner={bannerData}
        heading={"Contact Us – Get in Touch with Our Travel Experts"}
      />

      <section className={styles.contact}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.leftContent}>
              <p className={styles.helpText}>
                We're here to help! Whether you have questions about flight
                bookings, hotel reservations, or holiday packages, our dedicated
                travel experts are just a message away.
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Comment</label>
                  <textarea
                    name="comment"
                    placeholder="Enter your comment"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                {errorMsg && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>

            <div className={styles.imageWrapper}>
              <Image src={contact} alt="contact" fill />
            </div>
          </div>
        </div>
      </section>

      {/* Success Popup */}
      {showPopup && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowPopup(false)}
        >
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupIcon}>✓</div>
            <h3>Thank You!</h3>
            <p>We have received your query. We will contact you soon.</p>
            <button
              className={styles.popupBtn}
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
