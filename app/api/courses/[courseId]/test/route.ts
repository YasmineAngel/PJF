import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Define the expected shape of question input
interface QuestionInput {
  text: string;
  options: string[];
  correctAnswer: string; // should match one of the options
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: { id: resolvedParams.courseId, userId },
    });
    if (!course) return new NextResponse("Not found", { status: 404 });

    const { questions }: { questions: QuestionInput[] } = await req.json();

    const test = await db.$transaction(async (prisma) => {
      const createdTest = await prisma.test.create({
        data: { courseId: resolvedParams.courseId },
      });

      for (const q of questions) {
        // Validate that correctAnswer exists in options
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Correct answer "${q.correctAnswer}" not in options for question "${q.text}"`);
        }

        // Create question with nested options
        await prisma.question.create({
          data: {
            testId: createdTest.id,
            text: q.text,
            options: {
              create: q.options.map((text) => ({ text })),
            },
          },
        });
      }

      // Fetch all questions just created with their options
      const fullTest = await prisma.test.findUnique({
        where: { id: createdTest.id },
        include: {
          questions: { include: { options: true } },
        },
      });

      // Set correct answer now that option IDs are known
      if (!fullTest) throw new Error("Test creation failed");

      for (const question of fullTest.questions) {
        const correctOption = question.options.find(
          (opt) => opt.text === questions.find((q) => q.text === question.text)?.correctAnswer
        );
        if (!correctOption) throw new Error("Correct option not found");

        await prisma.question.update({
          where: { id: question.id },
          data: { correctAnswer: correctOption.id },
        });
      }

      return prisma.test.findUnique({
        where: { id: createdTest.id },
        include: {
          questions: {
            include: { options: true },
          },
        },
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
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const course = await db.course.findFirst({
      where: {
        id: resolvedParams.courseId,
        userId,
      },
    });
    if (!course) return new NextResponse("Not found", { status: 404 });

    const tests = await db.test.findMany({
      where: { courseId: resolvedParams.courseId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("[TESTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
