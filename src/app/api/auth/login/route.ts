import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(1, "Parol kiritilmadi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Elektron pochta yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Elektron pochta yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Kirishda kutilmagan server xatoligi" },
      { status: 500 }
    );
  }
}
