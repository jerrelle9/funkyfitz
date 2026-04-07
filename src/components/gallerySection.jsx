import { useState } from "react";
import { albums } from "../data/siteData";
import { YELLOW, PURPLE, CORAL } from "../styles/colors";

function AlbumCard({ album }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={album.facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="album-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "block" }}
    >
      {/* Cover image */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          src={album.cover}
          alt={album.title}
          className={`album-card-img${hovered ? " hovered" : ""}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div className={`album-card-overlay${hovered ? " hovered" : ""}`} />

        {/* Photo count badge */}
        {album.photoCount && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            fontSize: 11, fontWeight: 600, padding: "4px 10px",
            borderRadius: 20, backdropFilter: "blur(4px)",
            letterSpacing: 0.5,
          }}>
            {album.photoCount} photos
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "1.25rem 1.4rem 1.4rem" }}>
        <div style={{ fontSize: 11, color: CORAL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>
          {album.date}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 1rem", lineHeight: 1.3 }}>
          {album.title}
        </h3>

        <div className={`album-view-btn${hovered ? " hovered" : ""}`}>
          <span style={{ marginRight: 8 }}>View Album</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </div>
    </a>
  );
}

export default function GallerySection() {
  return (
    <section style={{ background: "#0d0620", padding: "5rem 2.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: CORAL, marginBottom: 10, fontWeight: 600 }}>
            Past Events
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
            Moments We Created
          </h2>
          <p style={{ fontSize: 16, color: "#aaa", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Every event is a story. Browse our albums and relive the energy, the vibes, and the memories.
          </p>
        </div>

        {/* Grid */}
        <div className="gallery-grid">
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>

        {/* CTA */}
        {/* <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <a
            href="https://www.facebook.com/profile.php?id=100086891394758"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: PURPLE, color: "#fff",
              padding: "14px 32px", borderRadius: 50,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            See All Albums on Facebook
          </a>
        </div> */}

      </div>
    </section>
  );
}
