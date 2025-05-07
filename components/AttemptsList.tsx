"use client";

import { useEffect, useState } from "react";

interface Attempt {
  id: string;
  score: number;
  test: {
    course: {
      title: string;
    };
  };
}

export function AttemptsList() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attempts")
      .then((res) => res.json())
      .then((data) => {
        setAttempts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
  };

  // Group attempts by course title
  const groupedAttempts = attempts.reduce<Record<string, Attempt[]>>((acc, attempt) => {
    const courseTitle = attempt.test.course.title;
    if (!acc[courseTitle]) acc[courseTitle] = [];
    acc[courseTitle].push(attempt);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Quiz Results</h1>
        <p className="text-lg text-gray-600">
          {attempts.length > 0
            ? `You've completed ${attempts.length} quiz attempt${attempts.length !== 1 ? 's' : ''}`
            : "Your quiz attempts will appear here"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No quiz attempts</h3>
          <p className="mt-1 text-gray-500">Complete a quiz to see your results here.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedAttempts).map(([courseTitle, attempts]) => (
            <div key={courseTitle}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{courseTitle}</h2>
              <div className="space-y-4">
                {attempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Attempt {index + 1}</span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            attempt.score
                          )}`}
                        >
                          {attempt.score}%
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              attempt.score >= 80
                                ? "bg-emerald-500"
                                : attempt.score >= 60
                                ? "bg-blue-500"
                                : attempt.score >= 40
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${attempt.score}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
