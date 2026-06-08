/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginAdmin } from "../services/authService";
import { getSupabaseSession, signOutSupabase, startGoogleOAuth } from "../services/oauthService";
import { supabase } from "../lib/supabase";
import { getJwtExpiry, isJwtExpired } from "../utils/authToken";
import { getStoredValue, removeStoredValue, setStoredValue } from "../utils/storage";

const AuthContext = createContext(null);

const TOKEN_KEY = "scan2order_token";
const USER_KEY = "scan2order_user";
const ACCESS_KEY = "scan2order_access_key_valid";
const SESSION_EXPIRED_KEY = "scan2order_session_expired";
const AUTH_PROVIDER_KEY = "scan2order_auth_provider";

function normalizeSupabaseUser(session) {
  if (!session?.user) return null;
  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    role: user.app_metadata?.role || user.user_metadata?.role || "admin",
    restaurant_id:
      user.user_metadata?.restaurant_id ||
      user.app_metadata?.restaurant_id ||
      import.meta.env.VITE_DEFAULT_RESTAURANT_ID ||
      user.id,
    avatar_url: user.user_metadata?.avatar_url,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    provider: "supabase-google",
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedToken && !isJwtExpired(storedToken) ? storedToken : null;
  });
  const [user, setUser] = useState(() => (token ? getStoredValue(USER_KEY, null) : null));
  const [accessKeyValid, setAccessKeyValid] = useState(() => Boolean(token && localStorage.getItem(ACCESS_KEY) === "true"));
  const [sessionExpired, setSessionExpired] = useState(() => localStorage.getItem(SESSION_EXPIRED_KEY) === "true");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const persistSession = useCallback((nextToken, nextUser, provider = "api") => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(ACCESS_KEY, "true");
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
    localStorage.removeItem(SESSION_EXPIRED_KEY);
    setStoredValue(USER_KEY, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    setAccessKeyValid(true);
    setSessionExpired(false);
  }, []);

  const logout = useCallback((reason) => {
    const provider = localStorage.getItem(AUTH_PROVIDER_KEY);
    if (provider === "supabase-google") {
      signOutSupabase().catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    removeStoredValue(USER_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
    if (reason === "expired") {
      localStorage.setItem(SESSION_EXPIRED_KEY, "true");
      setSessionExpired(true);
    } else {
      localStorage.removeItem(SESSION_EXPIRED_KEY);
      setSessionExpired(false);
    }
    setToken(null);
    setUser(null);
    setAccessKeyValid(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function hydrateSupabaseSession() {
  try {
    setAuthLoading(true);

    const session = await getSupabaseSession();

    console.log("========== SESSION DEBUG ==========");
    console.log("RESTORED SESSION:", session);
    console.log("TOKEN IN STORAGE:", localStorage.getItem(TOKEN_KEY));
    console.log("===================================");

    if (!mounted) return;

    if (session?.access_token) {
      persistSession(
        session.access_token,
        normalizeSupabaseUser(session),
        "supabase-google"
      );
    } else {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedToken && isJwtExpired(storedToken)) {
        logout("expired");
      }
    }
  } catch (error) {
    console.error("SESSION RESTORE ERROR:", error);

    if (mounted) {
      setAuthError(error.message || "Unable to restore session");
    }
  } finally {
    if (mounted) {
      setAuthLoading(false);
    }
  }
}

    hydrateSupabaseSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log("AUTH EVENT:", event);
  console.log("AUTH SESSION:", session);

  if (session?.access_token) {
    persistSession(
      session.access_token,
      normalizeSupabaseUser(session),
      "supabase-google"
    );
    setAuthLoading(false);
    return;
  }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem(TOKEN_KEY);
        removeStoredValue(USER_KEY);
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(AUTH_PROVIDER_KEY);
        setToken(null);
        setUser(null);
        setAccessKeyValid(false);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [logout, persistSession]);

  useEffect(() => {
    if (!token) return undefined;

    const expiry = getJwtExpiry(token);
    if (!expiry) return undefined;

    const timeout = window.setTimeout(() => logout("expired"), Math.max(0, expiry - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [token, logout]);

  useEffect(() => {
    function handleExpiredSession() {
      logout("expired");
    }

    window.addEventListener("scan2order:session-expired", handleExpiredSession);
    return () => window.removeEventListener("scan2order:session-expired", handleExpiredSession);
  }, [logout]);

  const isAuthenticated = Boolean(token && accessKeyValid && !isJwtExpired(token));

  const login = useCallback(async (credentials) => {
    setAuthError("");
    const response = await loginAdmin(credentials);
    persistSession(response.token, response.user, "api");
    return response;
  }, [persistSession]);

  const loginWithGoogle = useCallback(async () => {
    setAuthError("");
    await startGoogleOAuth();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      restaurantId: user?.restaurant_id,
      isAuthenticated,
      authLoading,
      authError,
      sessionExpired,
      login,
      loginWithGoogle,
      logout,
    }),
    [token, user, isAuthenticated, authLoading, authError, sessionExpired, login, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
