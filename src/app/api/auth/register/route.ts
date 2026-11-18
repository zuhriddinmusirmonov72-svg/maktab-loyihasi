import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email formati"),
  password: z.string().min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email orqali allaqachon ro'yxatdan o'tilgan" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "USER",
        level: 1,
        xp: 50,
        ecoScore: 100,
      },
    });

    // Award welcome badge if available
    const beginnerBadge = await prisma.badge.findUnique({
      where: { code: "eco-beginner" },
    });
    if (beginnerBadge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: beginnerBadge.id,
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        details: "ECOGEN AI platformasiga muvaffaqiyatli a'zo bo'ldi",
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      ecoScore: user.ecoScore,
    };

    await createSession(sessionUser);

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ro'yxatdan o'tishda tizim xatoligi yuz berdi" },
      { status: 500 }
    );
  }
}
