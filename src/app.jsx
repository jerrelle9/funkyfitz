import { BrowserRouter, Routes, Route } from "react-router-dom";
import FunkyFitz from "./pages/funkyfitz";
import JoinTeam from "./pages/joinTeam";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FunkyFitz />} />
        <Route path="/join" element={<JoinTeam />} />
      </Routes>
    </BrowserRouter>
  );
}
