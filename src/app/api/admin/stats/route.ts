import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const [
      usersCount,
      projectsCount,
      lessonsCompletedCount,
      calculationsCount,
      quizzesPassedCount,
      co2Sum,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.ecoCalculation.count(),
      prisma.quizResult.count({ where: { passed: true } }),
      prisma.ecoCalculation.aggregate({ _sum: { co2Kg: true } }),
    ]);

    return NextResponse.json({
      usersCount,
      projectsCount,
      lessonsCompletedCount,
      calculationsCount,
      quizzesPassedCount,
      totalCo2Calculated: Math.round(co2Sum._sum.co2Kg || 0),
    });
  } catch {
    return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 403 });
  }
}
