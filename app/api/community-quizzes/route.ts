import { NextResponse } from "next/server";
import { getCommunityQuizDirectory } from "@/lib/community-quizzes";

export async function GET() {
  const directory = await getCommunityQuizDirectory();
  return NextResponse.json(directory);
}
