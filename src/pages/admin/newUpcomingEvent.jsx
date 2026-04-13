import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { supabase } from "../../lib/supabase";
import { PURPLE, PURPLE_DARK, CORAL } from "../../styles/colors";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function NewUpcomingEvent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an event image.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // Compress image
    let compressed;
    try {
      compressed = await imageCompression(imageFile, { maxSizeMB: 0.5, maxWidthOrHeight: 1920 });
    } catch {
      setError("Image compression failed. Please try a different image.");
      setSubmitting(false);
      return;
    }

    // Generate unique filename
    const ext = imageFile.name.split(".").pop().toLowerCase();
    const filename = `${crypto.randomUUID()}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from("upcoming-events")
      .upload(filename, compressed, { upsert: false });

    if (uploadErr) {
      setError(uploadErr.message);
      setSubmitting(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("upcoming-events")
      .getPublicUrl(filename);

    // Insert into DB
    const { error: insertErr } = await supabase.from("upcoming_events").insert({
      name,
      date,
      time,
      ticket_link: ticketLink,
      image_url: publicUrl,
      is_published: false,
    });

    if (insertErr) {
      // Clean up uploaded image on DB failure
      await supabase.storage.from("upcoming-events").remove([filename]);
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }

    navigate("/admin");
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
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>New Upcoming Event</h1>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem 2rem", flex: 1, width: "100%" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bubble Gum Rave Vol. 3"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
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
            <div>
              <label className="form-label">Event Time</label>
              <input
                type="time"
                className="form-input"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Ticket Link</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://eventbrite.com/e/..."
              value={ticketLink}
              onChange={e => setTicketLink(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Event Flyer / Poster</label>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 10, padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
              border: "2px dashed rgba(107,33,200,0.4)",
              borderRadius: 12, cursor: "pointer",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(107,33,200,0.8)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(107,33,200,0.4)"}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 260, borderRadius: 8, objectFit: "contain" }}
                />
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B21C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span style={{ color: "#888", fontSize: 14 }}>Click to select image</span>
                  <span style={{ color: "#555", fontSize: 12 }}>JPG, PNG, or WebP</span>
                </>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            {imageFile && (
              <span style={{ fontSize: 12, color: "#666", marginTop: 5, display: "block" }}>
                {imageFile.name}
              </span>
            )}
          </div>

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
            disabled={submitting}
            style={{
              background: PURPLE, color: "#fff", border: "none",
              borderRadius: 10, padding: "13px",
              fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = PURPLE_DARK; }}
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
