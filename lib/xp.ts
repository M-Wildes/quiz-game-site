import type {
  CalculatedQuizResult,
  Difficulty,
  QuizUploadPayload,
} from "@/lib/types";

const difficultyXp: Record<Difficulty, number> = {
  easy: 0,
  medium: 20,
  hard: 45,
};

const scoreMultiplier: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.25,
  hard: 1.5,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateQuizOutcome(
  payload: QuizUploadPayload,
): CalculatedQuizResult {
  const totalQuestions = clamp(Math.round(payload.totalQuestions), 1, 100);
  const correctAnswers = clamp(
    Math.round(payload.correctAnswers),
    0,
    totalQuestions,
  );
  const accuracyRatio = correctAnswers / totalQuestions;
  const accuracy = Number((accuracyRatio * 100).toFixed(1));

  let xpEarned =
    50 + Math.round(accuracyRatio * 60) + difficultyXp[payload.difficulty];

  if (accuracyRatio >= 0.9) {
    xpEarned += 20;
  } else if (accuracyRatio >= 0.8) {
    xpEarned += 10;
  }

  if (payload.durationMs > 0 && payload.durationMs < totalQuestions * 4500) {
    xpEarned += 15;
  }

  if (payload.streakBonus) {
    xpEarned += 10;
  }

  const score = Math.round(
    correctAnswers * 100 * scoreMultiplier[payload.difficulty] +
      accuracyRatio * 250,
  );

  return {
    score,
    xpEarned,
    accuracy,
    correctAnswers,
    totalQuestions,
  };
}

export function getLevelFromXp(totalXp: number) {
  return Math.floor(Math.sqrt(Math.max(totalXp, 0) / 180)) + 1;
}

export function getXpForLevel(level: number) {
  return Math.max(level - 1, 0) ** 2 * 180;
}

export function getXpForNextLevel(level: number) {
  return Math.max(level, 1) ** 2 * 180;
}
