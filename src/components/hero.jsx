import { stats } from "../data/siteData";
import { YELLOW, PURPLE, PURPLE_DARK } from "../styles/colors";
import banner2 from "../assets/banner2.png";

export default function Hero() {
  return (
    <section style={{ background: YELLOW, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "4rem 3rem", textAlign: "center" }}>
      <img
        src={banner2}
        alt="FunkyFitz Entertainment logo"
        style={{ width: "100%", maxWidth: 700, objectFit: "contain", marginBottom: "2rem" }}
      />

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontSize: 32, fontWeight: 700, color: PURPLE, lineHeight: 1.6, margin: "0 0 20px 0", letterSpacing: "-0.3px" }}>
          Funky Fitz Entertainment
        </p>
        <p style={{ fontSize: 20, color: PURPLE_DARK, lineHeight: 1.8, margin: "0 0 24px 0", opacity: 0.85, letterSpacing: "0.3px" }}>
          A South Trinidad-based events company built on <span style={{ fontWeight: 600, color: PURPLE }}>family, unity, and creativity</span>. We revolutionize the fete experience by creating moments that bring people together.
        </p>
        <div style={{ padding: "20px 0", borderLeft: `3px solid ${PURPLE}`, paddingLeft: "20px", margin: "24px 0", textAlign: "left", maxWidth: "600px", margin: "24px auto" }}>
          <p style={{ fontSize: 21, color: PURPLE, lineHeight: 1.8, margin: 0, fontWeight: 500, fontStyle: "italic" }}>
            "The more hands that fill the bucket, the faster it overflows. And when it overflows, everyone feels it."
          </p>
        </div>
        <p style={{ fontSize: 20, color: PURPLE_DARK, lineHeight: 1.8, margin: "0 0 32px 0", opacity: 0.85 }}>
          At Funky Fitz, <span style={{ fontWeight: 600, color: PURPLE }}>everyone has a role</span>. Everyone has a voice. Every idea matters. <span style={{ fontWeight: 600 }}>Together, we create. Together, we elevate. Together, we bring vibes to life.</span>
        </p>
      </div>

      <div style={{ display: "flex", gap: "3rem", marginTop: "2rem" }}>
        {stats.slice(0, 2).map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 36, fontWeight: 800, color: PURPLE }}>{s.num}</div>
            <div style={{ fontSize: 14, color: PURPLE_DARK, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}