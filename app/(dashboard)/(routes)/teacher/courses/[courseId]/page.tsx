import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-from";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import { ClipboardList } from "lucide-react"; // Add this import
import { TestForm } from "./_components/test-form"; // Add this import

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

const CoursePage = async ({ params }: CoursePageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

 // Update your course query to include tests
const course = await db.course.findUnique({
  where: {
    id: params.courseId,
    userId,
  },
  include: {
    chapters: {
      orderBy: {
        position: "asc",
      },
    },
    attachments: {
      orderBy: {
        createdAt: "desc",
      },
    },
    tests: {
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    },
  },
});

  if (!course) {
    return redirect("/");
  }

  
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    course.imageURL,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completiondText = `(${completedFields}/${totalFields} fields completed)`;


  const isComplete = requiredFields.every(Boolean);

  return (
    <>
    {!course.isPublished && (
      <Banner
      label="This course is unpublished . It will not be visible to the students ."
      />

    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completiondText}
          </span>
        </div>
        <Actions
        disabled={!isComplete}
        courseId={params.courseId}
        ispublished={course.isPublished}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>

          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">Resources & Attachments</h2>
          </div>
          <AttachmentForm initialData={course} courseId={course.id} />
        </div>
        <div>
    <div className="flex items-center gap-x-2">
      <IconBadge icon={ClipboardList} />
      <h2 className="text-xl">Course Quiz</h2>
    </div>
    <TestForm 
      courseId={course.id}
      initialData={course.tests[0] ? {
        questions: course.tests[0].questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options.map(o => ({
            id: o.id,
            text: o.text,
            isCorrect: o.text === q.correctAnswer
          }))
        }))
      } : undefined}
    />
  </div>
      </div>
    </div>
    </>
  );
};

export default CoursePage;
