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

      <div style={{ display: "flex", gap: "1.5rem", marginTop: "3rem", justifyContent: "center" }}>
        <a href="https://www.facebook.com/profile.php?id=100086891394758" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, fontSize: 24, textDecoration: "none", transition: "transform 0.2s" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/funkyfitzent/" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, fontSize: 24, textDecoration: "none", transition: "transform 0.2s" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.625c-.794.306-1.459.717-2.126 1.384-.667.667-1.079 1.335-1.395 2.126-.289.815-.493 1.6-.552 2.765C.023 8.278.016 8.685 0 12s.015 3.722.072 4.947c.06 1.165.264 1.95.552 2.765.306.822.779 1.473 1.395 2.126.667.667 1.333 1.079 2.126 1.395.815.289 1.6.493 2.766.552C8.333 23.987 8.74 24 12 24s3.722-.013 4.947-.072c1.166-.059 1.9-.263 2.765-.552.822-.306 1.473-.779 2.126-1.395.667-.667 1.079-1.334 1.395-2.126.289-.815.493-1.6.552-2.766.046-1.226.072-1.633.072-4.947s-.015-3.722-.072-4.947c-.06-1.165-.263-1.9-.552-2.766-.306-.822-.779-1.473-1.395-2.126C21.573 1.429 20.92.976 20.1.67c-.815-.29-1.9-.494-2.766-.552C15.667.023 15.26 0 12 0zm0 2.163c3.259 0 3.667.01 4.947.072 1.195.055 1.843.249 2.175.414.547.214.94.469 1.349.878.41.41.663.802.877 1.35.164.331.36.98.413 2.175.057 1.28.07 1.688.07 4.947 0 3.259-.01 3.668-.072 4.948-.055 1.195-.25 1.843-.414 2.175-.214.547-.469.94-.879 1.349-.41.41-.801.663-1.35.877-.331.164-.98.36-2.175.413-1.279.057-1.689.07-4.948.07-3.259 0-3.668-.01-4.948-.072-1.195-.055-1.843-.25-2.175-.414-.547-.214-.94-.469-1.349-.879-.41-.41-.663-.801-.877-1.35-.164-.331-.36-.98-.413-2.175-.057-1.28-.07-1.689-.07-4.948 0-3.259.01-3.667.072-4.947.055-1.195.25-1.843.414-2.175.214-.547.469-.94.879-1.349.41-.41.801-.663 1.35-.877.331-.164.98-.36 2.175-.413 1.28-.057 1.689-.07 4.948-.07l-.003-.002z"/>
            <circle cx="12" cy="12" r="3.654"/>
            <path d="M5.921 20.88c2.379 0 3.417-1.777 3.417-3.296 0-2.18-1.514-3.532-3.417-3.532-1.877 0-3.417 1.368-3.417 3.296 0 1.82 1.56 3.532 3.417 3.532z" fill="none"/>
          </svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, fontSize: 24, textDecoration: "none", transition: "transform 0.2s" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 002.856-3.08 9.965 9.965 0 01-2.824.856 4.971 4.971 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.822 4.822 0 00-8.239 4.4 13.688 13.688 0 01-9.935-5.032 4.82 4.82 0 001.496 6.43 4.783 4.783 0 01-2.212-.616v.06a4.823 4.823 0 003.864 4.726 4.822 4.822 0 01-2.212.084 4.824 4.824 0 004.502 3.35 9.71 9.71 0 01-6.005 2.07 13.994 13.994 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
      </div>
    </section>
  );
}