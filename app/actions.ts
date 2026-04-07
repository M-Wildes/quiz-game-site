"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/login?error=Sign-in+is+not+available+right+now.+Please+try+again+soon.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const displayName = readField(formData, "displayName");
  const username = readField(formData, "username");
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/signup?error=Account+creation+is+not+available+right+now.+Please+try+again+soon.");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        username,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(
    "/login?message=Account+created.+If+email+confirmation+is+enabled,+check+your+inbox.",
  );
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}
