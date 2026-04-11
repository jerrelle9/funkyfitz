import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PURPLE, PURPLE_DARK, CORAL } from "../../styles/colors";
import ImageUploader from "../../components/admin/imageUploader";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function ManageEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [settingCover, setSettingCover] = useState(null);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [slug]);

  async function loadEvent() {
    setLoading(true);
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!eventData) {
      navigate("/admin", { replace: true });
      return;
    }

    setEvent(eventData);
    await loadPhotos(eventData.bucket_folder);
    setLoading(false);
  }

  async function loadPhotos(folder) {
    const { data: files } = await supabase.storage
      .from("event-galleries")
      .list(folder, { limit: 500, sortBy: { column: "name", order: "asc" } });

    const paths = (files || [])
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f.name))
      .map(f => `${folder}/${f.name}`);

    setImagePaths(paths);
  }

  function getThumbUrl(path) {
    return supabase.storage
      .from("event-galleries")
      .getPublicUrl(path, { transform: { width: 300, quality: 70 } })
      .data.publicUrl;
  }

  function getPublicUrl(path) {
    return supabase.storage
      .from("event-galleries")
      .getPublicUrl(path)
      .data.publicUrl;
  }

  async function setCover(path) {
    setSettingCover(path);
    const coverUrl = getPublicUrl(path);
    await supabase.from("events").update({ cover_url: coverUrl }).eq("id", event.id);
    setEvent(prev => ({ ...prev, cover_url: coverUrl }));
    setSettingCover(null);
  }

  async function deletePhoto(path) {
    if (!confirm("Delete this photo?")) return;
    setDeletingPhoto(path);
    await supabase.storage.from("event-galleries").remove([path]);
    const newPaths = imagePaths.filter(p => p !== path);
    setImagePaths(newPaths);

    // If deleted photo was cover, clear it
    if (event.cover_url === getPublicUrl(path)) {
      const nextCover = newPaths[0] ? getPublicUrl(newPaths[0]) : null;
      await supabase.from("events").update({ cover_url: nextCover, photo_count: newPaths.length }).eq("id", event.id);
      setEvent(prev => ({ ...prev, cover_url: nextCover, photo_count: newPaths.length }));
    } else {
      await supabase.from("events").update({ photo_count: newPaths.length }).eq("id", event.id);
      setEvent(prev => ({ ...prev, photo_count: newPaths.length }));
    }
    setDeletingPhoto(null);
  }

  async function handleUploadComplete(uploadedPaths) {
    const allPaths = [...imagePaths, ...uploadedPaths];
    setImagePaths(allPaths);

    const updates = { photo_count: allPaths.length };
    if (!event.cover_url && uploadedPaths[0]) {
      updates.cover_url = getPublicUrl(uploadedPaths[0]);
    }

    await supabase.from("events").update(updates).eq("id", event.id);
    setEvent(prev => ({ ...prev, ...updates }));
  }

  async function togglePublished() {
    setToggling(true);
    const next = !event.published;
    await supabase.from("events").update({ published: next }).eq("id", event.id);
    setEvent(prev => ({ ...prev, published: next }));
    setToggling(false);
  }

  async function saveDetails(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const newTitle = form.title.value.trim();
    const newDate = form.date.value;

    const { error: updateErr } = await supabase
      .from("events")
      .update({ title: newTitle, date: newDate })
      .eq("id", event.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setEvent(prev => ({ ...prev, title: newTitle, date: newDate }));
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0620", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  const year = event.date ? new Date(event.date + "T00:00:00").getFullYear() : "";
  const displayTitle = `${event.title}${year ? ` (${year})` : ""}`;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0620", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "#1a0a3a",
        borderBottom: "1px solid rgba(107,33,200,0.25)",
        padding: "1.1rem 2rem",
        position: "relative",
        textAlign: "center",
      }}>
        <div className="desktop-only" style={{ position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)" }}>
          <Link
            to="/admin"
            style={{ color: CORAL, textDecoration: "none", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>{displayTitle}</h1>
        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
          {imagePaths.length} photo{imagePaths.length !== 1 ? "s" : ""} · {event.published ? "Published" : "Draft"}
        </div>
        <button
          onClick={togglePublished}
          disabled={toggling}
          style={{
            marginTop: 10,
            background: event.published ? "rgba(255,92,77,0.1)" : "rgba(34,197,94,0.1)",
            border: `1px solid ${event.published ? "rgba(255,92,77,0.3)" : "rgba(34,197,94,0.3)"}`,
            color: event.published ? CORAL : "#22c55e",
            borderRadius: 8, padding: "8px 18px",
            fontSize: 14, fontWeight: 700,
            cursor: toggling ? "not-allowed" : "pointer",
            opacity: toggling ? 0.6 : 1,
          }}
        >
          {toggling ? "…" : event.published ? "Unpublish" : "Publish"}
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: 32, flex: 1, width: "100%" }}>

        {/* Edit details */}
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>Event Details</h2>
          <form onSubmit={saveDetails} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="fields-stack" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">Title</label>
                <input name="title" type="text" className="form-input" defaultValue={event.title} required />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">Date</label>
                <input name="date" type="date" className="form-input" defaultValue={event.date} required style={{ colorScheme: "dark" }} />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: PURPLE, color: "#fff", border: "none",
                  borderRadius: 10, padding: "12px 22px",
                  fontSize: 14, fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
          {error && <div style={{ marginTop: 8, fontSize: 13, color: CORAL }}>{error}</div>}
        </section>

        {/* Upload more */}
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
            {imagePaths.length === 0 ? "Upload Photos" : "Add More Photos"}
          </h2>
          <div style={{
            background: "#1a0a3a",
            border: "1px solid rgba(107,33,200,0.18)",
            borderRadius: 14, padding: "1.5rem",
          }}>
            <ImageUploader
              bucketFolder={event.bucket_folder}
              onComplete={handleUploadComplete}
            />
          </div>
        </section>

        {/* Photo grid */}
        {imagePaths.length > 0 && (
          <section className="phone-hidden">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Photos</h2>
            <p style={{ fontSize: 12, color: "#666", margin: "0 0 14px" }}>Click a photo to set it as the album cover.</p>
            <div style={{ columns: "5 140px", columnGap: 8 }}>
              {imagePaths.map(path => {
                const isCover = event.cover_url === getPublicUrl(path);
                const isSettingThis = settingCover === path;
                const isDeletingThis = deletingPhoto === path;

                return (
                  <div
                    key={path}
                    style={{
                      breakInside: "avoid",
                      marginBottom: 8,
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: isCover ? "2px solid #F5C800" : "2px solid transparent",
                      cursor: isSettingThis || isDeletingThis ? "wait" : "pointer",
                      opacity: isDeletingThis ? 0.4 : 1,
                      transition: "border-color 0.2s, opacity 0.2s",
                    }}
                    onClick={() => !isSettingThis && !isDeletingThis && setCover(path)}
                  >
                    <img
                      src={getThumbUrl(path)}
                      alt=""
                      loading="lazy"
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />

                    {/* Cover badge */}
                    {isCover && (
                      <div style={{
                        position: "absolute", top: 5, left: 5,
                        background: "#F5C800", color: "#000",
                        fontSize: 9, fontWeight: 800,
                        padding: "2px 7px", borderRadius: 10,
                        letterSpacing: 0.5, textTransform: "uppercase",
                      }}>
                        Cover
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); deletePhoto(path); }}
                      style={{
                        position: "absolute", top: 5, right: 5,
                        background: "rgba(0,0,0,0.6)", border: "none",
                        color: "#fff", width: 22, height: 22, borderRadius: "50%",
                        fontSize: 12, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        opacity: 0, transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgba(255,92,77,0.85)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "0"; e.currentTarget.style.background = "rgba(0,0,0,0.6)"; }}
                    >
                      ×
                    </button>

                    {isSettingThis && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: "#fff", fontWeight: 600,
                      }}>
                        Setting…
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
      <Footer />
    </div>
  );
}
