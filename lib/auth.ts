import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createServiceRoleSupabaseClient,
  createTokenSupabaseClient,
} from "@/lib/supabase/service";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

export async function getWebsiteUser() {
  const client = await createServerSupabaseClient();

  if (!client) {
    return null;
  }

  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export async function getRequestUser(request: Request): Promise<User | null> {
  const bearerToken = getBearerToken(request);

  if (bearerToken) {
    const serviceClient = createServiceRoleSupabaseClient();

    if (serviceClient) {
      const { data, error } = await serviceClient.auth.getUser(bearerToken);

      if (!error && data.user) {
        return data.user;
      }
    }

    const tokenClient = createTokenSupabaseClient(bearerToken);

    if (tokenClient) {
      const { data, error } = await tokenClient.auth.getUser();

      if (!error && data.user) {
        return data.user;
      }
    }
  }

  const serverClient = await createServerSupabaseClient();

  if (!serverClient) {
    return null;
  }

  const { data } = await serverClient.auth.getUser();
  return data.user ?? null;
}
