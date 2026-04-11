import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CORAL } from "../styles/colors";

function SkeletonCard() {
  return (
    <div className="album-card" style={{ minHeight: 280 }}>
      <div style={{
        height: 200,
        background: "rgba(255,255,255,0.06)",
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }} />
      <div style={{ padding: "1.25rem 1.4rem 1.4rem" }}>
        <div style={{
          height: 10, width: 90, borderRadius: 4, marginBottom: 12,
          background: "rgba(255,255,255,0.06)",
          animation: "skeleton-pulse 1.5s ease-in-out infinite",
        }} />
        <div style={{
          height: 16, width: "65%", borderRadius: 4,
          background: "rgba(255,255,255,0.06)",
          animation: "skeleton-pulse 1.5s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
}

function AlbumCard({ event }) {
  const [hovered, setHovered] = useState(false);

  const eventDate = event.date ? new Date(event.date + "T00:00:00") : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const displayTitle = eventDate ? `${event.title} (${eventDate.getFullYear()})` : event.title;

  return (
    <Link
      to={`/gallery/${event.slug}`}
      className="album-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          src={event.cover_url}
          alt={event.title}
          className={`album-card-img${hovered ? " hovered" : ""}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div className={`album-card-overlay${hovered ? " hovered" : ""}`} />

        {event.photo_count > 0 && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            fontSize: 11, fontWeight: 600, padding: "4px 10px",
            borderRadius: 20, backdropFilter: "blur(4px)",
            letterSpacing: 0.5,
          }}>
            {event.photo_count} photos
          </div>
        )}
      </div>

      <div style={{ padding: "1.25rem 1.4rem 1.4rem", textAlign: "center" }}>
        <div style={{
          fontSize: 11, color: CORAL, textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 6, fontWeight: 600,
        }}>
          {formattedDate}
        </div>
        <h3 style={{
          fontSize: 17, fontWeight: 700, color: "#fff",
          margin: "0 0 1rem", lineHeight: 1.3,
        }}>
          {displayTitle}
        </h3>

        <div className={`album-view-btn${hovered ? " hovered" : ""}`} style={{ justifyContent: "center" }}>
          <span style={{ marginRight: 8 }}>View Album</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function GallerySection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error: fetchErr } = await supabase
        .from("events")
        .select("id, slug, title, date, cover_url, photo_count")
        .eq("published", true)
        .order("date", { ascending: false });

      if (fetchErr) {
        setError("Could not load events. Please try again later.");
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <section id="gallery" style={{ background: "#0d0620", padding: "5rem 2.5rem", flex: 1 }}>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: CORAL, marginBottom: 10, fontWeight: 600,
          }}>
            Past Events
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
            Moments We Created
          </h2>
          <p style={{ fontSize: 16, color: "#aaa", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Every event is a story. Browse our albums and relive the energy, the vibes, and the memories.
          </p>
        </div>

        <div className="gallery-grid">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : error
            ? (
              <div style={{
                gridColumn: "1 / -1", textAlign: "center",
                padding: "3rem 1rem", color: "#888", fontSize: 15,
              }}>
                {error}
              </div>
            )
            : events.map(event => <AlbumCard key={event.id} event={event} />)
          }
        </div>
      </div>
    </section>
  );
}