"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect signed-in users to the dashboard
  if (isSignedIn) {
    router.push("/");
    return null;
  }

  return (
    <div className="bg-[#f4f5ff] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-6 md:p-10 rounded-lg shadow-lg flex flex-col md:flex-row">
        {/* Left: Clerk Sign-In */}
        <div className="w-full md:w-1/2 p-4 md:p-6">
          <SignIn path="/sign-in" routing="path" redirectUrl="/" />
        </div>

        {/* Right: Welcome/Benefits */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 mt-6 md:mt-0">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome <span className="text-blue-600">back</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">Continue learning where you left off.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">
                Access your saved courses, articles, and tools instantly.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">Connect with a community of fellow learners.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
