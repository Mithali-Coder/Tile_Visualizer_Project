import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_CREDENTIALS, getTile } from "../data/tiles.js";
import { surfaces, getRoom } from "../data/rooms.jsx";

const AppContext = createContext(null);

const SESSION_KEY = "tv_admin_session";
const PREFS_KEY = "tv_prefs";

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function loadPrefs() {
  const defaults = {
    roomId: "living-room",
    surface: "Floor",
    applied: {},
    catalogueDark: false,
  };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return defaults;
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadSession);
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const login = (username, password) => {
    if (
      username.trim().toLowerCase() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setUser({ username: username.trim(), loginAt: Date.now() });
      return { ok: true };
    }
    return { ok: false, message: "Invalid credentials. Try the demo login below." };
  };

  const logout = () => setUser(null);

  const setRoom = (roomId) =>
    setPrefs((p) => ({ ...p, roomId, surface: surfaces[0] }));

  const setSurface = (surface) => setPrefs((p) => ({ ...p, surface }));

  const applyTile = (tileId, surface) =>
    setPrefs((p) => ({
      ...p,
      applied: { ...p.applied, [surface]: tileId },
    }));

  const removeTile = (surface) =>
    setPrefs((p) => {
      const applied = { ...p.applied };
      delete applied[surface];
      return { ...p, applied };
    });

  const toggleCatalogueDark = () =>
    setPrefs((p) => ({ ...p, catalogueDark: !p.catalogueDark }));

  const resetAll = () =>
    setPrefs({ roomId: "living-room", surface: "Floor", applied: {}, catalogueDark: false });

  const room = useMemo(() => getRoom(prefs.roomId), [prefs.roomId]);

  const appliedTiles = useMemo(() => {
    const map = {};
    for (const key of Object.keys(prefs.applied)) {
      map[key] = getTile(prefs.applied[key]);
    }
    return map;
  }, [prefs.applied]);

  const activeTile = appliedTiles[prefs.surface] || null;

  const value = {
    user,
    login,
    logout,
    room,
    roomId: prefs.roomId,
    setRoom,
    surface: prefs.surface,
    setSurface,
    appliedTiles,
    activeTile,
    applyTile,
    removeTile,
    catalogueDark: prefs.catalogueDark,
    toggleCatalogueDark,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
