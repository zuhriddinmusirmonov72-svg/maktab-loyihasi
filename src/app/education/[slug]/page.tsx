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


export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const course = await prisma.course.findUnique({
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

  if (!course) {
    notFound();
  }

  // Get user's completed lessons for this course
  let completedLessonIds: string[] = [];
  if (session) {
    const progress = await prisma.userProgress.findMany({
      where: {
        userId: session.id,
        lesson: { courseId: course.id },
      },
      select: { lessonId: true },
    });
    completedLessonIds = progress.map((p) => p.lessonId);
  }

  const primaryQuiz = course.quizzes[0];

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
          <span>O&apos;quv Darslari Rejasi ({course.lessons.length} ta dars)</span>
        </h2>

        <div className="space-y-4">
          {course.lessons.map((lesson, idx) => {
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

      {/* Bottom Quiz CTA */}
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
