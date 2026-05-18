"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import styles from "./admin.module.scss";
import ImageUploader from "./ImageUploader";

const EMPTY = {
  title: "", slug: "", subtitle: "", description: "", location: "",
  destination: "", destinationSlug: "", category: "Leisure",
  duration: "", nights: "", groupSize: "", price: "", margin: "", originalPrice: "",
  badge: "", isPopular: false, isActive: true,
  highlights: "", included: "", excluded: "",
};

const EMPTY_DAY = { day: 1, title: "", description: "", activities: "" };

const makeEmptyOption = (n) => ({
  optionName: `Option ${n}`,
  starCategory: "",
  hotels: [
    { location: "Leh", nights: 3, name: "" },
    { location: "Nubra", nights: 1, name: "" },
    { location: "Pangong", nights: 1, name: "" },
  ],
  prices: [
    { pax: 12, pricePerPerson: "" },
    { pax: 10, pricePerPerson: "" },
    { pax: 8,  pricePerPerson: "" },
    { pax: 6,  pricePerPerson: "" },
    { pax: 4,  pricePerPerson: "" },
    { pax: 2,  pricePerPerson: "" },
  ],
});

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normaliseImages(arr = []) {
  return arr.map((item) =>
    typeof item === "string" ? { url: item, public_id: "" } : item
  );
}

// prefill: data from the PDF converter to pre-fill a NEW package (not an edit)
export default function PackageForm({ pkg, prefill, onClose, onSuccess, showToast }) {
  const isEdit = !!pkg && !prefill;
  const [form, setForm] = useState(EMPTY);
  const [gallery, setGallery] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  // Unsplash state
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashMsg, setUnsplashMsg] = useState("");
  const [unsplashError, setUnsplashError] = useState("");

  // PDF state
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const pdfInputRef = useRef(null);

  const applyData = (d) => {
    setForm({
      ...EMPTY,
      ...d,
      highlights: (d.highlights || []).join("\n"),
      included:   (d.included   || []).join("\n"),
      excluded:   (d.excluded   || []).join("\n"),
    });
    setItinerary(
      (d.itinerary || []).map((day) => ({
        day: day.day,
        title: day.title || "",
        description: day.description || "",
        activities: Array.isArray(day.activities) ? day.activities.join("\n") : (day.activities || ""),
      }))
    );
    setHotelOptions(
      (d.hotelOptions || []).map((opt) => ({
        optionName:   opt.optionName   || "",
        starCategory: opt.starCategory || "",
        hotels: (opt.hotels || []).map((h) => ({
          location: h.location || "",
          nights:   h.nights   ?? 1,
          name:     h.name     || "",
        })),
        prices: (opt.prices || []).map((p) => ({
          pax:            p.pax ?? "",
          pricePerPerson: p.pricePerPerson !== undefined ? String(p.pricePerPerson) : "",
        })),
      }))
    );
  };

  useEffect(() => {
    if (prefill) {
      applyData(prefill);
      setGallery([]);
    } else if (pkg) {
      applyData(pkg);
      const thumbEntry = pkg.thumbnail
        ? [{ url: pkg.thumbnail, public_id: pkg.thumbnail_public_id || "" }]
        : [];
      const galleryEntries = normaliseImages(pkg.gallery || []);
      const seen = new Set();
      const merged = [...thumbEntry, ...galleryEntries].filter((img) => {
        if (seen.has(img.url)) return false;
        seen.add(img.url);
        return true;
      });
      setGallery(merged);
    } else {
      setForm(EMPTY);
      setItinerary([]);
      setHotelOptions([]);
      setGallery([]);
    }
  }, [pkg, prefill]);

  // ── Unsplash auto-fetch ────────────────────────────────────────────────────
  const fetchUnsplashImages = async () => {
    const query = form.destination || form.title;
    if (!query) {
      setUnsplashError("Pehle Destination ya Title fill karo.");
      return;
    }
    const slots = 10 - gallery.length;
    if (slots <= 0) {
      setUnsplashError("Gallery full hai (max 10). Pehle kuch images hatao.");
      return;
    }
    setUnsplashLoading(true);
    setUnsplashMsg("");
    setUnsplashError("");
    try {
      // Step 1 — Unsplash se URLs fetch karo
      const needed = Math.min(Math.max(8 - gallery.length, 1), slots);
      const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}&count=${needed}`);
      const json = await res.json();
      if (!json.success) {
        setUnsplashError(json.message || "Unsplash se images nahi mili.");
        return;
      }

      setUnsplashMsg(`${json.images.length} images Cloudinary pe upload ho rahi hain…`);

      // Step 2 — Har Unsplash URL ko Cloudinary pe upload karo
      const existingUrls = new Set(gallery.map((g) => g.url));
      const uploaded = await Promise.all(
        json.images.map(async (img) => {
          if (existingUrls.has(img.url)) return null;
          try {
            const r = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: img.url, folder: "packages" }),
            });
            const data = await r.json();
            return data.success ? { url: data.url, public_id: data.public_id } : null;
          } catch {
            return null;
          }
        })
      );

      const toAdd = uploaded.filter(Boolean);
      setGallery((prev) => [...prev, ...toAdd].slice(0, 10));
      setUnsplashMsg(`${toAdd.length} images Cloudinary pe upload ho gayi "${query}" ke liye.`);
    } catch {
      setUnsplashError("Kuch gadbad ho gayi. Dobara try karo.");
    } finally {
      setUnsplashLoading(false);
    }
  };

  // ── Itinerary helpers ──────────────────────────────────────────────────────
  const addDay = () => {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", description: "", activities: "" },
    ]);
  };
  const removeDay = (idx) => {
    setItinerary((prev) =>
      prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }))
    );
  };
  const updateDay = (idx, field, value) => {
    setItinerary((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)));
  };

  // ── Hotel option helpers ───────────────────────────────────────────────────
  const addHotelOption = () => {
    setHotelOptions((prev) => [...prev, makeEmptyOption(prev.length + 1)]);
  };
  const removeHotelOption = (idx) => {
    setHotelOptions((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateHotelOption = (idx, field, value) => {
    setHotelOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  };

  // Hotel rows within an option
  const addHotelRow = (optIdx) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx
          ? { ...o, hotels: [...o.hotels, { location: "", nights: 1, name: "" }] }
          : o
      )
    );
  };
  const removeHotelRow = (optIdx, hotelIdx) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx ? { ...o, hotels: o.hotels.filter((_, j) => j !== hotelIdx) } : o
      )
    );
  };
  const updateHotelRow = (optIdx, hotelIdx, field, value) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx
          ? {
              ...o,
              hotels: o.hotels.map((h, j) => (j === hotelIdx ? { ...h, [field]: value } : h)),
            }
          : o
      )
    );
  };

  // Price rows within an option
  const addPriceRow = (optIdx) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx
          ? { ...o, prices: [...o.prices, { pax: "", pricePerPerson: "" }] }
          : o
      )
    );
  };
  const removePriceRow = (optIdx, priceIdx) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx ? { ...o, prices: o.prices.filter((_, j) => j !== priceIdx) } : o
      )
    );
  };
  const updatePriceRow = (optIdx, priceIdx, field, value) => {
    setHotelOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx
          ? {
              ...o,
              prices: o.prices.map((p, j) => (j === priceIdx ? { ...p, [field]: value } : p)),
            }
          : o
      )
    );
  };

  // ── PDF auto-fill ──────────────────────────────────────────────────────────
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
    setPdfError("");
    setPdfSuccess(false);
    setPdfParsing(true);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.success) {
        setPdfError(json.message + (json.detail ? ` — ${json.detail}` : ""));
        return;
      }
      const d = json.data;
      setForm((prev) => ({
        ...prev,
        title:           d.title           || prev.title,
        slug:            !isEdit && d.title ? toSlug(d.title) : prev.slug,
        subtitle:        d.subtitle        || prev.subtitle,
        description:     d.description     || prev.description,
        destination:     d.destination     || prev.destination,
        destinationSlug: d.destinationSlug || (d.destination ? toSlug(d.destination) : prev.destinationSlug),
        location:        d.location        || prev.location,
        category:        d.category        || prev.category,
        duration:        d.duration        || prev.duration,
        nights:          d.nights          || prev.nights,
        groupSize:       d.groupSize       || prev.groupSize,
        price:           d.price           || prev.price,
        originalPrice:   d.originalPrice   || prev.originalPrice,
        badge:           d.badge           || prev.badge,
        highlights: Array.isArray(d.highlights) && d.highlights.length ? d.highlights.join("\n") : prev.highlights,
        included:   Array.isArray(d.included)   && d.included.length   ? d.included.join("\n")   : prev.included,
        excluded:   Array.isArray(d.excluded)   && d.excluded.length   ? d.excluded.join("\n")   : prev.excluded,
      }));

      // Fill itinerary from PDF
      if (Array.isArray(d.itinerary) && d.itinerary.length > 0) {
        setItinerary(
          d.itinerary.map((item, i) => ({
            day:         item.day         || i + 1,
            title:       item.title       || "",
            description: item.description || "",
            activities:  Array.isArray(item.activities) ? item.activities.join("\n") : "",
          }))
        );
      }

      // Fill hotel options from PDF
      if (Array.isArray(d.hotelOptions) && d.hotelOptions.length > 0) {
        setHotelOptions(
          d.hotelOptions.map((opt, i) => ({
            optionName:   opt.optionName   || `Option ${i + 1}`,
            starCategory: opt.starCategory || "",
            hotels: Array.isArray(opt.hotels)
              ? opt.hotels.map((h) => ({
                  location: h.location || "",
                  nights:   h.nights   ?? 1,
                  name:     h.name     || "",
                }))
              : [],
            prices: Array.isArray(opt.prices)
              ? opt.prices.map((p) => ({
                  pax:            p.pax ?? "",
                  pricePerPerson: p.pricePerPerson !== undefined ? String(p.pricePerPerson) : "",
                }))
              : [],
          }))
        );
      }

      setPdfSuccess(true);
    } catch (err) {
      setPdfError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setPdfParsing(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  // ── Form field change ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title"       && !isEdit ? { slug: toSlug(value) } : {}),
      ...(name === "destination"             ? { destinationSlug: toSlug(value) } : {}),
    }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const thumbnail = gallery[0]?.url || "";
    const thumbnail_public_id = gallery[0]?.public_id || "";
    const galleryUrls = gallery.map((img) => img.url);
    const payload = {
      ...form,
      duration:      Number(form.duration),
      nights:        Number(form.nights)        || undefined,
      price:         Number(form.price),
      margin:        Number(form.margin)        || 0,
      originalPrice: Number(form.originalPrice) || undefined,
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      included:   form.included.split("\n").map((s) => s.trim()).filter(Boolean),
      excluded:   form.excluded.split("\n").map((s) => s.trim()).filter(Boolean),
      itinerary: itinerary.map((d) => ({
        day:         d.day,
        title:       d.title,
        description: d.description,
        activities:  d.activities.split("\n").map((s) => s.trim()).filter(Boolean),
      })),
      hotelOptions: hotelOptions.map((opt) => ({
        optionName:   opt.optionName,
        starCategory: opt.starCategory,
        hotels: opt.hotels
          .filter((h) => h.location && h.name)
          .map((h) => ({ location: h.location, nights: Number(h.nights) || 1, name: h.name })),
        prices: opt.prices
          .filter((p) => p.pax && p.pricePerPerson)
          .map((p) => ({ pax: Number(p.pax), pricePerPerson: Number(p.pricePerPerson) })),
      })),
      thumbnail,
      thumbnail_public_id,
      gallery: galleryUrls,
    };
    try {
      const url    = isEdit ? `/api/package/${pkg.slug}` : "/api/package";
      const method = isEdit ? "PUT" : "POST";
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) { onSuccess(); }
      else { showToast(json.message || "Save failed.", "error"); }
    } catch { showToast("Something went wrong.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formModal}>
        <div className={styles.formHeader}>
          <h2>{isEdit ? "Edit Package" : "Add New Package"}</h2>
          <button className={styles.formClose} onClick={onClose} aria-label="Close">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* PDF Banner */}
          <div className={styles.pdfBanner}>
            <div className={styles.pdfBannerLeft}>
              <div className={styles.pdfBannerIcon}><Icon icon="mdi:robot-outline" width={22} /></div>
              <div>
                <p className={styles.pdfBannerTitle}>Auto-fill from PDF</p>
                <p className={styles.pdfBannerSub}>Upload a package brochure — Gemini AI fills all fields including hotel options, itinerary, inclusions &amp; exclusions.</p>
              </div>
            </div>
            <div className={styles.pdfBannerRight}>
              <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" className={styles.hiddenInput} onChange={handlePdfUpload} id="pdf-upload-input" />
              <label htmlFor="pdf-upload-input" className={`${styles.pdfUploadBtn} ${pdfParsing ? styles.pdfUploading : ""}`}>
                {pdfParsing
                  ? <><Icon icon="mdi:loading" className={styles.spin} /> Analysing...</>
                  : <><Icon icon="mdi:file-pdf-box" /> Upload PDF</>}
              </label>
            </div>
          </div>

          {pdfFileName && !pdfParsing && (
            <div className={pdfSuccess ? styles.pdfStatusSuccess : styles.pdfStatusError}>
              {pdfSuccess
                ? <><Icon icon="mdi:check-circle" /><span>Filled from <strong>{pdfFileName}</strong>. Review below before saving.</span></>
                : <><Icon icon="mdi:alert-circle" /><span>{pdfError}</span></>}
            </div>
          )}

          <div className={styles.formGrid}>
            {/* Images */}
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              {/* Unsplash auto-fetch */}
              <div className={styles.unsplashBanner}>
                <div className={styles.unsplashBannerLeft}>
                  <div className={styles.unsplashIcon}>
                    <Icon icon="mdi:image-search-outline" width={20} />
                  </div>
                  <div>
                    <p className={styles.unsplashTitle}>Auto-fetch from Unsplash</p>
                    <p className={styles.unsplashSub}>
                      Fetches 8 high-quality images based on your Destination / Title. Min 8 images required.
                      {gallery.length > 0 && (
                        <span className={gallery.length >= 8 ? styles.imgCountOk : styles.imgCountWarn}>
                          {" "}{gallery.length}/8 images
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.unsplashBtn} ${unsplashLoading ? styles.unsplashBtnLoading : ""}`}
                  onClick={fetchUnsplashImages}
                  disabled={unsplashLoading}
                >
                  {unsplashLoading
                    ? <><Icon icon="mdi:loading" className={styles.spin} /> Fetching...</>
                    : <><Icon icon="mdi:cloud-download-outline" /> Fetch Images</>}
                </button>
              </div>

              {unsplashMsg && (
                <div className={styles.unsplashSuccess}>
                  <Icon icon="mdi:check-circle" /> {unsplashMsg}
                </div>
              )}
              {unsplashError && (
                <div className={styles.unsplashError}>
                  <Icon icon="mdi:alert-circle" /> {unsplashError}
                </div>
              )}

              <ImageUploader images={gallery} onChange={setGallery} maxImages={10} folder="packages" label="Package Images (first = cover/thumbnail)" />
            </div>

            {/* Title */}
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Leh Ladakh Adventure" />
            </div>

            <div className={styles.formField}>
              <label>Slug * <span>(auto-generated)</span></label>
              <input name="slug" value={form.slug} onChange={handleChange} required placeholder="leh-ladakh-adventure" />
            </div>
            <div className={styles.formField}>
              <label>Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="5 Nights / 6 Days" />
            </div>
            <div className={styles.formField}>
              <label>Destination *</label>
              <input name="destination" value={form.destination} onChange={handleChange} required placeholder="Ladakh" />
            </div>
            <div className={styles.formField}>
              <label>Destination Slug</label>
              <input name="destinationSlug" value={form.destinationSlug} onChange={handleChange} placeholder="ladakh" />
            </div>
            <div className={styles.formField}>
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Leh • Nubra • Pangong" />
            </div>
            <div className={styles.formField}>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {["Adventure","Leisure","Beach","Heritage","Honeymoon","Wildlife","Pilgrimage","Other"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Duration (days) *</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} required min={1} placeholder="6" />
            </div>
            <div className={styles.formField}>
              <label>Nights</label>
              <input type="number" name="nights" value={form.nights} onChange={handleChange} min={0} placeholder="5" />
            </div>
            <div className={styles.formField}>
              <label>Group Size</label>
              <input name="groupSize" value={form.groupSize} onChange={handleChange} placeholder="2–12 People" />
            </div>
            <div className={styles.formField}>
              <label>Base Price (₹/person) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min={0} placeholder="9999" />
            </div>
            <div className={styles.formField}>
              <label>Margin (₹/person) <span>added to base price</span></label>
              <input type="number" name="margin" value={form.margin} onChange={handleChange} min={0} placeholder="0" />
            </div>
            {(form.price || form.margin) && (
              <div className={`${styles.formField} ${styles.displayPricePreview}`}>
                <label>Display Price on Site</label>
                <div className={styles.displayPriceVal}>
                  ₹{Number((Number(form.price) || 0) + (Number(form.margin) || 0)).toLocaleString("en-IN")}
                  <span>/person</span>
                </div>
                {form.price && form.margin > 0 && (
                  <p className={styles.displayPriceMeta}>
                    ₹{Number(form.price).toLocaleString("en-IN")} base + ₹{Number(form.margin).toLocaleString("en-IN")} margin
                  </p>
                )}
              </div>
            )}
            <div className={styles.formField}>
              <label>Original Price (₹) <span>for discount badge</span></label>
              <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} min={0} placeholder="22999" />
            </div>
            <div className={styles.formField}>
              <label>Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="Best Seller" />
            </div>
            <div className={styles.formField}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} />
                Mark as Popular
              </label>
              <label className={styles.checkboxLabel} style={{ marginTop: 8 }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Active (visible on site)
              </label>
            </div>

            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short description..." />
            </div>
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>Highlights <span>(one per line)</span></label>
              <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={4} placeholder={"Pangong Lake\nNubra Valley\nKhardung La Pass"} />
            </div>
            <div className={styles.formField}>
              <label>Included <span>(one per line)</span></label>
              <textarea name="included" value={form.included} onChange={handleChange} rows={4} placeholder={"Hotel accommodation\nBreakfast & dinner\nTransport"} />
            </div>
            <div className={styles.formField}>
              <label>Excluded <span>(one per line)</span></label>
              <textarea name="excluded" value={form.excluded} onChange={handleChange} rows={4} placeholder={"Airfare\nPersonal expenses\nTravel insurance"} />
            </div>
          </div>

          {/* ── Hotel Options & Pricing ── */}
          <div className={styles.itinerarySection}>
            <div className={styles.itinerarySectionHead}>
              <div>
                <h3 className={styles.itinerarySectionTitle}>Hotel Options &amp; Pricing</h3>
                <p className={styles.itinerarySectionSub}>Add each hotel option (2★, 3★, 4★…) with hotels per location and per-pax pricing.</p>
              </div>
              <button type="button" className={styles.addDayBtn} onClick={addHotelOption}>
                <Icon icon="mdi:plus" /> Add Option
              </button>
            </div>

            {hotelOptions.length === 0 && (
              <div className={styles.itineraryEmpty}>
                <Icon icon="mdi:bed-outline" width={32} />
                <p>No hotel options yet. Click &quot;Add Option&quot; or upload a PDF to auto-fill.</p>
              </div>
            )}

            {hotelOptions.map((opt, optIdx) => (
              <div key={optIdx} className={styles.hotelOptionCard}>
                {/* Option header */}
                <div className={styles.hotelOptionHeader}>
                  <div className={styles.hotelOptionFields}>
                    <div className={styles.formField}>
                      <label>Option Name</label>
                      <input
                        value={opt.optionName}
                        onChange={(e) => updateHotelOption(optIdx, "optionName", e.target.value)}
                        placeholder="Option 1"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Star Category</label>
                      <input
                        value={opt.starCategory}
                        onChange={(e) => updateHotelOption(optIdx, "starCategory", e.target.value)}
                        placeholder="e.g. 2Star Deluxe, 3Star, 4Star"
                      />
                    </div>
                  </div>
                  <button type="button" className={styles.removeDayBtn} onClick={() => removeHotelOption(optIdx)} aria-label="Remove option">
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>

                <div className={styles.hotelOptionBody}>
                  {/* Hotels table */}
                  <p className={styles.hotelSubLabel}>Hotels per Location</p>
                  <div className={styles.hotelRowsWrap}>
                    {opt.hotels.map((h, hIdx) => (
                      <div key={hIdx} className={styles.hotelRow}>
                        <div className={styles.formField} style={{ flex: "0 0 120px" }}>
                          <label>Location</label>
                          <input value={h.location} onChange={(e) => updateHotelRow(optIdx, hIdx, "location", e.target.value)} placeholder="Leh" />
                        </div>
                        <div className={styles.formField} style={{ flex: "0 0 70px" }}>
                          <label>Nights</label>
                          <input type="number" min={1} value={h.nights} onChange={(e) => updateHotelRow(optIdx, hIdx, "nights", e.target.value)} />
                        </div>
                        <div className={styles.formField} style={{ flex: 1 }}>
                          <label>Hotel Name(s)</label>
                          <input value={h.name} onChange={(e) => updateHotelRow(optIdx, hIdx, "name", e.target.value)} placeholder="Hotel A / Hotel B / Similar" />
                        </div>
                        <button type="button" className={styles.removeRowBtn} onClick={() => removeHotelRow(optIdx, hIdx)} aria-label="Remove hotel row">
                          <Icon icon="mdi:close" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className={styles.addRowBtn} onClick={() => addHotelRow(optIdx)}>
                      <Icon icon="mdi:plus" /> Add Hotel Location
                    </button>
                  </div>

                  {/* Pricing table */}
                  <p className={styles.hotelSubLabel} style={{ marginTop: 16 }}>Per-Person Pricing by Group Size</p>
                  <div className={styles.priceRowsWrap}>
                    <div className={styles.priceRowHeader}>
                      <span>No. of Pax</span>
                      <span>Price / Person (₹)</span>
                      <span />
                    </div>
                    {opt.prices.map((p, pIdx) => (
                      <div key={pIdx} className={styles.priceRow}>
                        <input
                          type="number"
                          min={1}
                          value={p.pax}
                          onChange={(e) => updatePriceRow(optIdx, pIdx, "pax", e.target.value)}
                          placeholder="e.g. 12"
                          className={styles.priceInput}
                        />
                        <input
                          type="number"
                          min={0}
                          value={p.pricePerPerson}
                          onChange={(e) => updatePriceRow(optIdx, pIdx, "pricePerPerson", e.target.value)}
                          placeholder="e.g. 9999"
                          className={styles.priceInput}
                        />
                        <button type="button" className={styles.removeRowBtn} onClick={() => removePriceRow(optIdx, pIdx)} aria-label="Remove price row">
                          <Icon icon="mdi:close" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className={styles.addRowBtn} onClick={() => addPriceRow(optIdx)}>
                      <Icon icon="mdi:plus" /> Add Pax Tier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Itinerary ── */}
          <div className={styles.itinerarySection}>
            <div className={styles.itinerarySectionHead}>
              <div>
                <h3 className={styles.itinerarySectionTitle}>Day-by-Day Itinerary</h3>
                <p className={styles.itinerarySectionSub}>Add each day of the tour. Activities: one per line.</p>
              </div>
              <button type="button" className={styles.addDayBtn} onClick={addDay}>
                <Icon icon="mdi:plus" /> Add Day
              </button>
            </div>

            {itinerary.length === 0 && (
              <div className={styles.itineraryEmpty}>
                <Icon icon="mdi:calendar-blank-outline" width={32} />
                <p>No days added yet. Click &quot;Add Day&quot; or upload a PDF to auto-fill.</p>
              </div>
            )}

            {itinerary.map((day, idx) => (
              <div key={idx} className={styles.dayCard}>
                <div className={styles.dayCardHeader}>
                  <span className={styles.dayBadge}>Day {day.day}</span>
                  <button type="button" className={styles.removeDayBtn} onClick={() => removeDay(idx)} aria-label="Remove day">
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>
                <div className={styles.dayCardBody}>
                  <div className={styles.formField}>
                    <label>Day Title *</label>
                    <input
                      value={day.title}
                      onChange={(e) => updateDay(idx, "title", e.target.value)}
                      placeholder="e.g. Arrival in Leh & Acclimatization"
                      required={itinerary.length > 0}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Description</label>
                    <textarea
                      value={day.description}
                      onChange={(e) => updateDay(idx, "description", e.target.value)}
                      rows={2}
                      placeholder="What happens on this day..."
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Activities <span>(one per line)</span></label>
                    <textarea
                      value={day.activities}
                      onChange={(e) => updateDay(idx, "activities", e.target.value)}
                      rows={2}
                      placeholder={"Hotel check-in\nLocal market visit\nWelcome dinner"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving
                ? <><Icon icon="mdi:loading" className={styles.spin} /> Saving...</>
                : (isEdit ? "Update Package" : "Create Package")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
