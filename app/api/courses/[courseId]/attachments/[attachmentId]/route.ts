import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const { courseId, attachmentId } = await context.params;

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
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("ATTACHMENT_ID_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
