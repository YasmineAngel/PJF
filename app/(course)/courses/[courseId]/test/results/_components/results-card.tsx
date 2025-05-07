import { TestAttempt } from "@prisma/client";
import { CheckCircle2, XCircle } from "lucide-react";

export const ResultsCard = ({ attempt }: { attempt: TestAttempt }) => {
  return (
    <div className="border rounded-lg p-6 text-center">
      {attempt.isPassed ? (
        <div className="text-green-600">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Quiz Passed!</h2>
          <p>Score: {attempt.score.toFixed(1)}%</p>
        </div>
      ) : (
        <div className="text-red-600">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Quiz Not Passed</h2>
          <p>Score: {attempt.score.toFixed(1)}% (Minimum: 70%)</p>
        </div>
      )}
    </div>
  );
};