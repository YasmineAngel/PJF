// actions/get-course-test.ts
import { db } from "@/lib/db";
import { Test, Question, Option } from "@prisma/client";

export const getCourseTest = async (courseId: string) => {
  return await db.test.findFirst({
    where: { courseId },
    orderBy: { createdAt: "desc" }, // Optional but safer
    include: {
      questions: {
        include: { options: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  
};

export type TestWithQuestions = Awaited<ReturnType<typeof getCourseTest>>;