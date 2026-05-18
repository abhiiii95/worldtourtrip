"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./packageListing.module.scss";

const DURATIONS = [
  { label: "Any Duration", min: 0, max: 999 },
  { label: "1–3 Days", min: 1, max: 3 },
  { label: "4–6 Days", min: 4, max: 6 },
  { label: "7+ Days", min: 7, max: 999 },
];
const BUDGETS = [
  { label: "Any Budget", min: 0, max: 999999 },
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: 999999 },
];
const SORT_OPTIONS = [
  { label: "Popularity", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
];
const CATEGORIES = ["All", "Adventure", "Leisure", "Beach", "Heritage", "Honeymoon", "Wildlife", "Pilgrimage"];

export default function PackageListing() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialDest = searchParams.get("destination") || "All";

  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState(["All"]);

  const [search, setSearch] = useState(initialSearch);
  const [destination, setDestination] = useState(initialDest);
  const [category, setCategory] = useState("All");
  const [durationIdx, setDurationIdx] = useState(0);
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/package");
      const json = await res.json();
      const data = json.data || [];
      setAllPackages(data);
      // Build unique destination list
      const dests = ["All", ...new Set(data.map((p) => p.destination).filter(Boolean))];
      setDestinations(dests);
    } catch {
      setAllPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const filtered = useMemo(() => {
    let list = [...allPackages];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.destination?.toLowerCase().includes(q)
      );
    }
    if (destination !== "All") list = list.filter((p) => p.destination === destination);
    if (category !== "All") list = list.filter((p) => p.category === category);

    const dur = DURATIONS[durationIdx];
    list = list.filter((p) => p.duration >= dur.min && p.duration <= dur.max);

    const bud = BUDGETS[budgetIdx];
    list = list.filter((p) => {
      const total = (p.price || 0) + (p.margin || 0);
      return total >= bud.min && total <= bud.max;
    });

    if (sort === "price_asc") list.sort((a, b) => ((a.price || 0) + (a.margin || 0)) - ((b.price || 0) + (b.margin || 0)));
    else if (sort === "price_desc") list.sort((a, b) => ((b.price || 0) + (b.margin || 0)) - ((a.price || 0) + (a.margin || 0)));
    else if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return list;
  }, [allPackages, destination, category, durationIdx, budgetIdx, sort, search]);

  const resetFilters = () => {
    setDestination("All");
    setCategory("All");
    setDurationIdx(0);
    setBudgetIdx(0);
    setSort("popular");
    setSearch("");
  };

  const hasActiveFilters =
    destination !== "All" || category !== "All" || durationIdx !== 0 || budgetIdx !== 0 || search.trim() !== "";

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Tour Packages</h1>
          <p className={styles.pageSubtitle}>
            {loading ? "Loading..." : `${filtered.length} handcrafted packages — find your perfect trip`}
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <h3>Filters</h3>
              {hasActiveFilters && <button className={styles.clearBtn} onClick={resetFilters}>Clear All</button>}
              <button className={styles.closeSidebar} onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <Icon icon="mdi:close" />
              </button>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Search</label>
              <div className={styles.searchWrap}>
                <Icon icon="mdi:magnify" className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Destination, package name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Destination</label>
              <div className={styles.chipGroup}>
                {destinations.map((d) => (
                  <button key={d} className={`${styles.chip} ${destination === d ? styles.chipActive : ""}`} onClick={() => setDestination(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Trip Type</label>
              <div className={styles.chipGroup}>
                {CATEGORIES.map((c) => (
                  <button key={c} className={`${styles.chip} ${category === c ? styles.chipActive : ""}`} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Duration</label>
              <div className={styles.radioGroup}>
                {DURATIONS.map((d, i) => (
                  <label key={i} className={styles.radioLabel}>
                    <input type="radio" name="duration" checked={durationIdx === i} onChange={() => setDurationIdx(i)} />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Budget (per person)</label>
              <div className={styles.radioGroup}>
                {BUDGETS.map((b, i) => (
                  <label key={i} className={styles.radioLabel}>
                    <input type="radio" name="budget" checked={budgetIdx === i} onChange={() => setBudgetIdx(i)} />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {filtersOpen && <div className={styles.overlay} onClick={() => setFiltersOpen(false)} />}

          <main className={styles.main}>
            <div className={styles.toolbar}>
              <button className={styles.filterToggle} onClick={() => setFiltersOpen(true)}>
                <Icon icon="mdi:filter-outline" />
                Filters
                {hasActiveFilters && <span className={styles.filterBadge} />}
              </button>
              <span className={styles.resultCount}>{filtered.length} {filtered.length === 1 ? "package" : "packages"} found</span>
              <div className={styles.sortWrap}>
                <Icon icon="mdi:sort" className={styles.sortIcon} />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingGrid}>
                {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.skeleton} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <Icon icon="mdi:package-variant-remove" width={56} height={56} />
                <h3>No packages found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className={styles.clearBtn} onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((pkg) => <PackageCard key={pkg._id || pkg.slug} pkg={pkg} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg }) {
  const displayPrice = (pkg.price || 0) + (pkg.margin || 0);
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - displayPrice) / pkg.originalPrice) * 100)
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardImageWrap}>
        <Image
          src={pkg.thumbnail || "/images/ladakh.webp"}
          alt={pkg.title}
          fill
          className={styles.cardImage}
        />
        {pkg.badge && <span className={styles.cardBadge}>{pkg.badge}</span>}
        {discount && <span className={styles.discountBadge}>-{discount}%</span>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardLocation}>
            <Icon icon="mdi:map-marker-outline" />
            {pkg.location || pkg.destination}
          </span>
          <span className={styles.cardRating}>
            <Icon icon="mdi:star" />
            {pkg.rating || 4.5}{pkg.reviews > 0 && <em> ({pkg.reviews})</em>}
          </span>
        </div>

        <h3 className={styles.cardTitle}>{pkg.title}</h3>
        <p className={styles.cardSubtitle}>{pkg.subtitle || `${pkg.duration} Days`}</p>

        {pkg.highlights?.length > 0 && (
          <div className={styles.cardHighlights}>
            {pkg.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className={styles.highlight}>
                <Icon icon="mdi:check-circle-outline" />
                {h}
              </span>
            ))}
          </div>
        )}

        <div className={styles.cardFooter}>
          <div className={styles.priceBlock}>
            <span className={styles.priceFrom}>Starting from</span>
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{displayPrice.toLocaleString("en-IN")}</span>
              {pkg.originalPrice && (
                <span className={styles.originalPrice}>₹{Number(pkg.originalPrice).toLocaleString("en-IN")}</span>
              )}
            </div>
            <span className={styles.pricePer}>/person*</span>
          </div>
          <Link href={`/package/${pkg.slug}`} className={styles.cardBtn}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
