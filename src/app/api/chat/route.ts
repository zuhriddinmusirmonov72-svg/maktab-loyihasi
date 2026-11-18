import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { generateAiResponse } from "@/lib/ai-assistant";
import prisma from "@/lib/prisma";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
    })
  ),
  language: z.enum(["uz", "ru", "en"]).default("uz"),
  chatId: z.string().optional(),
});

// Simple in-memory rate limiting: max 30 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Juda ko'p so'rov yuborildi. Iltimos, 1 daqiqa kuting." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "So'rov formati noto'g'ri" },
        { status: 400 }
      );
    }

    const { messages, language, chatId } = parsed.data;
    const session = await getSession();

    const { reply, isFallback } = await generateAiResponse(messages, language);

    // Save to DB if user is logged in
    let savedChatId = chatId;
    if (session) {
      try {
        if (!savedChatId) {
          const userMessage = messages.find((m) => m.role === "user")?.content || "Yangi suhbat";
          const newChat = await prisma.chat.create({
            data: {
              userId: session.id,
              title: userMessage.slice(0, 40) + "...",
            },
          });
          savedChatId = newChat.id;
        }

        const lastUserMsg = messages[messages.length - 1];
        if (lastUserMsg && lastUserMsg.role === "user") {
          await prisma.chatMessage.create({
            data: {
              chatId: savedChatId,
              role: "user",
              content: lastUserMsg.content,
            },
          });
        }

        await prisma.chatMessage.create({
          data: {
            chatId: savedChatId,
            role: "assistant",
            content: reply,
          },
        });

        // Award 5 XP for consulting AI Assistant
        await prisma.user.update({
          where: { id: session.id },
          data: { xp: { increment: 5 } },
        });
      } catch (dbErr) {
        console.error("Error saving chat message to DB:", dbErr);
      }
    }

    return NextResponse.json({
      reply,
      isFallback,
      chatId: savedChatId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI xizmati bilan bog'lanishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
