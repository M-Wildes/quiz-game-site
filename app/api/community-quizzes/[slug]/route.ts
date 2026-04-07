import { NextResponse } from "next/server";
import { getCommunityQuizBySlug } from "@/lib/community-quizzes";

type CommunityQuizRouteContext = {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
};

export async function GET(
  _request: Request,
  context: CommunityQuizRouteContext,
) {
  const { slug } = await context.params;
  const quiz = await getCommunityQuizBySlug(slug);

  if (!quiz) {
    return NextResponse.json(
      { error: "Community quiz not found." },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    isPreview: false,
    quiz,
  });
}
