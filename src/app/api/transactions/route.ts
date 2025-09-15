// src/app/api/transaction/route.ts
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@/generated/prisma';
import { PrismaClient } from '@prisma/client'; 
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";


const prisma = new PrismaClient();

// Handle GET (fetch all) and POST (create)
export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
const session = await getServerSession(authOptions);
 if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  const body = await req.json();
  const { amount, type, category, note } = body;

  if (!amount || !type || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const newTransaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      category,
      note: note || null,
      userId:session.user.id,
    },
  });

  return NextResponse.json(newTransaction, { status: 201 });
}
