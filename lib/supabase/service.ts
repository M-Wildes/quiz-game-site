import { createClient } from "@supabase/supabase-js";
import { hasServiceRoleEnv, hasSupabaseEnv, supabaseEnv } from "@/lib/env";

export function createServiceRoleSupabaseClient() {
  if (!hasServiceRoleEnv()) {
    return null;
  }

  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createTokenSupabaseClient(accessToken: string) {
  if (!hasSupabaseEnv() || !accessToken) {
    return null;
  }

  return createClient(supabaseEnv.url, supabaseEnv.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
