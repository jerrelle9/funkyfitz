import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { supabase } from "../../lib/supabase";
import { PURPLE, CORAL } from "../../styles/colors";

const IMAGE_TYPES = /\.(jpe?g|png|webp)$/i;
const COMPRESS_OPTIONS = { maxSizeMB: 0.2, maxWidthOrHeight: 1920, useWebWorker: true };
const isMobile = window.innerWidth < 768;

export default function ImageUploader({ bucketFolder, onComplete }) {
  const [mode, setMode] = useState(isMobile ? "zip" : "folder");
  const [queued, setQueued] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [failedFiles, setFailedFiles] = useState([]); // [{ name, reason, file }]
  const [firstError, setFirstError] = useState(null);
  const [finished, setFinished] = useState(false);
  const [zipError, setZipError] = useState(null);

  const folderRef = useRef();
  const zipRef = useRef();

  function reset() {
    setQueued([]);
    setFinished(false);
    setFirstError(null);
    setFailedFiles([]);
    setZipError(null);
    setDone(0);
    setTotal(0);
  }

  function handleFolderChange(e) {
    const files = Array.from(e.target.files).filter(f => IMAGE_TYPES.test(f.name));
    reset();
    setQueued(files.map(f => ({ name: f.name, file: f })));
  }

  async function handleZipChange(e) {
    const zipFile = e.target.files[0];
    if (!zipFile) return;
    reset();
    setZipError(null);

    try {
      const zip = await JSZip.loadAsync(zipFile);
      const entries = [];
      zip.forEach((path, entry) => {
        if (!entry.dir && IMAGE_TYPES.test(entry.name)) entries.push(entry);
      });

      if (entries.length === 0) {
        setZipError("No images found in the zip. Make sure it contains .jpg, .png, or .webp files.");
        return;
      }

      const files = await Promise.all(
        entries.map(async entry => {
          const blob = await entry.async("blob");
          const name = entry.name.split("/").pop();
          return { name, file: new File([blob], name, { type: "image/jpeg" }) };
        })
      );
      setQueued(files);
    } catch (err) {
      setZipError(`Could not read zip file: ${err.message}`);
    }
  }

  async function startUpload() {
    if (queued.length === 0 || uploading) return;

    setUploading(true);
    setDone(0);
    setTotal(queued.length);
    setFailedFiles([]);
    setFirstError(null);

    const uploadedPaths = [];
    const failed = [];
    let capturedError = null;

    for (const { name, file } of queued) {
      try {
        const compressed = await imageCompression(file, COMPRESS_OPTIONS);
        const path = `${bucketFolder}/${name}`;
        const { error } = await supabase.storage
          .from("event-galleries")
          .upload(path, compressed, { upsert: true });
        if (error) throw error;
        uploadedPaths.push(path);
      } catch (err) {
        failed.push({ name, reason: err.message, file });
        if (!capturedError) capturedError = err.message;
      }
      setDone(d => d + 1);
    }

    setFailedFiles(failed);
    setFirstError(capturedError);
    setUploading(false);
    setFinished(true);

    if (uploadedPaths.length > 0) onComplete(uploadedPaths);
  }

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const successCount = done - failedFiles.length;
  const allFailed = finished && successCount === 0;

  // Progress view
  if (uploading) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Uploading… {done} / {total}</span>
          <span style={{ color: "#888" }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: PURPLE, borderRadius: 3,
            transition: "width 0.2s ease",
          }} />
        </div>
      </div>
    );
  }

  // Finished view
  if (finished) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Success count */}
        {successCount > 0 && (
          <div style={{
            padding: "1rem 1.25rem",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 10,
            fontSize: 14, color: "#22c55e", fontWeight: 600,
          }}>
            ✓ {successCount} photo{successCount !== 1 ? "s" : ""} uploaded
          </div>
        )}

        {/* Error details */}
        {allFailed && firstError && (
          <div style={{
            padding: "1rem 1.25rem",
            background: "rgba(255,92,77,0.08)",
            border: "1px solid rgba(255,92,77,0.3)",
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 14, color: CORAL, fontWeight: 700, marginBottom: 4 }}>
              Upload failed
            </div>
            <div style={{ fontSize: 13, color: "#ff9a8b" }}>{firstError}</div>
          </div>
        )}

        {/* Partial failures */}
        {!allFailed && failedFiles.length > 0 && (
          <div style={{
            padding: "0.75rem 1.25rem",
            background: "rgba(255,92,77,0.06)",
            border: "1px solid rgba(255,92,77,0.2)",
            borderRadius: 10,
            fontSize: 13, color: CORAL,
          }}>
            {failedFiles.length} file{failedFiles.length !== 1 ? "s" : ""} failed — {failedFiles[0]?.reason}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {failedFiles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQueued(failedFiles.map(f => ({ name: f.name, file: f.file })));
                setFinished(false);
                setFailedFiles([]);
                setFirstError(null);
                setDone(0);
                setTotal(0);
              }}
              style={{
                background: "rgba(255,92,77,0.1)",
                border: "1px solid rgba(255,92,77,0.3)",
                color: CORAL, borderRadius: 8,
                padding: "7px 16px", fontSize: 13,
                cursor: "pointer", fontWeight: 600,
              }}
            >
              Retry {failedFiles.length} failed
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#aaa", borderRadius: 8,
              padding: "7px 16px", fontSize: 13,
              cursor: "pointer",
            }}
          >
            Upload more
          </button>
        </div>
      </div>
    );
  }

  // Default / selection view
  return (
    <div>
      {/* Mode tabs — folder upload not supported on mobile */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["folder", "zip"].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); reset(); }}
              style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: `1px solid ${mode === m ? PURPLE : "rgba(255,255,255,0.1)"}`,
                background: mode === m ? "rgba(107,33,200,0.15)" : "transparent",
                color: mode === m ? "#fff" : "#888",
                cursor: "pointer",
              }}
            >
              {m === "folder" ? "Folder" : "Zip File"}
            </button>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => (mode === "folder" ? folderRef : zipRef).current?.click()}
        style={{
          border: "2px dashed rgba(107,33,200,0.35)",
          borderRadius: 12, padding: "2rem",
          textAlign: "center", cursor: "pointer",
          background: "rgba(107,33,200,0.04)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(107,33,200,0.7)";
          e.currentTarget.style.background = "rgba(107,33,200,0.09)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(107,33,200,0.35)";
          e.currentTarget.style.background = "rgba(107,33,200,0.04)";
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>{mode === "folder" ? "📁" : "🗜️"}</div>
        <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
          {mode === "folder" ? "Click to select a folder" : "Click to select a zip file"}
        </div>
        <div style={{ color: "#666", fontSize: 12 }}>
          {mode === "folder"
            ? "All images inside will be uploaded"
            : "Images inside the zip will be extracted and uploaded"}
        </div>
        {queued.length > 0 && (
          <div style={{ marginTop: 10, color: "#22c55e", fontWeight: 700, fontSize: 14 }}>
            {queued.length} image{queued.length !== 1 ? "s" : ""} ready
          </div>
        )}
      </div>

      {zipError && (
        <div style={{
          marginTop: 10, padding: "10px 14px",
          background: "rgba(255,92,77,0.08)",
          border: "1px solid rgba(255,92,77,0.3)",
          borderRadius: 8, fontSize: 13, color: CORAL,
        }}>
          {zipError}
        </div>
      )}

      <input ref={folderRef} type="file" webkitdirectory="" multiple accept="image/*"
        onChange={handleFolderChange} style={{ display: "none" }} />
      <input ref={zipRef} type="file" accept=".zip"
        onChange={handleZipChange} style={{ display: "none" }} />

      {queued.length > 0 && (
        <button
          type="button"
          onClick={startUpload}
          style={{
            marginTop: 14, width: "100%",
            background: PURPLE, color: "#fff", border: "none",
            borderRadius: 10, padding: "12px",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Upload {queued.length} photo{queued.length !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
