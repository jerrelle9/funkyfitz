import Navbar from "../components/navbar";
import Hero from "../components/hero";
import GallerySection from "../components/gallerySection";
import Footer from "../components/footer";
import { DARK } from "../styles/colors";

export default function FunkyFitz() {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        margin: 0,
        padding: 0,
        background: "#fff",
        color: DARK,
      }}
    >
      <Navbar />
      <Hero />
      <GallerySection />
      <Footer />
    </div>
  );
}