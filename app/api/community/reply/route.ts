import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb"; // update path if needed

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, postId } = body;

    if (!content || !postId) {
      return new NextResponse("Content and Post ID are required", { status: 400 });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("[REPLY_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
