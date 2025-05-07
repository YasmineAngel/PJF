import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export const checkTestEligibility = async (userId: string, courseId: string) => {
  const [purchase, progress, existingAttempt] = await Promise.all([
    db.purchase.findUnique({ where: { userId_courseId: { userId, courseId }} }),
    getProgress(userId, courseId),
    db.testAttempt.findFirst({ where: { userId, test: { courseId } } })
  ]);

  return !!purchase && progress === 100 && !existingAttempt;
};