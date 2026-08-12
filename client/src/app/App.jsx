import { useState } from "react";
import { useAuth } from "@/features/auth/auth.context.jsx";
import Login from "@/features/auth/pages/Login.jsx";
import ForgotPassword from "@/features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "@/features/auth/pages/ResetPassword.jsx";
import Dashboard from "@/features/dashboard/pages/Dashboard.jsx";

function readResetToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const isResetPath = url.pathname.replace(/\/+$/, "").endsWith("/reset-password");
  if (isResetPath && token) {
    window.history.replaceState({}, "", url.pathname);
    return token;
  }
  return null;
}

export default function App() {
  const { user, checkingSession } = useAuth();
  const [resetToken] = useState(readResetToken);
  const [view, setView] = useState(resetToken ? "reset-password" : "login");

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (user) return <Dashboard />;

  if (view === "forgot-password") {
    return <ForgotPassword onBack={() => setView("login")} />;
  }

  if (view === "reset-password" && resetToken) {
    return <ResetPassword token={resetToken} onDone={() => setView("login")} />;
  }

  return <Login onForgotPassword={() => setView("forgot-password")} />;
}
