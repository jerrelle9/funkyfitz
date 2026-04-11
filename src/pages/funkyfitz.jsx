import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Footer from "../components/footer";
import { DARK, CORAL } from "../styles/colors";
import { supabase } from "../lib/supabase";

function SkeletonCard() {
  return (
    <div className="album-card" style={{ minHeight: 260 }}>
      <div style={{ height: 180, background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.5s ease-in-out infinite" }} />
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <div style={{ height: 10, width: 80, borderRadius: 4, marginBottom: 10, background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 15, width: "65%", borderRadius: 4, background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function PastEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, slug, title, date, cover_url")
      .eq("published", true)
      .order("date", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ background: "#0d0620", padding: "5rem 2.5rem" }}>
      <style>{`@keyframes skeleton-pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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

        <div className="gallery-grid">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : events.map(event => {
                const year = event.date ? new Date(event.date + "T00:00:00").getFullYear() : null;
                return (
                  <Link
                    key={event.id}
                    to={`/gallery/${event.slug}`}
                    className="album-card"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div style={{ overflow: "hidden", position: "relative" }}>
                      <img
                        src={event.cover_url}
                        alt={event.title}
                        className="album-card-img"
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                      />
                      <div className="album-card-overlay" />
                    </div>
                    <div style={{ padding: "1rem 1.25rem 1.25rem", textAlign: "center" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                        {event.title}{year ? ` (${year})` : ""}
                      </h3>
                    </div>
                  </Link>
                );
              })
          }
        </div>

        {!loading && events.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              to="/gallery"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: CORAL, fontWeight: 700, fontSize: 14,
                textDecoration: "none", letterSpacing: 0.3,
              }}
            >
              View all events
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function FunkyFitz() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0, background: "#fff", color: DARK }}>
      <Navbar />
      <Hero />
      <PastEventsSection />
      <Footer />
    </div>
  );
}