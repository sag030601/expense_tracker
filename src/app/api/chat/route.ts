// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs"; // avoid Edge env gotchas

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  createdAt: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json(
        {
          reply: "AI is not configured yet. Add GEMINI_API_KEY in .env.local.",
        },
        { status: 200 }
      );
    }

    const { message, transactions = [] } = await req.json();

    const slim: Transaction[] = (transactions as Transaction[])
      .slice(-100)
      .map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        type: t.type,
        category: t.category,
        note: t.note?.slice(0, 80) ?? "",
        createdAt: t.createdAt,
      }));

    const systemPrompt = `
You are a concise, upbeat financial assistant. Use INR (₹). 
Be specific and actionable. If data is limited, say so and suggest next steps.`;

    const userPrompt = `
User: ${message}

Here are recent transactions (latest 100, slimmed):
${JSON.stringify(slim).slice(0, 12000)}
`;
    // const models = await genAI.listModels();
    // console.log("Available Models:", models);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `${systemPrompt}\n\n${userPrompt}`
    );

    const text = result.response.text().trim();

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    // console.error("GEMINI_API_ERROR:", err?.message || err);
     if (err instanceof Error) {
      console.error("GEMINI_API_ERROR:", err.message); // Access message safely
    } else {
      console.error("GEMINI_API_ERROR: Unknown error", err); // Handle unknown errors
    }
    return NextResponse.json(
      { reply: "AI error. Please try again." },
      { status: 200 }
    );
  }
}
