import {
  mockCommunityQuizDetails,
  mockCommunityQuizDirectory,
} from "@/lib/mock-data";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type {
  CommunityQuizDetail,
  CommunityQuizDirectory,
  CommunityQuizQuestion,
  CommunityQuizSummary,
  Difficulty,
} from "@/lib/types";

type CommunityQuizAuthorRecord =
  | {
      username?: string | null;
      display_name?: string | null;
    }
  | Array<{
      username?: string | null;
      display_name?: string | null;
    }>
  | null;

type CommunityQuizQuestionInput = {
  prompt: string;
  answers: string[];
  correctIndex: number;
  explanation?: string;
};

type CreateCommunityQuizInput = {
  authorId: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  questions: CommunityQuizQuestionInput[];
};

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
}

function readAuthorName(author: CommunityQuizAuthorRecord) {
  const resolvedAuthor = Array.isArray(author) ? author[0] : author;
  return (
    resolvedAuthor?.display_name ||
    resolvedAuthor?.username ||
    "Community creator"
  );
}

function toSummary(
  row: {
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    category?: string | null;
    difficulty?: string | null;
    question_count?: number | null;
    play_count?: number | null;
    created_at?: string | null;
    profiles?: CommunityQuizAuthorRecord;
  },
  fallbackQuestionCount = 0,
): CommunityQuizSummary {
  const slug = row.slug ?? "";

  return {
    slug,
    title: row.title ?? "Shared quiz",
    description: row.description ?? "",
    category: row.category ?? "Community",
    difficulty:
      row.difficulty === "easy" || row.difficulty === "hard"
        ? row.difficulty
        : "medium",
    questionCount: Math.max(
      asNumber(row.question_count, fallbackQuestionCount),
      fallbackQuestionCount,
    ),
    playCount: Math.max(asNumber(row.play_count), 0),
    authorName: readAuthorName(row.profiles ?? null),
    createdAt: row.created_at ?? new Date().toISOString(),
    sharePath: `/community-quizzes/${slug}`,
  };
}

function toQuestion(
  row: {
    id?: string | null;
    question_order?: number | null;
    prompt?: string | null;
    answers?: unknown;
    correct_index?: number | null;
    explanation?: string | null;
  },
  index: number,
): CommunityQuizQuestion | null {
  const answers = asStringArray(row.answers);
  const correctIndex = asNumber(row.correct_index, -1);

  if (!row.prompt || answers.length < 2 || correctIndex < 0 || correctIndex >= answers.length) {
    return null;
  }

  return {
    id: row.id ?? `community-question-${index + 1}`,
    order: asNumber(row.question_order, index + 1),
    prompt: row.prompt,
    answers,
    correctIndex,
    explanation: row.explanation ?? "",
  };
}

function findMockCommunityQuizBySlug(slug: string) {
  return mockCommunityQuizDetails[slug] ?? null;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);

  return slug || `quiz-${crypto.randomUUID().split("-")[0]}`;
}

async function generateUniqueSlug(baseTitle: string) {
  const client = createServiceRoleSupabaseClient();

  if (!client) {
    return slugify(baseTitle);
  }

  const baseSlug = slugify(baseTitle);
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await client
      .from("community_quizzes")
      .select("slug")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function getCommunityQuizDirectory(
  limit = 24,
): Promise<CommunityQuizDirectory> {
  const client = createServiceRoleSupabaseClient();

  if (!client) {
    return mockCommunityQuizDirectory;
  }

  try {
    const { data, error } = await client
      .from("community_quizzes")
      .select(
        `
          slug,
          title,
          description,
          category,
          difficulty,
          question_count,
          play_count,
          created_at,
          profiles:profiles!community_quizzes_author_id_fkey (
            username,
            display_name
          )
        `,
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return {
      isPreview: false,
      updatedAt: new Date().toISOString(),
      quizzes: (data ?? []).map((row) => toSummary(row)),
    };
  } catch {
    return mockCommunityQuizDirectory;
  }
}

export async function getCommunityQuizBySlug(
  slug: string,
): Promise<CommunityQuizDetail | null> {
  const trimmedSlug = slug.trim();
  if (!trimmedSlug) {
    return null;
  }

  const client = createServiceRoleSupabaseClient();
  if (!client) {
    return findMockCommunityQuizBySlug(trimmedSlug);
  }

  try {
    const { data: quizRow, error: quizError } = await client
      .from("community_quizzes")
      .select(
        `
          id,
          slug,
          title,
          description,
          category,
          difficulty,
          question_count,
          play_count,
          created_at,
          profiles:profiles!community_quizzes_author_id_fkey (
            username,
            display_name
          )
        `,
      )
      .eq("slug", trimmedSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (quizError) {
      throw quizError;
    }

    if (!quizRow) {
      return null;
    }

    const { data: questionRows, error: questionError } = await client
      .from("community_quiz_questions")
      .select("id, question_order, prompt, answers, correct_index, explanation")
      .eq("quiz_id", quizRow.id)
      .order("question_order", { ascending: true });

    if (questionError) {
      throw questionError;
    }

    const questions = (questionRows ?? [])
      .map((row, index) => toQuestion(row, index))
      .filter((question): question is CommunityQuizQuestion => question !== null);

    return {
      ...toSummary(quizRow, questions.length),
      questions,
    };
  } catch {
    return findMockCommunityQuizBySlug(trimmedSlug);
  }
}

export async function createCommunityQuiz(input: CreateCommunityQuizInput) {
  const client = createServiceRoleSupabaseClient();

  if (!client) {
    throw new Error("Community quizzes are not available right now.");
  }

  if (input.questions.length < 3) {
    throw new Error("Add at least 3 questions before publishing.");
  }

  const slug = await generateUniqueSlug(input.title);

  const { data: insertedQuiz, error: insertQuizError } = await client
    .from("community_quizzes")
    .insert({
      author_id: input.authorId,
      slug,
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      question_count: input.questions.length,
      is_published: true,
    })
    .select("id, slug")
    .single();

  if (insertQuizError || !insertedQuiz) {
    throw insertQuizError ?? new Error("Could not create the quiz.");
  }

  const questionRows = input.questions.map((question, index) => ({
    quiz_id: insertedQuiz.id,
    question_order: index + 1,
    prompt: question.prompt,
    answers: question.answers,
    correct_index: question.correctIndex,
    explanation: question.explanation ?? "",
  }));

  const { error: insertQuestionError } = await client
    .from("community_quiz_questions")
    .insert(questionRows);

  if (insertQuestionError) {
    await client.from("community_quizzes").delete().eq("id", insertedQuiz.id);
    throw insertQuestionError;
  }

  return insertedQuiz.slug;
}
