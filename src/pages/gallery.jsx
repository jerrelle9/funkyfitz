import Navbar from "../components/navbar";
import GallerySection from "../components/gallerySection";
import Footer from "../components/footer";
import { DARK } from "../styles/colors";

export default function Gallery() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", margin: 0, padding: 0, background: DARK, color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <GallerySection />
      <Footer />
    </div>
  );
}