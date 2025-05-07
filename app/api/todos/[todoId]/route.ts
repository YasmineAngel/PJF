import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { todoId: string } }) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { isDone } = await req.json();

  const todo = await db.todo.update({
    where: { id: params.todoId },
    data: { isDone },
  });

  return NextResponse.json(todo);
}

export async function DELETE(_req: Request, { params }: { params: { todoId: string } }) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await db.todo.delete({ where: { id: params.todoId } });

  return new NextResponse("Deleted", { status: 200 });
}
