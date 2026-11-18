"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckSquare,
  CheckCircle,
  Zap,
  Droplets,
  Trash2,
  Bike,
  Award,
  Sparkles,
  Calendar,
  Lock,
} from "lucide-react";

interface Challenge {
  id: string;
  titleUz: string;
  descUz: string;
  points: number;
  category: string;
  icon: string;
}

export function ChallengesClient({
  initialChallenges,
  initialCompleted,
  isAuthenticated,
}: {
  initialChallenges: Challenge[];
  initialCompleted: Record<string, boolean>;
  isAuthenticated: boolean;
}) {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(initialCompleted);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const totalPoints = initialChallenges.reduce((sum, c) => sum + c.points, 0);
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPercent = Math.round(
    (completedCount / Math.max(1, initialChallenges.length)) * 100
  );

  const handleComplete = async (challengeId: string) => {
    if (!isAuthenticated || completedMap[challengeId] || loadingId) return;
    setLoadingId(challengeId);

    try {
      const res = await fetch("/api/challenges/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });

      if (res.ok) {
        setCompletedMap((prev) => ({ ...prev, [challengeId]: true }));
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy":
        return Zap;
      case "water":
        return Droplets;
      case "waste":
        return Trash2;
      case "transport":
        return Bike;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-2">
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Weekly Behavioral Eco Habits</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Haftalik Eko-Topshiriqlar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Kichik kundalik odatlar — butun sayyora uchun ulkan ijobiy o&apos;zgarishlar. Topshiriqlarni bajaring, yangi nishonlar oching va eko-ta&apos;sir ballingizni oshiring!
        </p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-white">Ushbu Hafta Progressi:</span>
            <span className="text-emerald-400 font-bold">
              {completedCount} / {initialChallenges.length} ta bajarildi
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Maksimal yutuq: <strong className="text-white">{totalPoints} XP</strong></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-md shadow-emerald-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!isAuthenticated && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Topshiriqlarni belgilash va XP olish uchun profilingizga kiring.</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-amber-500 px-3 py-1 font-bold text-slate-950 hover:bg-amber-400"
          >
            Kirish
          </Link>
        </div>
      )}

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {initialChallenges.map((ch) => {
          const isDone = Boolean(completedMap[ch.id]);
          const Icon = getCategoryIcon(ch.category);

          return (
            <div
              key={ch.id}
              className={`glass-card rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                isDone
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isDone
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : "bg-slate-900 text-emerald-400 border-slate-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-slate-800">
                    +{ch.points} XP
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {ch.titleUz}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {ch.descUz}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Haftalik Missiya
                </span>

                <button
                  onClick={() => handleComplete(ch.id)}
                  disabled={isDone || !isAuthenticated || loadingId === ch.id}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{isDone ? "Bajarildi ✓" : "Topshiriqni bajardim"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
