import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  Trophy,
  Sparkles,
  Leaf,
  Brain,
  Globe,
  Sun,
  Zap,
} from "lucide-react";


async function getEducationData() {
  const [courses, leaderboard, badges] = await Promise.all([
    prisma.course.findMany({
      include: {
        lessons: { select: { id: true } },
        quizzes: { select: { id: true, passingScore: true } },
      },
      orderBy: { order: "asc" },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        xp: true,
        avatar: true,
        ecoScore: true,
        _count: { select: { badges: true } },
      },
      orderBy: { xp: "desc" },
      take: 10,
    }),
    prisma.badge.findMany(),
  ]);

  return { courses, leaderboard, badges };
}

export default async function EducationPage() {
  const { courses, leaderboard, badges } = await getEducationData();
  const session = await getSession();

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return Leaf;
      case "TrendingUp":
        return Globe;
      case "Cpu":
        return Brain;
      case "Sun":
        return Sun;
      case "Zap":
        return Zap;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 border border-green-500/20 mb-2">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Interactive Climate & Sustainability Academy</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Smart Ekologik Ta&apos;lim Akademiyasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Nazariyadan amaliyotga: ekologiya asoslari, AI, qayta tiklanuvchi energiya va sirkulyar biznes modellarini o&apos;rganing, testlar topshiring va nufuzli eko-sertifikatlar oling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Courses Curriculum */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <span>O&apos;quv Kurslari ({courses.length} ta yo&apos;nalish)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => {
              const Icon = getCourseIcon(course.icon);
              return (
                <div
                  key={course.id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-800 transition-all hover:border-emerald-500/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-800">
                        {course.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {course.titleUz}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {course.descUz}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{course.lessons.length} ta dars</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {course.level}
                    </span>
                    <Link
                      href={`/education/${course.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <span>Kursga kirish</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Leaderboard & Badges */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hall of Fame / Leaderboard */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">
                  Eng Faol Eko-Talabalar
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">TOP 10</span>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((user, idx) => {
                const isCurrentUser = session?.id === user.id;
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      isCurrentUser
                        ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${
                          idx === 0
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                            : idx === 1
                            ? "bg-slate-300 text-slate-950"
                            : idx === 2
                            ? "bg-amber-700 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold truncate max-w-[130px] sm:max-w-[150px]">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Daraja {user.level} • {user._count.badges} nishon
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">
                        {user.xp} XP
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Score: {user.ecoScore}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges showcase */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Yutuqlar (Gamification Badges)</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-900/80 p-2.5 border border-slate-800/80"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">{b.titleUz}</div>
                    <div className="text-[10px] text-slate-400">{b.descUz}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
