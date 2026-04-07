import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(62,43,22,0.08)] py-8">
      <div className="page-shell flex flex-col gap-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[var(--foreground)]">QuizForge</p>
          <p className="mt-1 max-w-xl">
            The home for every new build, synced player profile, shared
            community quiz, season reward, and leaderboard climb in the quiz
            game ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/download">Download</Link>
          <Link href="/community-quizzes">Community</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/leaderboards">Leaderboards</Link>
          <Link href="/battle-pass">Battle Pass</Link>
        </div>
      </div>
    </footer>
  );
}
