"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";

interface Answer {
  id: string;
  textUz: string;
  textRu: string;
  textEn: string;
}

interface Question {
  id: string;
  questionUz: string;
  questionRu: string;
  questionEn: string;
  explanationUz: string | null;
  points: number;
  answers: Answer[];
}

interface Quiz {
  id: string;
  titleUz: string;
  passingScore: number;
  questions: Question[];
}

interface QuizResultPayload {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  xpGained: number;
  newLevel: number;
  newlyUnlockedBadge: { titleUz: string } | null;
  breakdown: {
    questionId: string;
    questionUz: string;
    isCorrect: boolean;
    explanationUz: string | null;
  }[];
}

export function QuizClient({
  courseSlug,
  courseTitle,
  quiz,
}: {
  courseSlug: string;
  courseTitle: string;
  quiz: Quiz;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResultPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (result) return; // Prevent changing after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const allAnswered =
    quiz.questions.length > 0 &&
    quiz.questions.every((q) => Boolean(selectedAnswers[q.id]));

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          userAnswers: selectedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Natijalarni tekshirishda xatolik");
      }

      setResult(data.result);

      if (data.result.passed) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#059669", "#34d399", "#fbbf24"],
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <Link
            href={`/education/${courseSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kursga qaytish</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {quiz.titleUz}
          </h1>
          <p className="text-xs text-slate-400">
            {courseTitle} bo&apos;yicha yakuniy bilimlar sinovi
          </p>
        </div>

        <div className="text-right">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            O&apos;tish bali: {quiz.passingScore}%
          </span>
        </div>
      </div>

      {/* Result Card if submitted */}
      {result && (
        <div
          className={`glass-panel rounded-3xl p-6 sm:p-8 border text-center space-y-4 ${
            result.passed
              ? "border-emerald-500/50 bg-emerald-950/20"
              : "border-rose-500/50 bg-rose-950/20"
          }`}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 mx-auto">
            {result.passed ? (
              <Award className="h-8 w-8 text-emerald-400" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-400" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">
              {result.passed
                ? "Tabriklaymiz! Testdan muvaffaqiyatli o'tdingiz!"
                : "Afsuski, o'tish bali yetarli emas"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Siz {result.totalQuestions} ta savoldan {result.correctAnswers} tasiga to&apos;g&apos;ri javob berdingiz ({result.score}%).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-emerald-400 border border-slate-800">
              +{result.xpGained} XP qo&apos;shildi
            </span>
            <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-teal-400 border border-slate-800">
              Foydalanuvchi Darajasi: {result.newLevel}
            </span>
            {result.newlyUnlockedBadge && (
              <span className="rounded-xl bg-amber-500/20 px-3 py-1.5 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Yangi nishon: {result.newlyUnlockedBadge.titleUz}!</span>
              </span>
            )}
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Qaytadan urinish</span>
            </button>
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              <span>Keyingi kursga o&apos;tish</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => {
          const breakdownItem = result?.breakdown.find(
            (b) => b.questionId === q.id
          );

          return (
            <div
              key={q.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white pt-1">
                    {q.questionUz}
                  </h3>
                </div>

                {breakdownItem && (
                  <span
                    className={`flex items-center gap-1 text-xs font-bold shrink-0 ${
                      breakdownItem.isCorrect
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {breakdownItem.isCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>To&apos;g&apos;ri</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>Noto&apos;g&apos;ri</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.answers.map((answer) => {
                  const isSelected = selectedAnswers[q.id] === answer.id;
                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleSelectAnswer(q.id, answer.id)}
                      disabled={Boolean(result)}
                      className={`rounded-xl p-3 text-left text-xs transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500 text-white font-semibold"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {answer.textUz}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback after submit */}
              {breakdownItem && breakdownItem.explanationUz && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-400 text-[10px] uppercase">
                    Ilmiy tushuntirish:
                  </span>
                  <p className="leading-relaxed">{breakdownItem.explanationUz}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-xs text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      {!result && (
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>Natijani Tekshirish ({Object.keys(selectedAnswers).length}/{quiz.questions.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}
