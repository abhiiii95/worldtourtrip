"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import styles from "./admin.module.scss";

export default function PdfConverter({ onCreatePackage }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | converting | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [extracted, setExtracted] = useState(null);
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    setExtracted(null);
  };

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("File must be under 10MB.");
      return;
    }
    setErrorMsg("");
    setFile(f);
    setStatus("idle");
    setExtracted(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setErrorMsg("");
    setExtracted(null);

    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await fetch("/api/convert-pdf", { method: "POST", body: fd });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Conversion failed.");

      setExtracted(json.data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.converterWrap}>
      <div className={styles.converterInfo}>
        <Icon icon="mdi:information-outline" width={18} />
        <p>
          Upload any travel package PDF (agency brochure, B2B rate sheet, etc.). AI will extract
          all package details — hotel options, pricing, itinerary, inclusions &amp; exclusions —
          and let you create a package instantly.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""} ${file ? styles.dropZoneHasFile : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className={styles.filePreview}>
            <Icon icon="mdi:file-pdf-box" width={40} className={styles.fileIcon} />
            <div className={styles.fileMeta}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</span>
            </div>
            <button
              className={styles.fileRemove}
              onClick={(e) => { e.stopPropagation(); reset(); }}
              title="Remove"
            >
              <Icon icon="mdi:close-circle" width={20} />
            </button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <Icon icon="mdi:cloud-upload-outline" width={48} className={styles.dropIcon} />
            <p className={styles.dropTitle}>Drop your PDF here or click to browse</p>
            <p className={styles.dropSub}>Any travel package PDF · Max 10MB</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className={styles.converterError}>
          <Icon icon="mdi:alert-circle-outline" width={16} />
          {errorMsg}
        </div>
      )}

      {/* Convert button */}
      {!extracted && (
        <div className={styles.converterActions}>
          <button
            className={styles.convertBtn}
            onClick={handleConvert}
            disabled={!file || status === "converting"}
          >
            {status === "converting" ? (
              <>
                <Icon icon="mdi:loading" className={styles.spin} />
                Extracting with AI...
              </>
            ) : (
              <>
                <Icon icon="mdi:magic-staff" />
                Extract &amp; Convert
              </>
            )}
          </button>
        </div>
      )}

      {/* Result preview */}
      {extracted && (
        <div className={styles.extractedCard}>
          <div className={styles.extractedHeader}>
            <Icon icon="mdi:check-circle" width={20} className={styles.extractedCheck} />
            <span>Extraction complete — review details below</span>
          </div>

          <div className={styles.extractedGrid}>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Title</span>
              <span className={styles.extractedVal}>{extracted.title || "—"}</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Destination</span>
              <span className={styles.extractedVal}>{extracted.destination || "—"}</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Duration</span>
              <span className={styles.extractedVal}>{extracted.nights ? `${extracted.nights}N / ${extracted.duration}D` : "—"}</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Starting Price</span>
              <span className={styles.extractedVal}>
                {extracted.price ? `₹${Number(extracted.price).toLocaleString("en-IN")}` : "—"}
              </span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Hotel Options</span>
              <span className={styles.extractedVal}>{extracted.hotelOptions?.length || 0} options found</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Itinerary Days</span>
              <span className={styles.extractedVal}>{extracted.itinerary?.length || 0} days extracted</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Inclusions</span>
              <span className={styles.extractedVal}>{extracted.included?.length || 0} items</span>
            </div>
            <div className={styles.extractedRow}>
              <span className={styles.extractedLabel}>Exclusions</span>
              <span className={styles.extractedVal}>{extracted.excluded?.length || 0} items</span>
            </div>
          </div>

          <div className={styles.extractedActions}>
            <button
              className={styles.createPkgBtn}
              onClick={() => onCreatePackage(extracted)}
            >
              <Icon icon="mdi:package-variant-plus" />
              Open in Package Form
            </button>
            <button className={styles.convertAgainBtn} onClick={reset}>
              <Icon icon="mdi:refresh" />
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Steps guide */}
      {!extracted && (
        <div className={styles.stepsGuide}>
          <h3 className={styles.stepsTitle}>How it works</h3>
          <ol className={styles.stepsList}>
            <li><span>1</span> Upload any travel package PDF from your agency or B2B partner</li>
            <li><span>2</span> AI extracts hotel options, pricing, itinerary, inclusions &amp; exclusions</li>
            <li><span>3</span> Click <strong>Open in Package Form</strong> to review and save the package</li>
          </ol>
        </div>
      )}
    </div>
  );
}
