import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getWebsiteUser } from "@/lib/auth";
import { getCommunityQuizDirectory } from "@/lib/community-quizzes";
import { formatDate } from "@/lib/utils";

export default async function CommunityQuizzesPage() {
  const [directory, user] = await Promise.all([
    getCommunityQuizDirectory(),
    getWebsiteUser(),
  ]);

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            eyebrow="Community quizzes"
            title="Player-made quizzes that can be shared on the site and played in the app."
            description="This is the library that connects your website and desktop app in a new way: creators build quiz sets here, share the link or share code, and players open them from the app's Community tab."
          />

          {directory.isPreview ? (
            <div className="mt-8 rounded-[24px] border border-[rgba(255,138,0,0.18)] bg-[rgba(255,245,232,0.9)] px-5 py-4 text-sm text-[var(--accent-strong)]">
              Sample community quizzes are showing right now. Once the live
              tables are in place, newly published quizzes will appear here
              automatically.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary" href="/community-quizzes/create">
              {user ? "Make a community quiz" : "Sign in to make a quiz"}
            </Link>
            <Link className="button-secondary" href="/download">
              Download the app
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {directory.quizzes.map((quiz) => (
            <article className="panel rounded-[28px] p-6" key={quiz.slug}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tiny-label">
                    {quiz.category} | {quiz.difficulty}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                    {quiz.title}
                  </h2>
                </div>
                <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
                  {quiz.questionCount} Qs
                </div>
              </div>

              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                {quiz.description}
              </p>

              <div className="mt-6 space-y-2 text-sm text-[var(--muted)]">
                <p>Shared by {quiz.authorName}</p>
                <p>Share code: {quiz.slug}</p>
                <p>Published {formatDate(quiz.createdAt)}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="button-secondary"
                  href={`/community-quizzes/${quiz.slug}`}
                >
                  Open quiz page
                </Link>
                <Link className="button-ghost" href="/download">
                  Play in app
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!directory.quizzes.length ? (
          <div className="panel mt-6 rounded-[28px] p-7">
            <p className="tiny-label">Nothing shared yet</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
              The first community quiz is still waiting to be published.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              Once someone publishes a quiz from the creator page, it will show
              up here with a share code the desktop app can open.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
