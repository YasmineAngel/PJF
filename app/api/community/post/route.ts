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
    const { title, content, imageUrl } = body;

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        userId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POST_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
