// app/(course)/courses/[courseId]/quiz/results/page.tsx
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ResultsCard } from "./_components/results-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const QuizResultsPage = async (props: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { userId } = await auth();
  if (!userId || !searchParams.attempt) {
    return redirect(`/courses/${params.courseId}`);
  }

  const attempt = await db.testAttempt.findUnique({
    where: {
      id: searchParams.attempt,
      userId,
      test: {
        courseId: params.courseId,
      },
    },
    include: {
      test: true,
    },
  });

  if (!attempt) {
    return redirect(`/courses/${params.courseId}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ResultsCard attempt={attempt} />
      <Button asChild className="mt-6">
        <Link href={`/courses/${params.courseId}`}>Back to Course</Link>
      </Button>
    </div>
  );
};

export default QuizResultsPage;
