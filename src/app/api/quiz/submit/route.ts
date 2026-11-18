import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const QuizSubmitSchema = z.object({
  quizId: z.string(),
  userAnswers: z.record(z.string(), z.string()), // questionId -> answerId
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Test natijalarini saqlash uchun tizimga kiring" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = QuizSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Noto'g'ri test javoblari" }, { status: 400 });
    }

    const { quizId, userAnswers } = parsed.data;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Test topilmadi" }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const breakdown = [];

    for (const q of quiz.questions) {
      const selectedAnswerId = userAnswers[q.id];
      const correctAnswer = q.answers.find((a) => a.isCorrect);
      const isCorrect = selectedAnswerId === correctAnswer?.id;

      if (isCorrect) {
        correctCount += 1;
      }

      breakdown.push({
        questionId: q.id,
        questionUz: q.questionUz,
        questionRu: q.questionRu,
        questionEn: q.questionEn,
        selectedAnswerId,
        correctAnswerId: correctAnswer?.id,
        isCorrect,
        explanationUz: q.explanationUz,
        explanationRu: q.explanationRu,
        explanationEn: q.explanationEn,
      });
    }

    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
    const passed = scorePercentage >= quiz.passingScore;

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.id,
        quizId: quiz.id,
        score: scorePercentage,
        totalQuestions,
        correctAnswers: correctCount,
        passed,
      },
    });

    // Reward XP: 30 base + 50 if passed
    const xpGained = passed ? 80 : 30;
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        xp: { increment: xpGained },
        level: Math.floor((session.xp + xpGained) / 100) + 1,
      },
    });

    // Check for "climate-expert" badge if scored 85%+
    let newlyUnlockedBadge = null;
    if (scorePercentage >= 85) {
      const climateBadge = await prisma.badge.findUnique({
        where: { code: "climate-expert" },
      });
      if (climateBadge) {
        const existing = await prisma.userBadge.findUnique({
          where: {
            userId_badgeId: {
              userId: session.id,
              badgeId: climateBadge.id,
            },
          },
        });
        if (!existing) {
          await prisma.userBadge.create({
            data: {
              userId: session.id,
              badgeId: climateBadge.id,
            },
          });
          newlyUnlockedBadge = climateBadge;
        }
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "QUIZ_COMPLETED",
        details: `"${quiz.titleUz}" testidan ${scorePercentage}% ball oldi (${passed ? "O'tdi" : "O'tmadi"})`,
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        score: scorePercentage,
        totalQuestions,
        correctAnswers: correctCount,
        passed,
        xpGained,
        newLevel: updatedUser.level,
        newlyUnlockedBadge,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Testni tekshirishda xatolik" }, { status: 500 });
  }
}
