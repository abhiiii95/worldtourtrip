"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./photoGallery.module.scss";

// Fallback photos shown when no gallery images are in the DB yet
const FALLBACK_PHOTOS = [
  { id: 1, src: "/images/ladakh.webp",  alt: "Ladakh",  spanRow: true  },
  { id: 2, src: "/images/kerla-1.jpg",  alt: "Kerala",  spanRow: false },
  { id: 3, src: "/images/goa-1.jpg",    alt: "Goa",     spanRow: false },
  { id: 4, src: "/images/jaipur-1.jpg", alt: "Jaipur",  spanRow: false },
  { id: 5, src: "/images/leh.jpg",      alt: "Leh",     spanRow: false },
];

/**
 * PhotoGallery
 * Props:
 *   images  {string[]}  Array of Cloudinary URLs from the Package.gallery field.
 *                       Falls back to FALLBACK_PHOTOS when empty.
 */
export default function PhotoGallery({ images = [] }) {
  // Build photo objects from the images prop
  const photos =
    images.length > 0
      ? images.map((url, i) => ({
          id: i + 1,
          src: url,
          alt: `Package photo ${i + 1}`,
          spanRow: i === 0, // first image spans two columns
        }))
      : FALLBACK_PHOTOS;

  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const openModal = (index) => {
    setActiveIndex(index);
    setDirection(null);
    setIsAnimating(false);
  };

  const closeModal = () => setActiveIndex(null);

  const navigate = useCallback(
    (dir) => {
      if (isAnimating || activeIndex === null) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => {
          if (dir === "next") return (prev + 1) % photos.length;
          return (prev - 1 + photos.length) % photos.length;
        });
        setIsAnimating(false);
      }, 280);
    },
    [isAnimating, activeIndex, photos.length]
  );

  useEffect(() => {
    const handler = (e) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, navigate]);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  const getImgClass = () => {
    if (!isAnimating) return styles.visible;
    return direction === "next" ? styles.slideOutLeft : styles.slideOutRight;
  };

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.grid}>
          {photos.slice(0, 5).map((photo, index) => (
            <div
              key={photo.id}
              className={`${styles.item} ${photo.spanRow ? styles.spanRow : ""}`}
              onClick={() => openModal(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open photo: ${photo.alt}`}
              onKeyDown={(e) => e.key === "Enter" && openModal(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width:700px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
              <div className={styles.overlay}>
                <div className={styles.overlayIcon}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {/* Last visible tile: show remaining count overlay */}
              {index === 4 && photos.length > 5 && (
                <div className={styles.moreOverlay} onClick={(e) => { e.stopPropagation(); openModal(4); }}>
                  <span>+{photos.length - 5}</span>
                  <small>more photos</small>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className={styles.allPhotosBtn} onClick={() => openModal(0)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          All photos ({photos.length})
        </button>
      </section>

      {/* Lightbox modal */}
      {activeIndex !== null && (
        <div
          className={styles.backdrop}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button className={styles.closeBtn} onClick={closeModal} aria-label="Close modal">✕</button>

          <button className={`${styles.navBtn} ${styles.prev}`} onClick={() => navigate("prev")} aria-label="Previous photo">←</button>

          <div className={styles.modalInner}>
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activeIndex}
                src={photos[activeIndex].src}
                alt={photos[activeIndex].alt}
                className={`${styles.modalImg} ${getImgClass()}`}
              />
            </div>
          </div>

          <button className={`${styles.navBtn} ${styles.next}`} onClick={() => navigate("next")} aria-label="Next photo">→</button>

          <div className={styles.counter}>
            {photos.map((_, i) => (
              <div key={i} className={`${styles.dot} ${i === activeIndex ? styles.active : ""}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
