import { BrowserRouter, Routes, Route } from "react-router-dom";
import FunkyFitz from "./pages/funkyfitz";
import JoinTeam from "./pages/joinTeam";
import Gallery from "./pages/gallery";
import EventGallery from "./pages/eventGallery";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import NewEvent from "./pages/admin/newEvent";
import ManageEvent from "./pages/admin/manageEvent";
import NewUpcomingEvent from "./pages/admin/newUpcomingEvent";
import ManageUpcomingEvent from "./pages/admin/manageUpcomingEvent";
import RequireAuth from "./components/admin/requireAuth";
import AuthCallback from "./pages/authCallback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<FunkyFitz />} />
        <Route path="/join" element={<JoinTeam />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:slug" element={<EventGallery />} />

        {/* Admin — unprotected */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin — protected */}
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/events/new" element={<RequireAuth><NewEvent /></RequireAuth>} />
        <Route path="/admin/events/:slug" element={<RequireAuth><ManageEvent /></RequireAuth>} />
        <Route path="/admin/upcoming-events/new" element={<RequireAuth><NewUpcomingEvent /></RequireAuth>} />
        <Route path="/admin/upcoming-events/:id" element={<RequireAuth><ManageUpcomingEvent /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
