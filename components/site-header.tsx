import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getWebsiteUser } from "@/lib/auth";

const navigation = [
  { href: "/download", label: "Download" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/battle-pass", label: "Battle Pass" },
  { href: "/dashboard", label: "Dashboard" },
];

export async function SiteHeader() {
  const user = await getWebsiteUser();
  const playerLabel =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Player";

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(62,43,22,0.08)] bg-[rgba(246,240,231,0.78)] backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff9700,#2340cf)] text-sm font-bold text-white">
              QF
            </span>
            <div>
              <p className="text-lg font-semibold tracking-[-0.05em]">
                QuizForge
              </p>
              <p className="tiny-label">live quiz command center</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--muted)] sm:inline">
                Pilot: {playerLabel}
              </span>
              <Link className="button-secondary !px-4 !py-3" href="/dashboard">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button className="button-ghost !px-4 !py-3" type="submit">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="button-ghost !px-4 !py-3" href="/login">
                Sign in
              </Link>
              <Link className="button-primary !px-4 !py-3" href="/signup">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
