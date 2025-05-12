import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: { courseId: string; attachmentId: string } }
) {
  const { courseId, attachmentId } = context.params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[ATTACHMENT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
