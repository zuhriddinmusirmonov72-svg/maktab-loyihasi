"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Award,
  Zap,
  BookOpen,
  FolderKanban,
  Printer,
  Sparkles,
  TreePine,
  CheckCircle2,
  TrendingDown,
  Calendar,
  FileText,
} from "lucide-react";

interface Badge {
  id: string;
  code: string;
  titleUz: string;
  descUz: string;
  icon: string;
}

interface Calculation {
  id: string;
  electricityKwh: number;
  waterM3: number;
  transportKm: number;
  co2Kg: number;
  treeOffset: number;
  savingsUzs: number;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  votes: number;
  status: string;
  createdAt: string;
}

interface QuizResult {
  id: string;
  score: number;
  passed: boolean;
  createdAt: string;
  quiz: { titleUz: string };
}

interface Activity {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

export function DashboardClient({
  user,
  badges,
  calculations,
  projects,
  quizResults,
  activities,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    level: number;
    xp: number;
    ecoScore: number;
    createdAt: string;
  };
  badges: Badge[];
  calculations: Calculation[];
  projects: Project[];
  quizResults: QuizResult[];
  activities: Activity[];
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "calculations" | "projects" | "quizzes">("overview");

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Profile Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-slate-950 text-2xl font-black shadow-xl shadow-emerald-500/20">
              {user.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 border-2 border-slate-950">
              {user.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {user.name}
              </h1>
              {user.role === "ADMIN" && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              A&apos;zolik sanasi: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Pills & Print Report CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 font-medium">To&apos;plangan XP</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{user.xp}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 font-medium">Eco Score</div>
            <div className="text-lg font-black text-teal-400 font-mono">{user.ecoScore} / 100</div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 font-medium">Nishonlar</div>
            <div className="text-lg font-black text-amber-400 font-mono">{badges.length}</div>
          </div>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            title="Eko Hisobotni PDF yoki qog'ozga chop etish"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Eko Hisobotni Chop Etish (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "overview"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Umumiy Ko&apos;rinish
        </button>
        <button
          onClick={() => setActiveTab("calculations")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "calculations"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Hisob-kitoblar ({calculations.length})
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "projects"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Mening Loyihalarim ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "quizzes"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Test Natijalari ({quizResults.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Badges & Summary */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges Shelf */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Qo&apos;lga Kiritilgan Nishonlar ({badges.length} ta)</span>
                </h3>
              </div>

              {badges.length === 0 ? (
                <p className="text-xs text-slate-500">Hozircha nishonlar yo&apos;q. Kurslarni o&apos;qib, nishonlar oling!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl bg-slate-900/80 p-3 border border-emerald-500/20 flex items-start gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{b.titleUz}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                          {b.descUz}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Calculations Snapshot */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>So&apos;nggi Uglerod Izi Hisoboti</span>
                </h3>
                <Link href="/economy" className="text-xs text-emerald-400 hover:underline">
                  Yangi hisoblash
                </Link>
              </div>

              {calculations.length === 0 ? (
                <p className="text-xs text-slate-500">Hisob-kitoblar mavjud emas.</p>
              ) : (
                <div className="space-y-2">
                  {calculations.slice(0, 2).map((calc) => (
                    <div
                      key={calc.id}
                      className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">
                          {calc.co2Kg} kg CO₂ / oy
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {calc.electricityKwh} kVt⋅soat | {calc.transportKm} km | {calc.waterM3} m³
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">
                          {calc.treeOffset} tup daraxt
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(calc.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Activity Feed */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calendar className="h-4 w-4 text-teal-400" />
              <span>Ekologik Faollik Tarixi</span>
            </h3>

            {activities.length === 0 ? (
              <p className="text-xs text-slate-500">Hozircha faollik yozuvlari yo&apos;q.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-slate-200">{act.details || act.action}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATIONS */}
      {activeTab === "calculations" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Barcha Shaxsiy Hisob-Kitoblar</h2>
          {calculations.length === 0 ? (
            <p className="text-xs text-slate-400">Hozircha hisob-kitoblar yo&apos;q.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-2">Sana</th>
                    <th>Elektr (kVt)</th>
                    <th>Suv (m³)</th>
                    <th>Masofa (km)</th>
                    <th>CO₂ (kg)</th>
                    <th>Daraxtlar</th>
                    <th>Tejash (so&apos;m)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {calculations.map((c) => (
                    <tr key={c.id} className="text-slate-300">
                      <td className="py-2.5 font-mono text-[11px] text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td>{c.electricityKwh}</td>
                      <td>{c.waterM3}</td>
                      <td>{c.transportKm}</td>
                      <td className="font-bold text-emerald-400">{c.co2Kg}</td>
                      <td className="text-teal-400 font-semibold">{c.treeOffset}</td>
                      <td className="font-mono text-emerald-300">{(c.savingsUzs).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === "projects" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white">Sizning Loyihalaringiz</h2>
            <Link
              href="/projects"
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              Yangi Loyiha Qo&apos;shish
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-xs text-slate-400">Hozircha hech qanday loyiha qo&apos;shmadingiz.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{p.title}</span>
                    <span className="text-emerald-400 font-bold">{p.votes} ovoz</span>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {p.category}
                  </span>
                  <div className="text-[10px] text-slate-500">
                    Holati: <strong className="text-emerald-400">{p.status}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === "quizzes" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Topshirilgan Testlar</h2>
          {quizResults.length === 0 ? (
            <p className="text-xs text-slate-400">Hozircha test topshirmadingiz.</p>
          ) : (
            <div className="space-y-2">
              {quizResults.map((qr) => (
                <div
                  key={qr.id}
                  className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{qr.quiz.titleUz}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(qr.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        qr.passed ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {qr.score}% ({qr.passed ? "Muvaffaqiyatli" : "O'tmadi"})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
