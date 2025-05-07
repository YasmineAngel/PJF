import { Metadata } from "next";
import { getChapter } from "@/actions/get-chapter";
import { checkTestEligibility } from "@/actions/check-test-eligitibility";
import { getCourseTest } from "@/actions/get-course-test";

import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

import { File, Link } from "lucide-react";

// ✅ This is the correct signature for app directory pages
interface PageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function ChapterIdPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;

  const isEligible = await checkTestEligibility(userId, params.courseId);
  const test = await getCourseTest(params.courseId);

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId ?? ""}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <CourseEnrollButton
                  courseId={params.courseId}
                  price={course.price!}
                />
                <a
                  href={`/courses/${params.courseId}/baridimob-checkout`}
                  className="text-sm text-sky-700 hover:underline"
                >
                  Use BaridiMob instead
                </a>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File className="mr-2" />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}

                {isEligible && test && (
                  <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-medium">Course Quiz Available</h3>
                    <Link
                      href={`/courses/${params.courseId}/quiz`}
                      className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Take Quiz
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
