import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { supabase } from "../../lib/supabase";
import { PURPLE, PURPLE_DARK, CORAL } from "../../styles/colors";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function extractStoragePath(publicUrl) {
  // Extracts the filename from a Supabase public URL
  // e.g. https://xxx.supabase.co/storage/v1/object/public/upcoming-events/uuid.jpg -> uuid.jpg
  const marker = "/upcoming-events/";
  const idx = publicUrl.indexOf(marker);
  return idx !== -1 ? publicUrl.slice(idx + marker.length) : null;
}

export default function ManageUpcomingEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("upcoming_events")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setEvent(data);
      setName(data.name);
      setDate(data.date);
      setTime(data.time);
      setTicketLink(data.ticket_link);
      setImagePreview(data.image_url);
      setLoading(false);
    }
    load();
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSaved(false);

    let image_url = event.image_url;

    if (imageFile) {
      // Compress new image
      let compressed;
      try {
        compressed = await imageCompression(imageFile, { maxSizeMB: 0.5, maxWidthOrHeight: 1920 });
      } catch {
        setError("Image compression failed. Please try a different image.");
        setSaving(false);
        return;
      }

      // Upload new image
      const ext = imageFile.name.split(".").pop().toLowerCase();
      const filename = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("upcoming-events")
        .upload(filename, compressed, { upsert: false });

      if (uploadErr) {
        setError(uploadErr.message);
        setSaving(false);
        return;
      }

      // Delete old image from storage
      const oldPath = extractStoragePath(event.image_url);
      if (oldPath) {
        await supabase.storage.from("upcoming-events").remove([oldPath]);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("upcoming-events")
        .getPublicUrl(filename);
      image_url = publicUrl;
    }

    const { error: updateErr } = await supabase
      .from("upcoming_events")
      .update({ name, date, time, ticket_link: ticketLink, image_url })
      .eq("id", id);

    if (updateErr) {
      setError(updateErr.message);
      setSaving(false);
      return;
    }

    setEvent(prev => ({ ...prev, name, date, time, ticket_link: ticketLink, image_url }));
    setImageFile(null);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleTogglePublish() {
    setToggling(true);
    const { error: toggleErr } = await supabase
      .from("upcoming_events")
      .update({ is_published: !event.is_published })
      .eq("id", id);

    if (!toggleErr) {
      setEvent(prev => ({ ...prev, is_published: !prev.is_published }));
    }
    setToggling(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
    setDeleting(true);

    // Delete image from storage
    const oldPath = extractStoragePath(event.image_url);
    if (oldPath) {
      await supabase.storage.from("upcoming-events").remove([oldPath]);
    }

    await supabase.from("upcoming_events").delete().eq("id", id);
    navigate("/admin");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0620", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#888", fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0620", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Event not found</div>
        <Link to="/admin" style={{ color: CORAL, fontSize: 14 }}>Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0620", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "#1a0a3a",
        borderBottom: "1px solid rgba(107,33,200,0.25)",
        padding: "1.1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>Edit Upcoming Event</h1>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Published status pill */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            padding: "4px 12px", borderRadius: 20,
            background: event.is_published ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
            color: event.is_published ? "#22c55e" : "#666",
            textTransform: "uppercase",
          }}>
            {event.is_published ? "Published" : "Draft"}
          </div>

          <button
            onClick={handleTogglePublish}
            disabled={toggling}
            style={{
              background: event.is_published ? "rgba(255,92,77,0.1)" : "rgba(34,197,94,0.1)",
              border: `1px solid ${event.is_published ? "rgba(255,92,77,0.3)" : "rgba(34,197,94,0.3)"}`,
              color: event.is_published ? CORAL : "#22c55e",
              borderRadius: 8, padding: "6px 14px",
              fontSize: 13, cursor: toggling ? "not-allowed" : "pointer",
              fontWeight: 500, opacity: toggling ? 0.6 : 1,
            }}
          >
            {event.is_published ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: "rgba(255,92,77,0.08)", border: "1px solid rgba(255,92,77,0.2)",
              color: "#ff5c4d99", borderRadius: 8, padding: "6px 14px",
              fontSize: 13, cursor: deleting ? "not-allowed" : "pointer",
              fontWeight: 500, opacity: deleting ? 0.5 : 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = CORAL}
            onMouseLeave={e => e.currentTarget.style.color = "#ff5c4d99"}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem 2rem", flex: 1, width: "100%" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-input"
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
              ) : null}
              <span style={{ color: "#888", fontSize: 13 }}>
                {imageFile ? imageFile.name : "Click to replace image"}
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
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

          {saved && (
            <div style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#22c55e",
            }}>
              Changes saved.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              background: PURPLE, color: "#fff", border: "none",
              borderRadius: 10, padding: "13px",
              fontSize: 15, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = PURPLE_DARK; }}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

        </form>
      </div>
      <Footer />
    </div>
  );
}
