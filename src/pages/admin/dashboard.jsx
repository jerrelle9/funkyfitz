import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { YELLOW, CORAL, PURPLE, PURPLE_DARK } from "../../styles/colors";
import logo from "../../assets/logo.png";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingTogglingId, setUpcomingTogglingId] = useState(null);
  const [upcomingDeletingId, setUpcomingDeletingId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchUpcomingEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("id, slug, title, date, photo_count, published")
      .order("date", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  }

  async function fetchUpcomingEvents() {
    const { data } = await supabase
      .from("upcoming_events")
      .select("id, name, date, time, ticket_link, image_url, is_published")
      .order("date", { ascending: true });
    setUpcomingEvents(data || []);
    setUpcomingLoading(false);
  }

  async function toggleUpcomingPublished(event) {
    setUpcomingTogglingId(event.id);
    await supabase
      .from("upcoming_events")
      .update({ is_published: !event.is_published })
      .eq("id", event.id);
    setUpcomingEvents(prev =>
      prev.map(e => e.id === event.id ? { ...e, is_published: !e.is_published } : e)
    );
    setUpcomingTogglingId(null);
  }

  async function deleteUpcomingEvent(event) {
    if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
    setUpcomingDeletingId(event.id);

    // Delete image from storage
    const marker = "/upcoming-events/";
    const idx = event.image_url.indexOf(marker);
    if (idx !== -1) {
      const filename = event.image_url.slice(idx + marker.length);
      await supabase.storage.from("upcoming-events").remove([filename]);
    }

    await supabase.from("upcoming_events").delete().eq("id", event.id);
    setUpcomingEvents(prev => prev.filter(e => e.id !== event.id));
    setUpcomingDeletingId(null);
  }

  async function togglePublished(event) {
    setTogglingId(event.id);
    await supabase
      .from("events")
      .update({ published: !event.published })
      .eq("id", event.id);
    setEvents(prev =>
      prev.map(e => e.id === event.id ? { ...e, published: !e.published } : e)
    );
    setTogglingId(null);
  }

  async function deleteEvent(event) {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    setDeletingId(event.id);

    // Delete all images in storage
    const { data: files } = await supabase.storage
      .from("event-galleries")
      .list(event.slug);

    if (files?.length) {
      await supabase.storage
        .from("event-galleries")
        .remove(files.map(f => `${event.slug}/${f.name}`));
    }

    await supabase.from("events").delete().eq("id", event.id);
    setEvents(prev => prev.filter(e => e.id !== event.id));
    setDeletingId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0620", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <div className="mobile-only"><Navbar /></div>
      <style>{`
        @media (max-width: 1024px) {
          .dash-row { flex-direction: column !important; align-items: flex-start !important; }
          .dash-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      {/* Top bar — desktop only */}
      <div className="desktop-only">
      <div style={{
        background: "#1a0a3a",
        borderBottom: "1px solid rgba(107,33,200,0.25)",
        padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="FunkyFitz" style={{ height: 40, objectFit: "contain" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            <span style={{ color: YELLOW }}>Funky</span><span style={{ color: CORAL }}>Fitz</span>
            <span style={{ color: "#888", fontSize: 10, marginLeft: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Admin
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            to="/"
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#aaa", borderRadius: 8, padding: "7px 16px",
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >
            Home
          </Link>
          <Link
            to="/gallery"
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#aaa", borderRadius: 8, padding: "7px 16px",
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >
            Gallery
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#aaa", borderRadius: 8, padding: "7px 16px",
              fontSize: 13, cursor: "pointer", fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >
            Sign Out
          </button>
        </div>
      </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem", flex: 1, width: "100%" }}>

        {/* Upcoming Events section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>Upcoming Events</h1>
              <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
                {upcomingEvents.length} total · {upcomingEvents.filter(e => e.is_published).length} published
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/upcoming-events/new")}
              style={{
                background: PURPLE, color: "#fff", border: "none",
                borderRadius: 10, padding: "11px 22px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = PURPLE_DARK}
              onMouseLeave={e => e.currentTarget.style.background = PURPLE}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Event
            </button>
          </div>

          {upcomingLoading ? (
            <div style={{ color: "#888", fontSize: 14, textAlign: "center", paddingTop: "1rem" }}>Loading…</div>
          ) : upcomingEvents.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "2.5rem 2rem",
              background: "#1a0a3a", borderRadius: 16,
              border: "1px solid rgba(107,33,200,0.15)",
            }}>
              <div style={{ color: "#888", fontSize: 14 }}>No upcoming events yet.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingEvents.map(event => (
                <div key={event.id} className="dash-row" onClick={() => navigate(`/admin/upcoming-events/${event.id}`)} style={{
                  background: "#1a0a3a",
                  border: "1px solid rgba(107,33,200,0.18)",
                  borderRadius: 14,
                  padding: "1.1rem 1.4rem",
                  display: "flex", alignItems: "center",
                  gap: 16, flexWrap: "wrap",
                  cursor: "pointer",
                }}>
                  {/* Published badge */}
                  <div style={{
                    flexShrink: 0,
                    width: 8, height: 8, borderRadius: "50%",
                    background: event.is_published ? "#22c55e" : "#555",
                    boxShadow: event.is_published ? "0 0 6px #22c55e" : "none",
                  }} />

                  {/* Flyer thumbnail */}
                  <img
                    src={event.image_url}
                    alt={event.name}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {event.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {formatDate(event.date)} · {event.time}
                    </div>
                  </div>

                  {/* Status pill */}
                  <div style={{
                    flexShrink: 0,
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                    padding: "4px 12px", borderRadius: 20,
                    background: event.is_published ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                    color: event.is_published ? "#22c55e" : "#666",
                    textTransform: "uppercase",
                  }}>
                    {event.is_published ? "Published" : "Draft"}
                  </div>

                  {/* Actions */}
                  <div className="dash-actions" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={e => { e.stopPropagation(); toggleUpcomingPublished(event); }}
                      disabled={upcomingTogglingId === event.id}
                      style={{
                        background: event.is_published ? "rgba(255,92,77,0.1)" : "rgba(34,197,94,0.1)",
                        border: `1px solid ${event.is_published ? "rgba(255,92,77,0.3)" : "rgba(34,197,94,0.3)"}`,
                        color: event.is_published ? CORAL : "#22c55e",
                        borderRadius: 8, padding: "6px 14px",
                        fontSize: 13, cursor: upcomingTogglingId === event.id ? "not-allowed" : "pointer",
                        fontWeight: 500, opacity: upcomingTogglingId === event.id ? 0.6 : 1,
                      }}
                    >
                      {event.is_published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={e => { e.stopPropagation(); deleteUpcomingEvent(event); }}
                      disabled={upcomingDeletingId === event.id}
                      style={{
                        background: "rgba(255,92,77,0.08)", border: "1px solid rgba(255,92,77,0.2)",
                        color: "#ff5c4d99", borderRadius: 8, padding: "6px 14px",
                        fontSize: 13, cursor: upcomingDeletingId === event.id ? "not-allowed" : "pointer",
                        fontWeight: 500, opacity: upcomingDeletingId === event.id ? 0.5 : 1,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = CORAL}
                      onMouseLeave={e => e.currentTarget.style.color = "#ff5c4d99"}
                    >
                      {upcomingDeletingId === event.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(107,33,200,0.15)", marginBottom: "3rem" }} />

        {/* Past Events header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>Events</h1>
            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
              {events.length} total · {events.filter(e => e.published).length} published
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/events/new")}
            style={{
              background: PURPLE, color: "#fff", border: "none",
              borderRadius: 10, padding: "11px 22px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = PURPLE_DARK}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Event
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ color: "#888", fontSize: 14, textAlign: "center", paddingTop: "3rem" }}>Loading…</div>
        ) : events.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "#1a0a3a", borderRadius: 16,
            border: "1px solid rgba(107,33,200,0.15)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>No events yet</div>
            <div style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Create your first event to get started.</div>
            <button
              onClick={() => navigate("/admin/events/new")}
              style={{
                background: PURPLE, color: "#fff", border: "none",
                borderRadius: 10, padding: "11px 24px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              + New Event
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map(event => (
              <div key={event.id} className="dash-row" onClick={() => navigate(`/admin/events/${event.slug}`)} style={{
                background: "#1a0a3a",
                border: "1px solid rgba(107,33,200,0.18)",
                borderRadius: 14,
                padding: "1.1rem 1.4rem",
                display: "flex", alignItems: "center",
                gap: 16, flexWrap: "wrap",
                cursor: "pointer",
              }}>
                {/* Published badge */}
                <div style={{
                  flexShrink: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: event.published ? "#22c55e" : "#555",
                  boxShadow: event.published ? "0 0 6px #22c55e" : "none",
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {formatDate(event.date)}
                    {event.photo_count > 0 && (
                      <span style={{ marginLeft: 10, color: "#666" }}>· {event.photo_count} photos</span>
                    )}
                  </div>
                </div>

                {/* Status pill */}
                <div style={{
                  flexShrink: 0,
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  padding: "4px 12px", borderRadius: 20,
                  background: event.published ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                  color: event.published ? "#22c55e" : "#666",
                  textTransform: "uppercase",
                }}>
                  {event.published ? "Published" : "Draft"}
                </div>

                {/* Actions */}
                <div className="dash-actions" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); togglePublished(event); }}
                    disabled={togglingId === event.id}
                    style={{
                      background: event.published ? "rgba(255,92,77,0.1)" : "rgba(34,197,94,0.1)",
                      border: `1px solid ${event.published ? "rgba(255,92,77,0.3)" : "rgba(34,197,94,0.3)"}`,
                      color: event.published ? CORAL : "#22c55e",
                      borderRadius: 8, padding: "6px 14px",
                      fontSize: 13, cursor: togglingId === event.id ? "not-allowed" : "pointer",
                      fontWeight: 500, opacity: togglingId === event.id ? 0.6 : 1,
                    }}
                  >
                    {event.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={e => { e.stopPropagation(); deleteEvent(event); }}
                    disabled={deletingId === event.id}
                    style={{
                      background: "rgba(255,92,77,0.08)", border: "1px solid rgba(255,92,77,0.2)",
                      color: "#ff5c4d99", borderRadius: 8, padding: "6px 14px",
                      fontSize: 13, cursor: deletingId === event.id ? "not-allowed" : "pointer",
                      fontWeight: 500, opacity: deletingId === event.id ? 0.5 : 1,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = CORAL}
                    onMouseLeave={e => e.currentTarget.style.color = "#ff5c4d99"}
                  >
                    {deletingId === event.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
