import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; 
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // 1. Verify course ownership
    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!course) return new NextResponse("Not found", { status: 404 });

    // 2. Parse input (expects correctAnswer = Option ID)
    const { questions } = await req.json();

    // 3. Create Test + Questions in a transaction
    const test = await db.$transaction(async (prisma) => {
      // Create the Test first
      const test = await prisma.test.create({
        data: { courseId: params.courseId },
      });

      // Process each Question
      for (const q of questions) {
        // Create ALL options first (to get their IDs)
        const options = await Promise.all(
          q.options.map((text: string) =>
            prisma.option.create({
              data: { text, questionId: "" }, // Temp empty questionId
            })
          )
        );

        // Find the correct Option ID
        const correctOption = options.find((opt) => opt.text === q.correctAnswer);
        if (!correctOption) throw new Error("Correct answer not found in options");

        // Create Question with correctAnswer = Option ID
        await prisma.question.create({
          data: {
            testId: test.id,
            text: q.text,
            correctAnswer: correctOption.id, // ✅ Store OPTION ID (not text)
            options: { connect: options.map((opt) => ({ id: opt.id })) },
          },
        });
      }

      return prisma.test.findUnique({
        where: { id: test.id },
        include: { questions: { include: { options: true } } },
      });
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("[TEST_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const tests = await db.test.findMany({
      where: {
        courseId: params.courseId,
        course: {
          userId
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.log("[TESTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}