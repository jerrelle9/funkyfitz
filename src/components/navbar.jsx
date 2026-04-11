import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { YELLOW, CORAL, DARK } from "../styles/colors";
import logo from "../assets/logo.png";
import { supabase } from "../lib/supabase";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/gallery" },
  { label: "Join Our Team", to: "/join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEventGallery = /^\/gallery\/.+/.test(location.pathname);
  const isAdminEvent = isAdmin && /^\/admin\/events\/.+/.test(location.pathname);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleNav(to) {
    setOpen(false);
    navigate(to);
  }

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem", background: DARK, position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="Funky Fitz Logo" style={{ height: 50, objectFit: "contain" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: YELLOW }}>Funky</span><span style={{ color: CORAL }}>Fitz</span>
            <span style={{ color: "#aaa", fontSize: 11, marginLeft: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Entertainment
            </span>
          </div>
        </Link>

        <div className="nav-links">
          {navLinks.filter(({ label }) => !(isAdmin && label === "Join Our Team")).map(({ label, to }) => (
            <button key={label} onClick={() => handleNav(to)} style={{
              background: "none", border: "none", color: "#ddd", fontSize: 14, cursor: "pointer",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#ddd"}
            >
              {label}
            </button>
          ))}
          {isAdmin && (
            <button onClick={handleSignOut} style={{
              background: "none", border: "none", color: CORAL, fontSize: 14, cursor: "pointer",
              fontWeight: 600, transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Sign Out
            </button>
          )}
        </div>

        <button className="nav-menu-btn" onClick={() => setOpen(o => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </nav>

      <div className={`nav-backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      <div className={`nav-drawer${open ? " open" : ""}`}>
        <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: YELLOW }}>Funky</span><span style={{ color: CORAL }}>Fitz</span>
          </div>
          <div style={{ color: "#aaa", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
            Entertainment
          </div>
        </div>
        {isEventGallery && (
          <button className="nav-drawer-item" onClick={() => handleNav("/gallery")} style={{ color: CORAL }}>
            ← All Events
          </button>
        )}
        {isAdminEvent && (
          <button className="nav-drawer-item" onClick={() => handleNav("/admin")} style={{ color: CORAL }}>
            ← Dashboard
          </button>
        )}
        {navLinks.filter(({ label }) => !(isAdmin && label === "Join Our Team")).map(({ label, to }) => (
          <button key={label} className="nav-drawer-item" onClick={() => handleNav(to)}>
            {label}
          </button>
        ))}
        {isAdmin && (
          <button className="nav-drawer-item" onClick={handleSignOut} style={{ color: CORAL, marginTop: "auto" }}>
            Sign Out
          </button>
        )}
      </div>
    </>
  );
}
