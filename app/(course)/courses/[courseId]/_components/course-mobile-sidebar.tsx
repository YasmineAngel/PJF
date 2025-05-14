import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress, Test } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseWithChaptersAndTests extends Course {
    chapters: (Chapter & {
        userProgress: UserProgress[] | null;
    })[];
    tests: Test[];
}

interface CourseMobileSidebarProps {
    course: CourseWithChaptersAndTests;
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount,
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    );
};
