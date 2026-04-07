import { useState } from "react";
import { navItems } from "../data/siteData";
import { YELLOW, CORAL, DARK } from "../styles/colors";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem", background: DARK, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="Funky Fitz Logo" style={{ height: 50, objectFit: "contain" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: YELLOW }}>Funky</span><span style={{ color: CORAL }}>Fitz</span>
            <span style={{ color: "#aaa", fontSize: 11, marginLeft: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Entertainment
            </span>
          </div>
        </div>

        <div className="nav-links">
          {navItems.map(item => (
            <button key={item} style={{ background: "none", border: "none", color: "#ddd", fontSize: 14, cursor: "pointer" }}>
              {item}
            </button>
          ))}
        </div>

        <button className="nav-menu-btn" onClick={() => setOpen(o => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Backdrop */}
      <div className={`nav-backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      {/* Left drawer */}
      <div className={`nav-drawer${open ? " open" : ""}`}>
        <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: YELLOW }}>Funky</span><span style={{ color: CORAL }}>Fitz</span>
          </div>
          <div style={{ color: "#aaa", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
            Entertainment
          </div>
        </div>
        {navItems.map(item => (
          <button key={item} className="nav-drawer-item" onClick={() => setOpen(false)}>
            {item}
          </button>
        ))}
      </div>
    </>
  );
}
