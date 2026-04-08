import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { YELLOW, CORAL, DARK } from "../styles/colors";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  // { label: "Gallery", to: "/#gallery" },
  { label: "Join Our Team", to: "/join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleNav(to) {
    setOpen(false);
    if (to === "/#gallery") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(to);
    }
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
          {navLinks.map(({ label, to }) => (
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
        {navLinks.map(({ label, to }) => (
          <button key={label} className="nav-drawer-item" onClick={() => handleNav(to)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
