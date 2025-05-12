import { getCourseTest } from "@/actions/get-course-test";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QuizForm } from "./_components/quiz-form";

const QuizPage = async (
  props: {
    params: Promise<{ courseId: string }>;
  }
) => {
  const params = await props.params;
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
};

export default QuizPage;
