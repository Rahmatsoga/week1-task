import { createContext, useCallback, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(undefined);

/**
 * Wraps the whole app and holds a single, shared source of truth for
 * "who is logged in right now" — every component that needs to know
 * (the nav bar, protected routes, the login form) reads from here
 * instead of each fetching/storing its own copy.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session
  const [error, setError] = useState(null);

  // On first load, ask the server "who am I?" using the httpOnly
  // cookie the browser sends automatically. This is what makes login
  // survive a page refresh without ever touching localStorage.
  useEffect(() => {
    (async () => {
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        setUser(null); // no valid session — that's fine, just means logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (details) => {
    setError(null);
    try {
      const newUser = await authService.register(details);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null); // clear locally regardless, so the UI updates instantly
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Convenience hook so components just call useAuth() instead of useContext(AuthContext). */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
