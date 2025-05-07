import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress, Test } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    tests: Test[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  const hasTest = course.tests.length > 0;
  const isCourseComplete = progressCount === 100;

  return (
    <div className="h-full border-r flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => {
          const isCompleted = chapter.userProgress?.[0]?.isCompleted ?? false;
          const isLocked = !chapter.isFree && !purchase;

          return (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              isCompleted={isCompleted}
              isLocked={isLocked}
              courseId={course.id}
            />
          );
        })}
      </div>
      
      {/* Test/Quiz Section */}
      {hasTest && (
        <div className="mt-4 p-4 border-t">
          <Link
            href={`/courses/${course.id}/test`}
            className={`flex items-center gap-2 p-3 rounded-md transition-colors
              ${isCourseComplete 
                ? "text-sky-700 hover:bg-sky-100" 
                : "text-gray-400 cursor-not-allowed"}
            `}
          >
            <BookOpenCheck className="h-5 w-5" />
            <span className="text-sm font-medium">
              Course Test
              {!isCourseComplete && (
                <span className="block text-xs text-gray-500">
                  Complete all chapters to unlock
                </span>
              )}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};