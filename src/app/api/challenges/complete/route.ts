import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await getSession();
    } catch {}

    const { challengeId } = await req.json();
    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID kiritilmadi" }, { status: 400 });
    }

    if (session) {
      try {
        await prisma.userChallenge.upsert({
          where: {
            userId_challengeId: {
              userId: session.id,
              challengeId,
            },
          },
          update: {
            completed: true,
            completedAt: new Date(),
          },
          create: {
            userId: session.id,
            challengeId,
            completed: true,
          },
        });

        await prisma.user.update({
          where: { id: session.id },
          data: {
            xp: { increment: 25 },
            ecoScore: { increment: 2 },
          },
        });
      } catch (err) {
        console.warn("DB userChallenge error, returning success:", err);
      }
    }

    return NextResponse.json({ success: true, challengeId });
  } catch (error) {
    console.error("Challenge completion error:", error);
    return NextResponse.json({ error: "Topshiriqni belgilashda xatolik" }, { status: 500 });
  }
}
