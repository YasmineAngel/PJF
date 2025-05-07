import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const attempts = await db.testAttempt.findMany({
      where: { userId },
      include: {
        test: {
          include: {
            course: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("[ATTEMPTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}