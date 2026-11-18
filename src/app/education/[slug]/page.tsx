import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Award,
} from "lucide-react";

const FALLBACK_COURSE_MAP: Record<string, any> = {
  "ekologiya-asoslari": {
    id: "c1",
    slug: "ekologiya-asoslari",
    titleUz: "Ekologiya asoslari va Tabiat muvozanati",
    descUz: "Biosfera, biogeokimyoviy sikllar, oziq zanjirlari va insoniyatning atrof-muhitga ta'siri haqida fundamental bilimlar.",
    level: "Boshlang'ich",
    duration: "2 soat",
    category: "Ekologiya",
    lessons: [
      {
        id: "l1",
        titleUz: "Biosfera va uning tarkibiy qismlari",
        durationMinutes: 20,
        contentUz: `# 1-dars: Biosfera va uning tarkibiy qismlari\n\nBiosfera — Yer sayyorasining tirik organizmlar yashaydigan va ular faoliyati bilan o'zgargan qobig'idir. Bu atamani birinchi marta 1875-yilda avstriyalik geolog Eduard Zyuss fanga kiritgan bo'lsa-da, uning hozirgi zamonaviy ta'limotini Vladimir Vernadskiy yaratgan.\n\n## Biosferaning asosiy chegaralari:\n1. **Litosfera (yer qobig'i)**: Chuqurligi 3-4 km gacha bo'lgan chuqurliklarda bakteriyalar uchraydi.\n2. **Gidrosfera (suv havzalari)**: Dunyo okeanining eng chuqur botig'i (Mariana botig'i, 11 022 m) gacha hayot mavjud.\n3. **Atmosfera (havo qobig'i)**: 20-25 km balandlikdagi ozon qatlamigacha tirik organizmlarning sporalari va bakteriyalar yetib boradi.`,
      },
      {
        id: "l2",
        titleUz: "Biologik xilma-xillik va ekotizim xizmatlari",
        durationMinutes: 25,
        contentUz: `# 2-dars: Biologik xilma-xillik va ekotizim xizmatlari\n\nBiologik xilma-xillik — Yer yuzidagi barcha tirik mavjudotlarning xilma-xilligi, jumladan genetik, tur va ekotizimlar rang-barangligidir.\n\nEkotizimlar bizga toza ichimlik suvi, toza havo, oziq-ovqat va iqlim muvozanatini beradi.`,
      },
    ],
    quizzes: [{ id: "q1", titleUz: "Ekologiya asoslari bo'yicha yakuniy sinov", passingScore: 70 }],
  },
  "yashil-iqtisodiyot": {
    id: "c2",
    slug: "yashil-iqtisodiyot",
    titleUz: "Yashil Iqtisodiyot va Sirkulyar Modellar",
    descUz: "Chiziqli iqtisodiyotdan sirkulyar tizimlarga o'tish, ESG standartlari, uglerod bozori va yashil investitsiyalar.",
    level: "O'rta",
    duration: "3 soat",
    category: "Iqtisodiyot",
    lessons: [
      {
        id: "l3",
        titleUz: "Sirkulyar (aylanma) iqtisodiyot tamoyillari",
        durationMinutes: 25,
        contentUz: `# Sirkulyar iqtisodiyot: "Ishlat — tashla" dan "Qayta yarat" ga\n\nAn'anaviy chiziqli iqtisodiyot "Olish — Ishlab chiqarish — Chiqitga chiqarish" (Take - Make - Dispose) modeliga tayanadi.\n\nSirkulyar iqtisodiyot esa chiqindilarni nollashtirib, materiallarni doimiy aylanmada saqlashga xizmat qiladi.`,
      },
    ],
    quizzes: [{ id: "q2", titleUz: "Yashil iqtisodiyot va ESG bilimlari sinovi", passingScore: 70 }],
  },
  "ai-va-ekologiya": {
    id: "c3",
    slug: "ai-va-ekologiya",
    titleUz: "Sun'iy Intellekt va Ekologik Tizimlar",
    descUz: "Kompyuter ko'rish orqali o'rmonlar monitoringi, sun'iy yo'ldosh tahlili, aqlli gridlar va resurslarni optimallashtirish.",
    level: "Ilg'or",
    duration: "2.5 soat",
    category: "Texnologiya",
    lessons: [
      {
        id: "l4",
        titleUz: "Sun'iy intellekt orqali atrof-muhit monitoringi",
        durationMinutes: 25,
        contentUz: `# AI qanday qilib sayyoramizni asrab qolishda yordam bermoqda?\n\nSun'iy intellekt sun'iy yo'ldosh tasvirlarini tahlil qilib, cho'llanish va o'rmonlar qisqarishini real vaqt rejimida aniqlaydi.`,
      },
    ],
    quizzes: [{ id: "q3", titleUz: "AI va ekologiya bo'yicha amaliy test", passingScore: 70 }],
  },
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let session = null;
  try {
    session = await getSession();
  } catch {}

  let course = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { order: "asc" } },
        quizzes: {
          include: {
            questions: { select: { id: true } },
          },
        },
      },
    });
  } catch (err) {
    console.warn("DB course error, checking fallback:", err);
  }

  if (!course) {
    course = FALLBACK_COURSE_MAP[slug] || null;
  }

  if (!course) {
    notFound();
  }

  let completedLessonIds: string[] = ["l1"];
  if (session) {
    try {
      const progress = await prisma.userProgress.findMany({
        where: {
          userId: session.id,
          lesson: { courseId: course.id },
        },
        select: { lessonId: true },
      });
      if (progress.length > 0) {
        completedLessonIds = progress.map((p) => p.lessonId);
      }
    } catch {}
  }

  const primaryQuiz = course.quizzes?.[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top breadcrumb */}
      <div>
        <Link
          href="/education"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Barcha kurslarga qaytish</span>
        </Link>
      </div>

      {/* Course Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            {course.category}
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-800">
            {course.level}
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {course.titleUz}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {course.descUz}
        </p>

        {primaryQuiz && (
          <div className="pt-2 flex items-center gap-3">
            <Link
              href={`/education/${course.slug}/quiz`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Interaktiv Sinov Testini Boshlash (+80 XP)</span>
            </Link>
          </div>
        )}
      </div>

      {/* Curriculum Lessons List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span>O&apos;quv Darslari Rejasi ({course.lessons?.length || 0} ta dars)</span>
        </h2>

        <div className="space-y-4">
          {course.lessons?.map((lesson: any, idx: number) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-emerald-400">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {lesson.titleUz}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-mono">
                      {lesson.durationMinutes} daqiqa
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>O&apos;qildi</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-xs text-slate-300 leading-relaxed font-sans prose-invert">
                  {lesson.contentUz}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {primaryQuiz && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 text-center space-y-3">
          <Award className="h-8 w-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            Barcha darslarni o&apos;rganib bo&apos;ldingizmi?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Kurs bo&apos;yicha yakuniy testni topshiring va 80 XP hamda nishonlarni qo&apos;lga kiriting.
          </p>
          <div className="pt-1">
            <Link
              href={`/education/${course.slug}/quiz`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <span>{primaryQuiz.titleUz} ni boshlash</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
