import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasSupabaseEnv, supabaseEnv } from "@/lib/env";

export async function createServerSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components may not be allowed to write cookies during render.
        }
      },
    },
  });
}
