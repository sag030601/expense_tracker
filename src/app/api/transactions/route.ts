// src/app/api/transaction/route.ts
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@/generated/prisma';
import { PrismaClient } from '@prisma/client'; 
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

// Handle GET (fetch all) and POST (create)
export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(transactions);
}


export async function POST(req: Request) {
  const body = await req.json();
  const { amount, type, category, note } = body;

  // Step 1: Get the session to extract the user ID
  const session = await getSession();
  
  if (!session?.user?.id) {
    // If there is no user ID in the session, return a 401 Unauthorized response
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Step 2: Use the user ID from the session to associate the transaction
  const newTransaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      category,
      note: note || null,
      user: { connect: { id: session.user.id } }, // Connect the user to the transaction
    },
  });

  return NextResponse.json(newTransaction, { status: 201 });
}
