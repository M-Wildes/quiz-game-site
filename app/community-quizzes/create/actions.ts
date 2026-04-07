"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getWebsiteUser } from "@/lib/auth";
import { createCommunityQuiz } from "@/lib/community-quizzes";
import type { Difficulty } from "@/lib/types";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const answerKeys = ["a", "b", "c", "d"] as const;

export async function createCommunityQuizAction(formData: FormData) {
  const user = await getWebsiteUser();

  if (!user) {
    redirect(
      "/login?message=Sign+in+to+create+and+share+community+quizzes.",
    );
  }

  const title = readField(formData, "title");
  const description = readField(formData, "description");
  const category = readField(formData, "category");
  const difficultyValue = readField(formData, "difficulty");
  const difficulty: Difficulty =
    difficultyValue === "easy" || difficultyValue === "hard"
      ? difficultyValue
      : "medium";

  if (!title || !category) {
    redirect(
      "/community-quizzes/create?error=Title+and+category+are+required.",
    );
  }

  const questions = Array.from({ length: 6 }, (_, index) => {
    const prompt = readField(formData, `question_${index}_prompt`);
    const answers = answerKeys.map((key) =>
      readField(formData, `question_${index}_answer_${key}`),
    );
    const correctLetter = readField(formData, `question_${index}_correct`);
    const explanation = readField(formData, `question_${index}_explanation`);

    return {
      prompt,
      answers,
      correctLetter,
      explanation,
    };
  }).filter((question) => question.prompt);

  if (questions.length < 3) {
    redirect(
      "/community-quizzes/create?error=Add+at+least+3+questions+before+publishing.",
    );
  }

  for (const question of questions) {
    if (question.answers.some((answer) => !answer)) {
      redirect(
        "/community-quizzes/create?error=Every+filled+question+needs+all+4+answers.",
      );
    }

    const correctIndex = answerKeys.indexOf(
      question.correctLetter as (typeof answerKeys)[number],
    );

    if (correctIndex < 0) {
      redirect(
        "/community-quizzes/create?error=Choose+the+correct+answer+for+every+filled+question.",
      );
    }
  }

  try {
    const slug = await createCommunityQuiz({
      authorId: user.id,
      title,
      description,
      category,
      difficulty,
      questions: questions.map((question) => ({
        prompt: question.prompt,
        answers: question.answers,
        correctIndex: answerKeys.indexOf(
          question.correctLetter as (typeof answerKeys)[number],
        ),
        explanation: question.explanation,
      })),
    });

    revalidatePath("/community-quizzes");
    revalidatePath(`/community-quizzes/${slug}`);
    redirect(`/community-quizzes/${slug}?created=1`);
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "Could not publish that quiz right now.";
    redirect(
      `/community-quizzes/create?error=${encodeURIComponent(message)}`,
    );
  }
}
