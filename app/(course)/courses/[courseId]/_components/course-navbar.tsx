import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, UserProgress, Test } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

// Define a shared interface that both components will use
interface CourseWithChapters extends Course {
  chapters: (Chapter & {
    userProgress?: UserProgress[]; // Optional userProgress array
  })[];
  tests?: Test[]; // Optional tests
}

interface CourseNavbarProps {
  course: CourseWithChapters;
  progressCount: number;
}

export const CourseNavbar = ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />
    </div>
  );
};
