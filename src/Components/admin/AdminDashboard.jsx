"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import styles from "./admin.module.scss";
import PackageForm from "./PackageForm";
import PdfConverter from "./PdfConverter";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [view, setView] = useState("packages"); // "packages" | "leads" | "converter"
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/package");
      const json = await res.json();
      setPackages(json.data || []);
    } catch { setPackages([]); }
    finally { setLoading(false); }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      setLeads(json.data || []);
    } catch { setLeads([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authed) return;
    if (view === "packages") fetchPackages();
    else fetchLeads();
  }, [authed, view, fetchPackages, fetchLeads]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const json = await res.json();
      if (json.success) {
        setAuthed(true);
      } else {
        setLoginError(json.message || "Invalid username or password.");
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEdit = async (slug) => {
    try {
      const res = await fetch(`/api/package/${slug}`);
      const json = await res.json();
      if (json.success) {
        setEditPkg(json.data);
        setPrefillData(null);
        setShowForm(true);
      } else {
        showToast("Could not load package details.", "error");
      }
    } catch {
      showToast("Something went wrong.", "error");
    }
  };

  const handleDelete = async (slug) => {
    try {
      const res = await fetch(`/api/package/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("Package deleted successfully.");
        fetchPackages();
      } else {
        showToast(json.message || "Delete failed.", "error");
      }
    } catch {
      showToast("Something went wrong.", "error");
    }
    setDeleteConfirm(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    const wasEdit = !!editPkg;
    setEditPkg(null);
    setPrefillData(null);
    fetchPackages();
    showToast(wasEdit ? "Package updated!" : "Package created!");
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <Icon icon="mdi:airplane-takeoff" width={36} />
            <span>World Tour Trip</span>
          </div>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.loginField}>
              <label>Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData((p) => ({ ...p, username: e.target.value }))}
                placeholder="Username"
                required
                autoComplete="username"
              />
            </div>
            <div className={styles.loginField}>
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button type="submit" className={styles.loginBtn} disabled={loginLoading}>
              {loginLoading ? <><Icon icon="mdi:loading" className={styles.spin} /> Verifying...</> : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Icon icon="mdi:airplane-takeoff" width={24} />
          <span>WTT Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${view === "packages" ? styles.navActive : ""}`}
            onClick={() => setView("packages")}
          >
            <Icon icon="mdi:package-variant" />
            Packages
          </button>
          <button
            className={`${styles.navItem} ${view === "leads" ? styles.navActive : ""}`}
            onClick={() => setView("leads")}
          >
            <Icon icon="mdi:account-multiple" />
            Leads
          </button>
          <button
            className={`${styles.navItem} ${view === "converter" ? styles.navActive : ""}`}
            onClick={() => setView("converter")}
          >
            <Icon icon="mdi:file-convert" />
            PDF Converter
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>
          <Icon icon="mdi:logout" />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>
            {view === "packages" ? "Manage Packages" : view === "leads" ? "Lead Enquiries" : "PDF Converter"}
          </h1>
          {view === "packages" && (
            <button className={styles.addBtn} onClick={() => { setEditPkg(null); setShowForm(true); }}>
              <Icon icon="mdi:plus" />
              Add Package
            </button>
          )}
        </div>

        {/* Packages view */}
        {view === "packages" && (
          <>
            {loading ? (
              <div className={styles.loadingMsg}><Icon icon="mdi:loading" className={styles.spin} /> Loading...</div>
            ) : packages.length === 0 ? (
              <div className={styles.emptyMsg}>
                <Icon icon="mdi:package-variant-remove" width={48} />
                <p>No packages yet. Add your first package!</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>Popular</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td>
                          <div className={styles.pkgTitle}>{pkg.title}</div>
                          <div className={styles.pkgSlug}>{pkg.slug}</div>
                        </td>
                        <td>{pkg.destination}</td>
                        <td>{pkg.duration} Days</td>
                        <td>₹{Number(pkg.price).toLocaleString("en-IN")}</td>
                        <td>
                          <span className={pkg.isPopular ? styles.badgeGreen : styles.badgeGray}>
                            {pkg.isPopular ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => handleEdit(pkg.slug)}
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" />
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => setDeleteConfirm(pkg.slug)}
                              title="Delete"
                            >
                              <Icon icon="mdi:trash-can-outline" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Leads view */}
        {view === "leads" && (
          <>
            {loading ? (
              <div className={styles.loadingMsg}><Icon icon="mdi:loading" className={styles.spin} /> Loading...</div>
            ) : leads.length === 0 ? (
              <div className={styles.emptyMsg}>
                <Icon icon="mdi:account-off-outline" width={48} />
                <p>No leads yet.</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Destination</th>
                      <th>Travel Date</th>
                      <th>Travelers</th>
                      <th>Source</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.firstName} {lead.lastName}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.email || "—"}</td>
                        <td>{lead.destination || "—"}</td>
                        <td>{lead.travelDate || "—"}</td>
                        <td>{lead.travelers || "—"}</td>
                        <td><span className={styles.sourceTag}>{lead.source}</span></td>
                        <td>{new Date(lead.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* PDF Converter view */}
        {view === "converter" && (
          <PdfConverter
            onCreatePackage={(data) => {
              setEditPkg(null);
              setPrefillData(data);
              setShowForm(true);
              setView("packages");
            }}
          />
        )}
      </main>

      {/* Package form modal */}
      {showForm && (
        <PackageForm
          pkg={editPkg}
          prefill={prefillData}
          onClose={() => { setShowForm(false); setEditPkg(null); setPrefillData(null); }}
          onSuccess={handleFormSuccess}
          showToast={showToast}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <Icon icon="mdi:alert-circle-outline" width={40} className={styles.confirmIcon} />
            <h3>Delete Package?</h3>
            <p>This will deactivate the package. It won&apos;t appear on the site.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className={styles.confirmDelete} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          <Icon icon={toast.type === "error" ? "mdi:alert-circle" : "mdi:check-circle"} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
