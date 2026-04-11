import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0d0620",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#888", fontSize: 14,
      }}>
        Checking session…
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
