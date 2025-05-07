import { getCourseTest } from "@/actions/get-course-test";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QuizForm } from "./_components/quiz-form";

export default async function QuizPage({
  params
}: {
  params: { courseId: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const test = await getCourseTest(params.courseId);
  if (!test) redirect(`/courses/${params.courseId}`);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Quiz</h1>
      <QuizForm test={test} userId={userId} />
    </div>
  );
}