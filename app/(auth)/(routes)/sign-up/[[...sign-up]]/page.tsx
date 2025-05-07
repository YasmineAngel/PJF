"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="bg-[#f4f5ff] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-6 md:p-10 rounded-lg shadow-lg flex flex-col md:flex-row">
        {/* Left: Clerk Sign-Up */}
        <div className="w-full md:w-1/2 p-4 md:p-6">
          <SignUp path="/sign-up" routing="path" redirectUrl="/" />
        </div>

        {/* Right: Welcome/Benefits */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 mt-6 md:mt-0">
          <h2 className="text-2xl font-semibold mb-4">
            Come <span className="text-blue-600">join us</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">
                Explore articles, tutorials, and guides on diverse subjects.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">
                Learn at your own pace and access educational resources anytime.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1 flex-shrink-0" />
              <p className="text-gray-600">
                Engage with a community of learners and share insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
