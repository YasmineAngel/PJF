import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { testId, userId, answers } = await req.json();

    if (!testId || !userId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const testExists = await db.test.findUnique({ where: { id: testId } });
    if (!testExists) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      );
    }

    const questions = await db.question.findMany({
      where: { testId },
      select: { id: true, correctAnswer: true },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questions found for this test" },
        { status: 400 }
      );
    }

    let correctCount = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const match = userAnswer === q.correctAnswer; // ✅ Compare Option.id strings

      if (match) correctCount++;
    });

    const score = (correctCount / questions.length) * 100;
    const isPassed = score >= 70;

    const attempt = await db.testAttempt.create({
      data: {
        testId,
        userId,
        score,
        isPassed,
        answers, // { [questionId]: optionId }
      },
      select: {
        id: true,
        score: true,
        isPassed: true,
        test: { select: { courseId: true } },
      },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score,
        isPassed: attempt.isPassed,
        courseId: attempt.test.courseId,
      },
    });
  } catch (error) {
    console.error("[QUIZ_SUBMISSION_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
