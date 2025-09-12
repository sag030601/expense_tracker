import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client as a global singleton
// const prisma = global.prisma || new PrismaClient();
declare global {
  // This tells TS that globalThis can have a `prisma` property of type PrismaClient
  var prisma: PrismaClient | undefined;
}
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the promise to get params

  if (!id) {
    return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
  }

  try {
    // Check if the transaction exists before deleting
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await prisma.transaction.delete({ where: { id } });
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the promise to get params

  if (!id) {
    return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const { amount, type, category, note } = body;

  // Validate incoming data
  if (typeof amount !== "number" || isNaN(amount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (!type || !category) {
    return NextResponse.json({ error: "Type and category are required" }, { status: 400 });
  }

  try {
    const updated = await prisma.transaction.update({
      where: { id },
      data: { amount: parseFloat(amount.toString()), type, category, note },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Error:", error);

    // Handle not found error explicitly
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
