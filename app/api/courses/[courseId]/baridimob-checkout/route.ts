import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { transactionId, receiptUrl } = body;
    const resolvedParams = await params;
    const { courseId } = resolvedParams;

    if (!transactionId || !receiptUrl || !courseId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // ✅ Check if payment proof already exists for this user and course
    const existingProof = await prisma.paymentProof.findFirst({
      where: {
        userId,
        courseId,
        method: "BaridiMob",
      },
    });

    if (existingProof) {
      // ✅ Update existing proof
      await prisma.paymentProof.update({
        where: { id: existingProof.id },
        data: {
          transactionId,
          receiptUrl,
          status: "PENDING", // reset status if needed
        },
      });
    } else {
      // ✅ Create new proof
      await prisma.paymentProof.create({
        data: {
          userId,
          courseId,
          method: "BaridiMob",
          transactionId,
          receiptUrl,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ message: "Payment proof submitted successfully." });
  } catch (error) {
    console.error("[BARIDIMOB_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
