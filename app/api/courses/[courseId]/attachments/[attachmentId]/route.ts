import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// The DELETE function for handling requests
export async function DELETE(req: NextRequest, context: { params: { courseId: string; attachmentId: string } }) {
  const { courseId, attachmentId } = context.params;

  try {
    // Auth check
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is the course owner
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the attachment
    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("Error deleting attachment", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
