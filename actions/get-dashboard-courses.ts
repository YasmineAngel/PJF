import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithChaptersAndCategory = Course & {
    category: Category;
    chapters: Chapter[];
};

type CourseWithProgress = CourseWithChaptersAndCategory & {
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgress[];
    coursesInProgress: CourseWithProgress[];
};

type PurchaseWithCourse = {
    course: CourseWithChaptersAndCategory;
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });

        // Initialize courses with progress as null
        const courses: CourseWithProgress[] = purchasedCourses.map((purchase) => ({
            ...purchase.course,
            progress: null
        }));

        // Update progress for each course
        await Promise.all(courses.map(async (course) => {
            const progress = await getProgress(userId, course.id);
            course.progress = progress;
        }));

        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
};
