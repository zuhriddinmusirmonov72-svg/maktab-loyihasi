import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminClient } from "./AdminClient";


export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  if (session.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg py-20 px-4 text-center space-y-4">
        <div className="text-4xl">🚫</div>
        <h1 className="text-xl font-bold text-white">Kirish Cheklangan (403 Forbidden)</h1>
        <p className="text-xs text-slate-400">
          Ushbu sahifaga faqat ECOGEN AI tizim administratori (ADMIN) ruxsati bilan kirish mumkin.
        </p>
        <div className="pt-2">
          <form action="/api/auth/demo-login" method="POST">
            <input type="hidden" name="role" value="admin" />
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Demo Admin Sifatida Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fetch admin datasets
  const [users, projects, courses, stats] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
        xp: true,
        ecoScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      include: {
        lessons: true,
        quizzes: true,
      },
      orderBy: { order: "asc" },
    }),
    prisma.ecoCalculation.aggregate({
      _count: true,
      _sum: { co2Kg: true, savingsUzs: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <AdminClient
        initialUsers={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        initialProjects={projects.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
        initialCourses={courses}
        totalCalculations={stats._count}
        totalCo2Calculated={Math.round(stats._sum.co2Kg || 0)}
        totalSavingsUzs={Math.round(stats._sum.savingsUzs || 0)}
      />
    </div>
  );
}
