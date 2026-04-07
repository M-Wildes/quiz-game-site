import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { getCommunityQuizBySlug } from "@/lib/community-quizzes";
import { formatDate } from "@/lib/utils";

type CommunityQuizDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    created?: string;
  }>;
};

export default async function CommunityQuizDetailPage({
  params,
  searchParams,
}: CommunityQuizDetailPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const quiz = await getCommunityQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            eyebrow="Shared quiz"
            title={quiz.title}
            description={
              quiz.description ||
              "A community-made quiz set that can be opened from the desktop app using the share code below."
            }
          />

          {query.created ? (
            <div className="mt-8 rounded-[24px] border border-[rgba(10,143,131,0.18)] bg-[rgba(236,252,249,0.9)] px-5 py-4 text-sm text-[var(--teal)]">
              Your quiz is live. Share this page or give players the share code
              below so they can open it in the app.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="panel-strong rounded-[24px] p-5">
              <p className="tiny-label">Share code</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {quiz.slug}
              </p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="tiny-label">Category</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {quiz.category}
              </p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="tiny-label">Difficulty</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {quiz.difficulty}
              </p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="tiny-label">Question count</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {quiz.questionCount}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary" href="/download">
              Play it in the app
            </Link>
            <Link className="button-secondary" href="/community-quizzes/create">
              Make your own
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-[28px] p-7">
          <SectionHeading
            eyebrow="How to play it"
            title="Open the desktop app, then head to Community."
            description="Players can refresh the shared quiz list or paste the share code directly into the app to launch this quiz immediately."
          />
          <div className="mt-8 space-y-3 text-[var(--muted)]">
            <p>1. Download and open the QuizForge desktop app.</p>
            <p>2. Go to the Community tab.</p>
            <p>3. Paste the share code: {quiz.slug}</p>
            <p>4. Press Play This Quiz.</p>
          </div>
          <div className="mt-8 rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-4 text-sm text-[var(--muted)]">
            Shared by {quiz.authorName} on {formatDate(quiz.createdAt)}
          </div>
        </div>

        <div className="panel rounded-[28px] p-7">
          <SectionHeading
            eyebrow="Question preview"
            title="What players will face"
            description="The website gives people enough context to decide if the quiz looks fun, without making them dig through the app first."
          />
          <div className="mt-8 space-y-4">
            {quiz.questions.map((question) => (
              <div
                className="rounded-[22px] border border-[rgba(62,43,22,0.08)] bg-white/72 px-4 py-4"
                key={question.id}
              >
                <p className="tiny-label">Question {question.order}</p>
                <p className="mt-3 font-medium">{question.prompt}</p>
                {question.explanation ? (
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Explanation available after the answer is revealed in the
                    app.
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
