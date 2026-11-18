import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { role } = await req.json().catch(() => ({ role: "user" }));

    const targetEmail = role === "admin" ? "admin@ecogen.uz" : "demo@ecogen.uz";

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Demo foydalanuvchi bazada topilmadi. Seed scriptni ishga tushiring." },
        { status: 404 }
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
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Demo kirishda xatolik" }, { status: 500 });
  }
}
