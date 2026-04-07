import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!hasSupabaseEnv()) {
    return response;
  }

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        response = NextResponse.next({
          request,
        });

        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
