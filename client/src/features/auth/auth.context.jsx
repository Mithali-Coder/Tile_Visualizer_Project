import { createContext, useContext, useEffect, useState } from "react";
import { SESSION_KEY } from "./auth.constants.js";
import { login as apiLogin, logout as apiLogout, me as apiMe } from "./services/auth.api.js";

const AuthContext = createContext(null);

function loadToken() {
  try {
    return localStorage.getItem(SESSION_KEY) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(loadToken);
  const [user, setUser] = useState(null);
  // While a stored token is being validated against the server on app load,
  // treat auth as "unknown" rather than "logged out" to avoid a login-page flash.
  const [checkingSession, setCheckingSession] = useState(() => Boolean(loadToken()));

  useEffect(() => {
    if (token) localStorage.setItem(SESSION_KEY, token);
    else localStorage.removeItem(SESSION_KEY);
  }, [token]);

  // Validate any stored token against the server on load (it may have
  // expired, or been invalidated by a logout/password reset elsewhere).
  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      return;
    }
    let cancelled = false;
    apiMe(token)
      .then((res) => {
        if (!cancelled) setUser(res.admin);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
    // Only re-validate when the token itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await apiLogin(email.trim(), password);
      setToken(res.token);
      setUser(res.admin);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Invalid email or password." };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // Even if the server call fails (e.g. already expired), still clear locally.
      }
    }
    setUser(null);
    setToken(null);
  };

  const value = { user, token, checkingSession, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
