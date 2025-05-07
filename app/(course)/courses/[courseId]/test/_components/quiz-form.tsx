"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Test, Question, Option } from "@prisma/client";
import toast from "react-hot-toast";

interface QuizFormProps {
  test: Test & {
    questions: (Question & {
      options: Option[];
    })[];
  };
  userId: string;
}

export const QuizForm = ({ test, userId }: QuizFormProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== test.questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your quiz...");

    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          userId,
          answers, // already contains { questionId: selectedOptionId }
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.attempt) {
        throw new Error(data.error || "Failed to submit quiz");
      }

      toast.success("Quiz submitted successfully!", { id: toastId });
      router.push(`/courses/${data.attempt.courseId}/test/results?attempt=${data.attempt.id}`);
      
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit quiz",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8">
      {test.questions.map((question) => (
        <div key={question.id} className="space-y-4">
          <h3 className="font-medium">{question.text}</h3>
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={option.id}
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                  }
                />
                <label htmlFor={option.id}>{option.text}</label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || Object.keys(answers).length !== test.questions.length}
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </form>
  );
};
