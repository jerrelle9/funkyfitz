import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PURPLE, PURPLE_DARK, CORAL } from "../../styles/colors";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function generateSlug(title, date) {
  const year = date ? new Date(date + "T00:00:00").getFullYear() : "";
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return year ? `${titleSlug}-${year}` : titleSlug;
}

export default function NewEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const slug = title && date ? generateSlug(title, date) : "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!slug) return;
    setError(null);
    setSubmitting(true);

    const { error: insertErr } = await supabase.from("events").insert({
      slug,
      title,
      date,
      bucket_folder: slug,
      published: false,
    });

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }

    navigate(`/admin/events/${slug}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0620", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "#1a0a3a",
        borderBottom: "1px solid rgba(107,33,200,0.25)",
        padding: "1.1rem 2rem",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <Link
          to="/admin"
          style={{ color: CORAL, textDecoration: "none", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>New Event</h1>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem 2rem", flex: 1, width: "100%" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bubble Gum"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <span style={{ fontSize: 12, color: "#666", marginTop: 5, display: "block" }}>
              Just the event name — the year is added automatically.
            </span>
          </div>

          <div>
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{ colorScheme: "dark" }}
            />
          </div>

          {slug && (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "12px 16px",
            }}>
              <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Album Title
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                {title} ({new Date(date + "T00:00:00").getFullYear()})
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>
                slug: {slug}
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(255,92,77,0.1)",
              border: "1px solid rgba(255,92,77,0.3)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: CORAL,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !slug}
            style={{
              background: PURPLE, color: "#fff", border: "none",
              borderRadius: 10, padding: "13px",
              fontSize: 15, fontWeight: 700,
              cursor: submitting || !slug ? "not-allowed" : "pointer",
              opacity: submitting || !slug ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!submitting && slug) e.currentTarget.style.background = PURPLE_DARK; }}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}
          >
            {submitting ? "Creating…" : "Create Event →"}
          </button>

        </form>
      </div>
      <Footer />
    </div>
  );
}
