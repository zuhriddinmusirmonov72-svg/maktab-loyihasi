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

const FALLBACK_COURSES = [
  {
    id: "c1",
    slug: "ekologiya-asoslari",
    titleUz: "Ekologiya asoslari va Tabiat muvozanati",
    descUz: "Biosfera, biogeokimyoviy sikllar, oziq zanjirlari va insoniyatning atrof-muhitga ta'siri haqida fundamental bilimlar.",
    level: "Boshlang'ich",
    duration: "2 soat",
    category: "Ekologiya",
    icon: "Leaf",
    lessons: [{ id: "l1" }, { id: "l2" }, { id: "l3" }],
    quizzes: [{ id: "q1", passingScore: 70 }],
  },
  {
    id: "c2",
    slug: "yashil-iqtisodiyot",
    titleUz: "Yashil Iqtisodiyot va Sirkulyar Modellar",
    descUz: "Chiziqli iqtisodiyotdan sirkulyar tizimlarga o'tish, ESG standartlari, uglerod bozori va yashil investitsiyalar.",
    level: "O'rta",
    duration: "3 soat",
    category: "Iqtisodiyot",
    icon: "TrendingUp",
    lessons: [{ id: "l4" }, { id: "l5" }],
    quizzes: [{ id: "q2", passingScore: 70 }],
  },
  {
    id: "c3",
    slug: "ai-va-ekologiya",
    titleUz: "Sun'iy Intellekt va Ekologik Tizimlar",
    descUz: "Kompyuter ko'rish orqali o'rmonlar monitoringi, sun'iy yo'ldosh tahlili, aqlli gridlar va resurslarni optimallashtirish.",
    level: "Ilg'or",
    duration: "2.5 soat",
    category: "Texnologiya",
    icon: "Cpu",
    lessons: [{ id: "l6" }],
    quizzes: [{ id: "q3", passingScore: 70 }],
  },
  {
    id: "c4",
    slug: "iqlim-ozgarishi-va-markaziy-osiyo",
    titleUz: "Iqlim O'zgarishi va Orol Dengizi Fojiasi",
    descUz: "Orolqum cho'li, chang bo'ronlari, Markaziy Osiyoda muzliklarning erishi va hududiy moslashuv strategiyalari.",
    level: "Boshlang'ich",
    duration: "2 soat",
    category: "Iqlim",
    icon: "Sun",
    lessons: [{ id: "l7" }],
    quizzes: [{ id: "q4", passingScore: 70 }],
  },
  {
    id: "c5",
    slug: "qayta-tiklanuvchi-energiya",
    titleUz: "Qayta Tiklanuvchi Energiya Tizimlari",
    descUz: "Quyosh fotoelektr stansiyalari, shamol turbinalari, yashil vodorod va energiyani saqlash tizimlari (BESS).",
    level: "O'rta",
    duration: "3 soat",
    category: "Energetika",
    icon: "Zap",
    lessons: [{ id: "l8" }],
    quizzes: [{ id: "q5", passingScore: 70 }],
  },
  {
    id: "c6",
    slug: "ekologik-innovatsiyalar",
    titleUz: "Ekologik Innovatsiyalar va Startaplar",
    descUz: "Bioplastiklar, chiqindisiz ishlab chiqarish (Zero Waste), aqlli shahar texnologiyalari va yashil arxitektura.",
    level: "Ilg'or",
    duration: "2 soat",
    category: "Innovatsiya",
    icon: "Sparkles",
    lessons: [{ id: "l9" }],
    quizzes: [{ id: "q6", passingScore: 70 }],
  },
];

const FALLBACK_LEADERBOARD = [
  { id: "u1", name: "Madina Aliyeva", level: 5, xp: 520, ecoScore: 94, _count: { badges: 3 } },
  { id: "u2", name: "Jasur Rahmatov (Demo)", level: 4, xp: 380, ecoScore: 88, _count: { badges: 3 } },
  { id: "u3", name: "Azamat Nurmatov", level: 3, xp: 290, ecoScore: 82, _count: { badges: 2 } },
  { id: "u4", name: "Gulnoza Karimova", level: 2, xp: 180, ecoScore: 79, _count: { badges: 1 } },
];

const FALLBACK_BADGES = [
  { id: "b1", code: "eco-beginner", titleUz: "Eco Boshlang'ich", descUz: "Birinchi ekologik topshiriqni bajarganlik uchun" },
  { id: "b2", code: "green-thinker", titleUz: "Yashil Tafakkur", descUz: "Yashil iqtisodiyot kursini o'qib, hisob-kitob qilganlik uchun" },
  { id: "b3", code: "climate-expert", titleUz: "Iqlim Eksperti", descUz: "Iqlim testlarini 85%+ ballga topshirganlik uchun" },
  { id: "b4", code: "ai-explorer", titleUz: "AI Tadqiqotchi", descUz: "AI Yordamchi bilan 5 martadan ko'p maslahatlashganlik uchun" },
  { id: "b5", code: "eco-champion", titleUz: "Eco Chempion", descUz: "500+ XP to'plagan lider foydalanuvchi" },
];

async function getEducationData() {
  try {
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

    return {
      courses: courses.length > 0 ? courses : FALLBACK_COURSES,
      leaderboard: leaderboard.length > 0 ? leaderboard : FALLBACK_LEADERBOARD,
      badges: badges.length > 0 ? badges : FALLBACK_BADGES,
    };
  } catch (err) {
    console.warn("DB error in education page, using reliable fallback:", err);
    return {
      courses: FALLBACK_COURSES,
      leaderboard: FALLBACK_LEADERBOARD,
      badges: FALLBACK_BADGES,
    };
  }
}

export default async function EducationPage() {
  const { courses, leaderboard, badges } = await getEducationData();
  let session = null;
  try {
    session = await getSession();
  } catch {}

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
