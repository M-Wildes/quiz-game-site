export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export const githubEnv = {
  owner: process.env.GITHUB_OWNER ?? "",
  repo: process.env.GITHUB_REPO ?? "",
  token: process.env.GITHUB_TOKEN ?? "",
};

export function hasSupabaseEnv() {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}

export function hasServiceRoleEnv() {
  return Boolean(supabaseEnv.url && supabaseEnv.serviceRoleKey);
}

export function hasGitHubReleaseEnv() {
  return Boolean(githubEnv.owner && githubEnv.repo);
}
