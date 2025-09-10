// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // avoid Edge env gotchas

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");
      return NextResponse.json(
        {
          reply: "AI is not configured yet. Add OPENAI_API_KEY in .env.local.",
        },
        { status: 200 }
      );
    }

    const { message, transactions = [] } = await req.json();

    // Compact + limit payload
    const slim: Transaction[] = (transactions as Transaction[])
      .slice(-100) // last 100 only
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

Here are recent transactions (slimmed, latest 100):
${JSON.stringify(slim).slice(0, 12000)}
`;

    // Use a small, fast, affordable model
    const resp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",

      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const reply =
      resp.choices?.[0]?.message?.content?.trim() ||
      "I couldn't form a reply from the data provided.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    // Log the real error to your server console
    console.error("CHAT_API_ERROR:", err?.message || err);
    return NextResponse.json(
      { reply: "AI error. Please try again." },
      { status: 200 }
    );
  }
}
