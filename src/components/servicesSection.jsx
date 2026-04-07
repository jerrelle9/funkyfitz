import { useState } from "react";
import { services } from "../data/siteData";
import { CORAL, DARK, PURPLE, YELLOW } from "../styles/colors";

export default function ServicesSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding: "5rem 2.5rem", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: CORAL, marginBottom: 8 }}>
            What we do
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: DARK, margin: 0 }}>
            Entertainment for every occasion
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {services.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? PURPLE : "#faf9ff",
                border: `2px solid ${hovered === i ? PURPLE : "#e8e0f7"}`,
                borderRadius: 16,
                padding: "1.75rem",
                cursor: "pointer",
                transition: "all 0.2s",
                color: hovered === i ? "#fff" : DARK,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: hovered === i ? YELLOW : DARK }}>
                {s.label}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: hovered === i ? "#ddd" : "#555" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}