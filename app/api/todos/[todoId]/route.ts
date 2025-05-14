import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { isDone } = await req.json();

    const todo = await db.todo.update({
      where: { 
        id: resolvedParams.todoId,
        userId // Ensure users can only update their own todos
      },
      data: { isDone },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("[TODO_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;

    await db.todo.delete({
      where: { 
        id: resolvedParams.todoId,
        userId // Ensure users can only delete their own todos
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[TODO_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
