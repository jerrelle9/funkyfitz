export default function WavyBg() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300].map((r, i) => (
        <circle key={i} cx="300" cy="300" r={r} fill="none" stroke="#fff" strokeWidth="14" />
      ))}
    </svg>
  );
}