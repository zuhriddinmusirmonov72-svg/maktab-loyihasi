import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Topshiriqni bajarish uchun tizimga kiring" },
        { status: 401 }
      );
    }

    const { challengeId } = await req.json();
    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID kiritilmadi" }, { status: 400 });
    }

    const challenge = await prisma.ecoChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Topshiriq topilmadi" }, { status: 404 });
    }

    // Upsert completion
    const userChallenge = await prisma.userChallenge.upsert({
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

    // Award challenge points to user
    await prisma.user.update({
      where: { id: session.id },
      data: {
        xp: { increment: challenge.points },
        ecoScore: { increment: 2 },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "CHALLENGE_COMPLETED",
        details: `Topshiriq bajarildi: ${challenge.titleUz} (+${challenge.points} XP)`,
      },
    });

    return NextResponse.json({ success: true, userChallenge });
  } catch (error) {
    console.error("Challenge completion error:", error);
    return NextResponse.json({ error: "Topshiriqni belgilashda xatolik" }, { status: 500 });
  }
}
