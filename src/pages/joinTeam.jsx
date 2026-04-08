import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { PURPLE, PURPLE_DARK, YELLOW, CORAL, DARK } from "../styles/colors";

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function JoinTeam() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", igHandle: "", phone: "",
    shirtSize: "", about: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.igHandle.trim()) e.igHandle = "Instagram handle is required";
    else if (!form.igHandle.startsWith("@")) e.igHandle = "Must start with @";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Team Application — ${form.firstName} ${form.lastName}`,
          from_name: "FunkyFitz Website",
          "First Name": form.firstName,
          "Last Name": form.lastName || "—",
          "Instagram Handle": form.igHandle,
          "Phone Number": form.phone,
          "T-Shirt Size": form.shirtSize || "—",
          "About": form.about || "—",
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0620", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 2rem 6rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: CORAL, marginBottom: 10, fontWeight: 600 }}>
            We're growing
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>
            Join Our Team
          </h1>
          <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
            Think you have what it takes to bring the vibes? Fill out the form below and we'll be in touch.
          </p>
        </div>

        {status === "success" ? (
          <div style={{
            background: "rgba(107, 33, 200, 0.15)", border: "1px solid rgba(107,33,200,0.4)",
            borderRadius: 16, padding: "3rem 2rem", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>Application Sent!</h2>
            <p style={{ color: "#aaa", fontSize: 16, margin: 0 }}>
              Thanks for reaching out. We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Name row */}
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="form-label">First Name <span style={{ color: CORAL }}>*</span></label>
                <input className={`form-input${errors.firstName ? " error" : ""}`} name="firstName" value={form.firstName} onChange={handleChange} placeholder="e.g. Fitzroy" />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="e.g. Williams" />
              </div>
            </div>

            {/* IG Handle */}
            <div>
              <label className="form-label">Instagram Handle <span style={{ color: CORAL }}>*</span></label>
              <input className={`form-input${errors.igHandle ? " error" : ""}`} name="igHandle" value={form.igHandle} onChange={handleChange} placeholder="@yourhandle" />
              {errors.igHandle && <span className="form-error">{errors.igHandle}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone Number <span style={{ color: CORAL }}>*</span></label>
              <input className={`form-input${errors.phone ? " error" : ""}`} name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +1 868 123 4567" type="tel" />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            {/* T-Shirt Size */}
            <div>
              <label className="form-label">T-Shirt Size</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                {SHIRT_SIZES.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, shirtSize: size }))}
                    style={{
                      padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", border: "1px solid",
                      background: form.shirtSize === size ? PURPLE : "transparent",
                      borderColor: form.shirtSize === size ? PURPLE : "rgba(255,255,255,0.15)",
                      color: form.shirtSize === size ? "#fff" : "#aaa",
                      transition: "all 0.15s",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <label className="form-label">Tell us about yourself</label>
              <textarea
                className="form-input"
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="What do you bring to the team? Any skills, experience, or ideas you'd like to share..."
                rows={5}
                style={{ resize: "vertical" }}
              />
            </div>

            {status === "error" && (
              <p style={{ color: CORAL, fontSize: 14, margin: 0 }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: PURPLE, color: "#fff", border: "none",
                padding: "14px 36px", borderRadius: 50, fontSize: 16,
                fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                transition: "opacity 0.2s, transform 0.2s",
                alignSelf: "flex-start",
              }}
              onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {status === "loading" ? "Sending…" : "Submit Application"}
            </button>

          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
