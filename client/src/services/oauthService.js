import { supabase } from "../lib/supabase";

export async function startGoogleOAuth() {
  const redirectTo =
  import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL ||
  `${window.location.origin}/admin/login`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function getSupabaseSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
