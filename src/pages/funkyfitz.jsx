import Navbar from "../components/Navbar";
import Hero from "../components/hero";
import ServicesSection from "../components/servicesSection";
// import AboutSection from "../components/AboutSection";
// import TestimonialsSection from "../components/TestimonialsSection";
// import CTASection from "../components/CTASection";
// import Footer from "../components/Footer";
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
      <ServicesSection />
    </div>
  );
}