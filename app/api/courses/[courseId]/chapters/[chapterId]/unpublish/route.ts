import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: resolvedParams.courseId,
        userId
      }
    });
    
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const unpublishedChapter = await db.chapter.update({
      where: {
        id: resolvedParams.chapterId,
        courseId: resolvedParams.courseId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: resolvedParams.courseId,
        isPublished: true,
      }
    });
    
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: resolvedParams.courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }
    
    return NextResponse.json(unpublishedChapter);

  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
