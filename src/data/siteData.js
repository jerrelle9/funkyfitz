export const services = [
  { emoji: "🎤", label: "Live performances", desc: "High-energy shows featuring top-tier dancers, singers, and entertainers for any occasion." },
  { emoji: "🎉", label: "Event hosting", desc: "Charismatic MCs and hosts who keep the energy alive from start to finish." },
  { emoji: "💃", label: "Dance workshops", desc: "Interactive dance sessions for all ages — corporate team-builds, schools, and private parties." },
  { emoji: "🎭", label: "Themed entertainment", desc: "Custom-themed packages from carnival to retro, designed around your event vision." },
  { emoji: "🎬", label: "Content creation", desc: "Professionally shot performance videos, reels, and promotional content for your brand." },
  { emoji: "🌟", label: "Kids' parties", desc: "Vibrant, safe, and wildly fun entertainment designed specifically for the little ones." },
];

export const stats = [
  // { num: "300+", label: "Events rocked" },
  // { num: "8", label: "Years of energy" },
  // { num: "100%", label: "Vibe guaranteed" },
  // { num: "50+", label: "Performers" },
];

export const testimonials = [
  { initials: "KP", name: "Kezia P.", role: "Event Organiser, Carnival Vibes TT", text: "FunkyFitz took our carnival launch to a whole new level. The energy was absolutely electric — guests were on their feet all night." },
  { initials: "DM", name: "Darius M.", role: "Principal, Sunridge Academy", text: "The school workshop was incredible. The kids haven't stopped talking about it. FunkyFitz made movement fun and meaningful." },
  { initials: "TS", name: "Tamara S.", role: "Birthday Celebrant", text: "I wanted something different for my 30th and FunkyFitz delivered beyond anything I imagined. Truly unforgettable night." },
];

export const navItems = ["Home", "Gallery", "Join Our Team"];

// To add an album: import your image at the top, then set cover: yourImage
import startIt from "../assets/start-it-2026.jfif";
import altitude from "../assets/altitude.jfif";

export const albums = [
  {
    id: 1,
    title: "Start It",
    date: "December 28, 2025",
    photoCount: 64,
    facebookUrl: "https://www.facebook.com/media/set/?set=a.1419353636225491&type=3",
    cover: startIt,
  },
  {
    id: 2,
    title: "Altitude",
    date: "August 1, 2025",
    photoCount: 112,
    facebookUrl: "https://www.facebook.com/media/set/?set=a.1296960528464803&type=3",
    cover: altitude,
  },
];