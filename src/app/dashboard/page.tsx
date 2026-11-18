import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  User,
  Award,
  Zap,
  BookOpen,
  FolderKanban,
  FileText,
  Clock,
  Printer,
  Sparkles,
  TreePine,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { DashboardClient } from "./DashboardClient";


export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/dashboard");
  }

  // Fetch all user related data
  const [userData, userBadges, userCalculations, userProjects, quizResults, activities] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          level: true,
          xp: true,
          ecoScore: true,
          createdAt: true,
        },
      }),
      prisma.userBadge.findMany({
        where: { userId: session.id },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.ecoCalculation.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.project.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.quizResult.findMany({
        where: { userId: session.id },
        include: { quiz: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.activityLog.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  if (!userData) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <DashboardClient
        user={{
          ...userData,
          createdAt: userData.createdAt.toISOString(),
        }}
        badges={userBadges.map((ub) => ub.badge)}
        calculations={userCalculations.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        }))}
        projects={userProjects.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        }))}
        quizResults={quizResults.map((qr) => ({
          ...qr,
          createdAt: qr.createdAt.toISOString(),
        }))}
        activities={activities.map((a) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
