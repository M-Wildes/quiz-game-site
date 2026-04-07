import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getWebsiteUser } from "@/lib/auth";
import { createCommunityQuizAction } from "./actions";

const questionSlots = Array.from({ length: 6 }, (_, index) => index);

type CreateCommunityQuizPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function CreateCommunityQuizPage({
  searchParams,
}: CreateCommunityQuizPageProps) {
  const params = (await searchParams) ?? {};
  const user = await getWebsiteUser();

  if (!user) {
    return (
      <div className="page-shell py-12">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            eyebrow="Create community quiz"
            title="Sign in before you publish something for the app."
            description="Community quizzes are tied to a player account so the website can credit the creator and the app can surface a proper shared-quiz library."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary" href="/login">
              Sign in
            </Link>
            <Link className="button-secondary" href="/signup">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-10">
      <section className="page-shell">
        <div className="panel rounded-[32px] p-8 lg:p-10">
          <SectionHeading
            eyebrow="Create community quiz"
            title="Build a quiz on the website, then share it into the desktop app."
            description="This first creator flow keeps things straightforward: a title, a category, a difficulty, and up to 6 multiple-choice questions. Publish it, then share the link or share code."
          />

          {params.error ? (
            <div className="mt-8 rounded-[24px] border border-[rgba(208,44,44,0.18)] bg-[rgba(255,241,241,0.8)] px-5 py-4 text-sm text-[#8b1e1e]">
              {params.error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="page-shell">
        <form action={createCommunityQuizAction} className="space-y-6">
          <div className="panel rounded-[30px] p-7">
            <SectionHeading
              eyebrow="Quiz details"
              title="Set the tone for the quiz first."
              description="The title and description are what other players see on the website and in the app when they decide whether to open it."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <label className="block space-y-2 lg:col-span-2">
                <span className="tiny-label">Title</span>
                <input
                  className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                  name="title"
                  placeholder="Late Night Science Sprint"
                  required
                />
              </label>

              <label className="block space-y-2 lg:col-span-2">
                <span className="tiny-label">Description</span>
                <textarea
                  className="min-h-28 w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                  name="description"
                  placeholder="Tell players what kind of quiz this is and why it is fun."
                />
              </label>

              <label className="block space-y-2">
                <span className="tiny-label">Category</span>
                <input
                  className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                  name="category"
                  placeholder="Science"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="tiny-label">Difficulty</span>
                <select
                  className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                  defaultValue="medium"
                  name="difficulty"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-5">
            {questionSlots.map((slot) => (
              <div className="panel rounded-[28px] p-7" key={slot}>
                <SectionHeading
                  eyebrow={`Question ${slot + 1}`}
                  title={slot < 3 ? "Required question" : "Optional extra question"}
                  description={
                    slot < 3
                      ? "Fill these out to reach the minimum publishable quiz size."
                      : "Add extra questions to make the shared quiz feel more substantial."
                  }
                />

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  <label className="block space-y-2 lg:col-span-2">
                    <span className="tiny-label">Prompt</span>
                    <textarea
                      className="min-h-24 w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                      name={`question_${slot}_prompt`}
                      placeholder="Write the question exactly as players should see it."
                      required={slot < 3}
                    />
                  </label>

                  {["a", "b", "c", "d"].map((answerKey, answerIndex) => (
                    <label className="block space-y-2" key={answerKey}>
                      <span className="tiny-label">Answer {answerIndex + 1}</span>
                      <input
                        className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                        name={`question_${slot}_answer_${answerKey}`}
                        placeholder={`Option ${answerIndex + 1}`}
                        required={slot < 3}
                      />
                    </label>
                  ))}

                  <label className="block space-y-2">
                    <span className="tiny-label">Correct answer</span>
                    <select
                      className="w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                      defaultValue="a"
                      name={`question_${slot}_correct`}
                    >
                      <option value="a">Answer 1</option>
                      <option value="b">Answer 2</option>
                      <option value="c">Answer 3</option>
                      <option value="d">Answer 4</option>
                    </select>
                  </label>

                  <label className="block space-y-2 lg:col-span-2">
                    <span className="tiny-label">Explanation</span>
                    <textarea
                      className="min-h-24 w-full rounded-[18px] border border-[rgba(62,43,22,0.12)] bg-white/80 px-4 py-3 outline-none"
                      name={`question_${slot}_explanation`}
                      placeholder="Optional explanation shown after the player answers."
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="page-shell !px-0">
            <div className="flex flex-wrap gap-4">
              <button className="button-primary" type="submit">
                Publish community quiz
              </button>
              <Link className="button-secondary" href="/community-quizzes">
                Back to shared quizzes
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
