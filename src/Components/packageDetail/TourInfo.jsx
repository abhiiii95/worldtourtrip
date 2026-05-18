"use client";

import { useState } from "react";
import styles from "./TourInfo.module.scss";

export default function TourInfo({ pkg }) {
  const [openDay, setOpenDay] = useState(null);
  const toggle = (day) => setOpenDay(openDay === day ? null : day);

  const highlights    = pkg?.highlights    || [];
  const included      = pkg?.included      || [];
  const excluded      = pkg?.excluded      || [];
  const itinerary     = pkg?.itinerary     || [];
  const hotelOptions  = pkg?.hotelOptions  || [];
  const description   = pkg?.description   || "";

  return (
    <div className={styles.tourInfo}>

      {/* About */}
      {description && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About this tour</h2>
          <p className={styles.bodyText}>{description}</p>
        </section>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Highlights</h2>
          <ul className={styles.checkList}>
            {highlights.map((h, i) => (
              <li key={i} className={styles.checkItem}>
                <span className={styles.checkIcon}>
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#D1FAE5" />
                    <path d="M6 10.5l2.8 2.8 5.2-5.6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Included / Excluded */}
      {(included.length > 0 || excluded.length > 0) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Included / Excluded</h2>
          <div className={styles.inclExclGrid}>
            {included.length > 0 && (
              <div>
                <p className={styles.inclExclLabel}>
                  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                    <circle cx="10" cy="10" r="10" fill="#D1FAE5"/>
                    <path d="M6 10.5l2.8 2.8 5.2-5.6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  What&apos;s Included
                </p>
                <ul className={styles.checkList}>
                  {included.map((item, i) => (
                    <li key={i} className={styles.checkItem}>
                      <span className={styles.checkIcon}>
                        <svg viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="10" fill="#D1FAE5" />
                          <path d="M6 10.5l2.8 2.8 5.2-5.6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {excluded.length > 0 && (
              <div>
                <p className={styles.inclExclLabel}>
                  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                    <circle cx="10" cy="10" r="10" fill="#FFE4E6"/>
                    <path d="M7 7l6 6M13 7l-6 6" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  What&apos;s Excluded
                </p>
                <ul className={styles.checkList}>
                  {excluded.map((item, i) => (
                    <li key={i} className={`${styles.checkItem} ${styles.excluded}`}>
                      <span className={styles.crossIcon}>
                        <svg viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="10" fill="#FFE4E6" />
                          <path d="M7 7l6 6M13 7l-6 6" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hotel Options & Pricing */}
      {hotelOptions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Hotel Options &amp; Pricing</h2>
          <p className={styles.bodyText} style={{ marginBottom: 20 }}>
            Choose from multiple hotel categories below. Prices are per person based on group size.
          </p>
          <div className={styles.optionsList}>
            {hotelOptions.map((opt, idx) => (
              <div key={idx} className={styles.optionCard}>
                {/* Option header */}
                <div className={styles.optionCardHeader}>
                  <span className={styles.optionName}>{opt.optionName || `Option ${idx + 1}`}</span>
                  {opt.starCategory && (
                    <span className={styles.starBadge}>{opt.starCategory}</span>
                  )}
                </div>

                <div className={styles.optionCardBody}>
                  {/* Hotels */}
                  {opt.hotels?.length > 0 && (
                    <div className={styles.hotelTableWrap}>
                      <table className={styles.hotelTable}>
                        <thead>
                          <tr>
                            <th>Location</th>
                            <th>Nights</th>
                            <th>Hotel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {opt.hotels.map((h, i) => (
                            <tr key={i}>
                              <td className={styles.hotelLoc}>{h.location}</td>
                              <td className={styles.hotelNights}>{h.nights}N</td>
                              <td className={styles.hotelName}>{h.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pricing chips */}
                  {opt.prices?.length > 0 && (
                    <div className={styles.priceChipsWrap}>
                      {[...opt.prices]
                        .sort((a, b) => b.pax - a.pax)
                        .map((p, i) => (
                          <div key={i} className={styles.priceChip}>
                            <span className={styles.chipPax}>{p.pax} Pax</span>
                            <span className={styles.chipPrice}>
                              ₹{(Number(p.pricePerPerson) + (pkg?.margin || 0)).toLocaleString("en-IN")}
                            </span>
                            <span className={styles.chipSub}>/person</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Itinerary */}
      {itinerary.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Itinerary</h2>
          <div className={styles.itineraryList}>
            {itinerary.map((item) => {
              const isOpen = openDay === item.day;
              return (
                <div key={item.day} className={`${styles.itineraryItem} ${isOpen ? styles.open : ""}`}>
                  <button className={styles.itineraryHeader} onClick={() => toggle(item.day)} aria-expanded={isOpen}>
                    <div className={styles.dayBadge}>Day {item.day}</div>
                    <div className={styles.itineraryMeta}>
                      <span className={styles.itineraryTitle}>{item.title}</span>
                    </div>
                    <span className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div className={`${styles.itineraryBody} ${isOpen ? styles.bodyOpen : ""}`}>
                    {item.description && <p className={styles.itineraryDesc}>{item.description}</p>}
                    {item.activities?.length > 0 && (
                      <div className={styles.activitiesList}>
                        {item.activities.map((act, idx) => (
                          <span key={idx} className={styles.activityTag}>{act}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fallback */}
      {!description && highlights.length === 0 && itinerary.length === 0 && hotelOptions.length === 0 && (
        <section className={styles.section}>
          <p className={styles.bodyText} style={{ color: "#94a3b8" }}>
            Detailed itinerary and package information coming soon. Contact us for a custom quote.
          </p>
        </section>
      )}
    </div>
  );
}
