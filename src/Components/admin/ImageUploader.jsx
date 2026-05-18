"use client";

import { useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import styles from "./imageUploader.module.scss";

/**
 * ImageUploader
 *
 * Props:
 *  images      {Array<{url, public_id}>}  current gallery images
 *  onChange    {fn(images)}               called with updated array
 *  maxImages   {number}                   default 10
 *  folder      {string}                   Cloudinary folder, default "packages"
 *  label       {string}
 */
export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 10,
  folder = "packages",
  label = "Gallery Images",
}) {
  const [uploading, setUploading] = useState([]); // [{id, name, progress, error}]
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = useCallback(
    async (file, tempId) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Simulate progress with XHR for real progress events
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 90); // cap at 90 until server responds
            setUploading((prev) =>
              prev.map((u) => (u.id === tempId ? { ...u, progress: pct } : u))
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const json = JSON.parse(xhr.responseText);
            if (json.success) {
              setUploading((prev) =>
                prev.map((u) => (u.id === tempId ? { ...u, progress: 100 } : u))
              );
              resolve({ url: json.url, public_id: json.public_id });
            } else {
              reject(new Error(json.message || "Upload failed"));
            }
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });
    },
    [folder]
  );

  const handleFiles = useCallback(
    async (files) => {
      const remaining = maxImages - images.length;
      const toUpload = Array.from(files).slice(0, remaining);

      if (toUpload.length === 0) return;

      // Validate types
      const valid = toUpload.filter((f) => f.type.startsWith("image/"));
      if (valid.length === 0) return;

      // Add pending entries
      const pending = valid.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        progress: 0,
        error: null,
        preview: URL.createObjectURL(f),
      }));
      setUploading((prev) => [...prev, ...pending]);

      // Upload concurrently
      await Promise.all(
        valid.map(async (file, i) => {
          const tempId = pending[i].id;
          try {
            const result = await uploadFile(file, tempId);
            onChange([...images, result]);
            // Remove from uploading after short delay so user sees 100%
            setTimeout(() => {
              setUploading((prev) => prev.filter((u) => u.id !== tempId));
            }, 800);
          } catch (err) {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === tempId ? { ...u, error: err.message, progress: 0 } : u
              )
            );
          }
        })
      );
    },
    [images, maxImages, onChange, uploadFile]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = async (idx) => {
    const img = images[idx];
    // Soft delete from Cloudinary (best-effort, don't block UI)
    if (img.public_id) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: img.public_id }),
      }).catch(() => {});
    }
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  const dismissError = (id) => {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  };

  const canUploadMore = images.length + uploading.filter((u) => !u.error).length < maxImages;

  return (
    <div className={styles.uploader}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.counter}>
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Drop zone */}
      {canUploadMore && (
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload images"
        >
          <Icon icon="mdi:cloud-upload-outline" className={styles.dropIcon} />
          <p className={styles.dropText}>
            <strong>Click to upload</strong> or drag &amp; drop
          </p>
          <p className={styles.dropHint}>
            PNG, JPG, WEBP — up to {maxImages - images.length} more image{maxImages - images.length !== 1 ? "s" : ""}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.hiddenInput}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Upload progress items */}
      {uploading.length > 0 && (
        <div className={styles.progressList}>
          {uploading.map((u) => (
            <div key={u.id} className={`${styles.progressItem} ${u.error ? styles.progressError : ""}`}>
              {u.preview && (
                <div className={styles.progressThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt={u.name} />
                </div>
              )}
              <div className={styles.progressInfo}>
                <span className={styles.progressName}>{u.name}</span>
                {u.error ? (
                  <span className={styles.progressErrorMsg}>{u.error}</span>
                ) : (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${u.progress}%` }} />
                  </div>
                )}
              </div>
              {(u.error || u.progress === 100) && (
                <button
                  type="button"
                  className={styles.progressDismiss}
                  onClick={() => dismissError(u.id)}
                  aria-label="Dismiss"
                >
                  <Icon icon="mdi:close" />
                </button>
              )}
              {!u.error && u.progress < 100 && (
                <span className={styles.progressPct}>{u.progress}%</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((img, idx) => (
            <div key={img.public_id || img.url || idx} className={styles.gridItem}>
              {idx === 0 && <span className={styles.coverBadge}>Cover</span>}

              <div className={styles.gridImageWrap}>
                <Image
                  src={img.url}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className={styles.gridImage}
                  sizes="120px"
                />
              </div>

              {/* Actions overlay */}
              <div className={styles.gridOverlay}>
                {idx > 0 && (
                  <button
                    type="button"
                    className={styles.gridAction}
                    onClick={() => moveImage(idx, idx - 1)}
                    title="Move left"
                    aria-label="Move left"
                  >
                    <Icon icon="mdi:chevron-left" />
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.gridAction} ${styles.gridRemove}`}
                  onClick={() => handleRemove(idx)}
                  title="Remove"
                  aria-label="Remove image"
                >
                  <Icon icon="mdi:trash-can-outline" />
                </button>
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    className={styles.gridAction}
                    onClick={() => moveImage(idx, idx + 1)}
                    title="Move right"
                    aria-label="Move right"
                  >
                    <Icon icon="mdi:chevron-right" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className={styles.hint}>
          <Icon icon="mdi:information-outline" />
          First image is used as the cover/thumbnail. Drag arrows to reorder.
        </p>
      )}
    </div>
  );
}
