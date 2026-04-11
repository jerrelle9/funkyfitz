import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CORAL, PURPLE } from "../styles/colors";
import Navbar from "../components/navbar";

function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(
    () => setIndex(i => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex(i => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const fullResUrl = supabase.storage
  .from("event-galleries")
  .getPublicUrl(images[index])  // no transform
  .data.publicUrl;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.93)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <img
        src={fullResUrl}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "88vh",
          width: "auto",
          height: "auto",
          display: "block",
          borderRadius: 8,
          boxShadow: "0 8px 60px rgba(0,0,0,0.8)",
          userSelect: "none",
        }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: 20, right: 24,
          background: "rgba(255,255,255,0.12)", border: "none",
          color: "#fff", fontSize: 22, cursor: "pointer",
          width: 44, height: 44, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1, zIndex: 1001,
        }}
      >✕</button>

      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{
              position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)", border: "none",
              color: "#fff", fontSize: 28, cursor: "pointer",
              width: 48, height: 48, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1001,
            }}
          >‹</button>

          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{
              position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)", border: "none",
              color: "#fff", fontSize: 28, cursor: "pointer",
              width: 48, height: 48, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1001,
            }}
          >›</button>
        </>
      )}

      <div style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500,
        letterSpacing: 0.5,
      }}>
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

export default function EventGallery() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data: eventData, error: eventErr } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (eventErr || !eventData) {
        setError("Event not found.");
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const { data: files, error: storageErr } = await supabase.storage
        .from("event-galleries")
        .list(eventData.bucket_folder, {
          limit: 500,
          sortBy: { column: "name", order: "asc" },
        });

      if (storageErr) {
        setError("Could not load photos.");
        setLoading(false);
        return;
      }

      const imageFiles = (files || []).filter(f =>
        /\.(jpe?g|png|webp|gif)$/i.test(f.name)
      );

      setImagePaths(imageFiles.map(f => `${eventData.bucket_folder}/${f.name}`));
      setLoading(false);
    }

    load();
  }, [slug]);

  function getThumbnailUrl(path) {
    return supabase.storage
      .from("event-galleries")
      .getPublicUrl(path, { transform: { width: 600, quality: 80 } })
      .data.publicUrl;
  }

  if (loading) {
    return (
      <div style={{
        background: "#0d0620", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ color: "#888", fontSize: 15 }}>Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#0d0620", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{ color: "#aaa", fontSize: 16 }}>{error}</div>
        <Link to="/" style={{ color: CORAL, fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const eventDate = event.date ? new Date(event.date + "T00:00:00") : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const displayTitle = eventDate ? `${event.title} (${eventDate.getFullYear()})` : event.title;

  return (
    <div style={{ background: "#0d0620", minHeight: "100vh" }}>
      <Navbar />
      {/* Header bar */}
      <div style={{
        background: "#1a0a3a",
        borderBottom: "1px solid rgba(107,33,200,0.2)",
        padding: "1.25rem 2.5rem",
        position: "relative",
        textAlign: "center",
      }}>
        <div className="desktop-only" style={{ position: "absolute", left: "2.5rem", top: "50%", transform: "translateY(-50%)" }}>
          <Link
            to="/gallery"
            style={{
              color: CORAL, textDecoration: "none", fontWeight: 600,
              fontSize: 14, display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Events
          </Link>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>
          {displayTitle}
        </h1>
        <div style={{
          fontSize: 12, color: CORAL, textTransform: "uppercase",
          letterSpacing: 2, fontWeight: 600, marginTop: 3,
        }}>
          {formattedDate}
        </div>
      </div>

      {/* Photo grid */}
      <div style={{ padding: "2.5rem" }}>
        {imagePaths.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", paddingTop: "5rem", fontSize: 15 }}>
            No photos yet.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}>
            {imagePaths.map((path, i) => (
              <div
                key={path}
                onClick={() => setLightboxIndex(i)}
                style={{
                  aspectRatio: "4/3",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <img
                  src={getThumbnailUrl(path)}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.25s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to top */}
      {imagePaths.length > 0 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: 28, right: 28,
            background: PURPLE, border: "none", color: "#fff",
            width: 44, height: 44, borderRadius: "50%",
            cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(107,33,200,0.5)",
            zIndex: 50,
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={imagePaths}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}