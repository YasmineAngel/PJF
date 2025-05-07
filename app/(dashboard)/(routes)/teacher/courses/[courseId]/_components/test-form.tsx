"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Question {
  id?: string;
  text: string;
  options: {
    id?: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface TestFormProps {
  courseId: string;
  initialData?: {
    questions: Question[];
  };
}

export const TestForm = ({ courseId, initialData }: TestFormProps) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData?.questions) {
      setQuestions(initialData.questions);
    }
  }, [initialData]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleAddOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options.length > 2) {
      updated[questionIndex].options.splice(optionIndex, 1);
      const correctOption = updated[questionIndex].options.find(o => o.isCorrect);
      if (!correctOption && updated[questionIndex].options.length > 0) {
        updated[questionIndex].options[0].isCorrect = true;
      }
      setQuestions(updated);
    } else {
      toast.error("Each question must have at least 2 options");
    }
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== questionIndex));
    } else {
      toast.error("A quiz must have at least one question");
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      for (const q of questions) {
        if (!q.text.trim()) {
          throw new Error("All questions must have text");
        }
        if (q.options.length < 2) {
          throw new Error("Each question must have at least 2 options");
        }
        if (!q.options.some(o => o.isCorrect)) {
          throw new Error("Each question must have one correct answer");
        }
        for (const o of q.options) {
          if (!o.text.trim()) {
            throw new Error("All options must have text");
          }
        }
      }

      const data = {
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options.map(o => o.text),
          correctAnswer: q.options.find(o => o.isCorrect)?.text || ""
        }))
      };

      await axios.post(`/api/courses/${courseId}/test`, data);

      toast.success("Quiz saved!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Quiz
        <Button onClick={handleAddQuestion} variant="ghost">
          <Plus className="h-4 w-4 mr-2" />
          Add a question
        </Button>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm mt-2 text-slate-500 italic">
          No questions added yet
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-white border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Question {qi + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveQuestion(qi)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              <Input
                placeholder="Enter the question"
                value={q.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qi].text = e.target.value;
                  setQuestions(updated);
                }}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">Options</p>
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${oi + 1}`}
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qi].options[oi].text = e.target.value;
                        setQuestions(updated);
                      }}
                    />
                    <label className="flex items-center gap-1 text-sm text-muted-foreground">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={opt.isCorrect}
                        onChange={() => {
                          const updated = [...questions];
                          updated[qi].options = updated[qi].options.map((o, i) => ({
                            ...o,
                            isCorrect: i === oi,
                          }));
                          setQuestions(updated);
                        }}
                        className="h-4 w-4"
                      />
                      Correct
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(qi, oi)}
                      disabled={q.options.length <= 2}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOption(qi)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Quiz"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
