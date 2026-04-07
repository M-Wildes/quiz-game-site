import Link from "next/link";
import { signupAction } from "@/app/actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <div className="page-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong rounded-[32px] p-8 lg:p-10">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em]">
            Start the player profile that everything else builds on.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Signing up unlocks synced leaderboard history, season progress, and
            a shared identity across the website and the game app.
          </p>
        </div>

        <div className="panel rounded-[32px] p-8 lg:p-10">
          <p className="tiny-label">New profile</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
            Create your account
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            The SQL starter automatically creates a matching profile and stats row.
          </p>

          {params.error ? (
            <div className="mt-6 rounded-[20px] border border-[rgba(208,44,44,0.18)] bg-[rgba(255,241,241,0.8)] px-4 py-3 text-sm text-[#8b1e1e]">
              {params.error}
            </div>
          ) : null}

          <form action={signupAction} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="tiny-label">Display name</span>
              <input
                className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                name="displayName"
                placeholder="Quiz Legend"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="tiny-label">Username</span>
              <input
                className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                name="username"
                placeholder="quizlegend"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="tiny-label">Email</span>
              <input
                className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                name="email"
                placeholder="player@example.com"
                required
                type="email"
              />
            </label>
            <label className="block space-y-2">
              <span className="tiny-label">Password</span>
              <input
                className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                name="password"
                placeholder="Create a password"
                required
                type="password"
              />
            </label>
            <button className="button-primary w-full" type="submit">
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--foreground)]" href="/login">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
