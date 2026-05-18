"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import styles from "./searchEngine.module.scss";
import LeadModal from "../LeadModal/LeadModal";

export default function SearchEngine() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadDest, setLeadDest] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/package/search?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      const found = json.data || [];
      setResults(found);
      // Only open dropdown when there are actual results
      setShowDropdown(found.length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (pkg) => {
    setShowDropdown(false);
    setQuery(pkg.title);
    router.push(`/package/${pkg.slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empty query → open lead modal directly
    if (!query.trim()) {
      setLeadDest("");
      setShowLeadModal(true);
      setShowDropdown(false);
      return;
    }

    if (results.length > 0) {
      router.push(`/package?search=${encodeURIComponent(query.trim())}`);
    } else {
      // No packages found → open lead form modal
      setLeadDest(query.trim());
      setShowLeadModal(true);
    }
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <form className={styles.engine} onSubmit={handleSubmit} role="search" aria-label="Search packages">
        <div className={styles.inputGroup}>
          {/* Destination input */}
          <div className={styles.field} ref={inputRef}>
            <Icon icon="mdi:map-marker-outline" className={styles.fieldIcon} />
            <input
              type="text"
              placeholder="Where do you want to go? e.g. Rishikesh, Goa, Ladakh"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              className={styles.input}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
            />
            {loading && <Icon icon="mdi:loading" className={styles.spinner} />}
            {query && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); inputRef.current?.querySelector("input")?.focus(); }}
                aria-label="Clear search"
              >
                <Icon icon="mdi:close-circle" />
              </button>
            )}

            {/* Dropdown — only shown when results exist */}
            {showDropdown && results.length > 0 && (
              <div className={styles.dropdown} ref={dropdownRef} role="listbox">
                <div className={styles.dropdownHeader}>
                  <Icon icon="mdi:package-variant" />
                  Matching Packages
                </div>
                {results.map((pkg, i) => (
                  <button
                    key={pkg._id || pkg.slug}
                    type="button"
                    className={`${styles.dropdownItem} ${i === activeIdx ? styles.active : ""}`}
                    onClick={() => handleSelect(pkg)}
                    role="option"
                    aria-selected={i === activeIdx}
                  >
                    <div className={styles.itemLeft}>
                      <Icon icon="mdi:map-marker" className={styles.itemIcon} />
                      <div>
                        <span className={styles.itemTitle}>{pkg.title}</span>
                        <span className={styles.itemMeta}>{pkg.destination} · {pkg.duration} Days</span>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
                <div className={styles.dropdownFooter}>
                  <button type="submit" className={styles.viewAllBtn}>
                    View all results for &quot;{query}&quot; →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <button type="submit" className={styles.searchBtn} aria-label="Search">
            <Icon icon="mdi:magnify" width={20} />
            <span>Search</span>
          </button>
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <span className={styles.quickLabel}>Popular:</span>
          {["Leh Ladakh", "Goa", "Kerala", "Rishikesh", "Manali"].map((dest) => (
            <button
              key={dest}
              type="button"
              className={styles.quickChip}
              onClick={() => {
                setQuery(dest);
                search(dest);
              }}
            >
              {dest}
            </button>
          ))}
        </div>
      </form>

      {/* Lead modal — shown when no packages found */}
      {showLeadModal && (
        <LeadModal
          prefillDest={leadDest}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </>
  );
}
