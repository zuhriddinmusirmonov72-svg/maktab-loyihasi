"use client";

import React, { useState } from "react";
import {
  Shield,
  Users,
  FolderKanban,
  BookOpen,
  BarChart3,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  ecoScore: number;
  createdAt: string;
}

interface ProjectItem {
  id: string;
  title: string;
  authorName: string;
  category: string;
  status: string;
  votes: number;
  createdAt: string;
}

interface CourseItem {
  id: string;
  slug: string;
  titleUz: string;
  category: string;
  lessons: { id: string }[];
  quizzes: { id: string }[];
}

export function AdminClient({
  initialUsers,
  initialProjects,
  initialCourses,
  totalCalculations,
  totalCo2Calculated,
  totalSavingsUzs,
}: {
  initialUsers: UserItem[];
  initialProjects: ProjectItem[];
  initialCourses: CourseItem[];
  totalCalculations: number;
  totalCo2Calculated: number;
  totalSavingsUzs: number;
}) {
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "projects" | "courses">("stats");

  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

  const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProjectStatus = async (projectId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, status }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, status } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Loyihani o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(`/api/admin/projects?projectId=${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>Control Center & Administration</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            ECOGEN Boshqaruv Paneli
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Foydalanuvchilar huquqlari, loyihalar moderatsiyasi va umumiy platforma telemetriyasi.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
        <button
          onClick={() => setActiveTab("stats")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "stats"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Statistika
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "users"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Foydalanuvchilar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "projects"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Loyihalar Moderatsiyasi ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "courses"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          O&apos;quv Rejasi ({initialCourses.length})
        </button>
      </div>

      {/* TAB 1: STATS */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <Users className="h-5 w-5 text-emerald-400 mb-2" />
            <div className="text-2xl font-black text-white">{users.length}</div>
            <div className="text-xs text-slate-400">Jami Ro&apos;yxatdan O&apos;tganlar</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <FolderKanban className="h-5 w-5 text-teal-400 mb-2" />
            <div className="text-2xl font-black text-white">{projects.length}</div>
            <div className="text-xs text-slate-400">Yuborilgan Eko-Loyihalar</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <BarChart3 className="h-5 w-5 text-cyan-400 mb-2" />
            <div className="text-2xl font-black text-white">{totalCalculations}</div>
            <div className="text-xs text-slate-400">Uglerod Izi Hisoblari</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <Zap className="h-5 w-5 text-amber-400 mb-2" />
            <div className="text-2xl font-black text-white">{totalCo2Calculated} kg</div>
            <div className="text-xs text-slate-400">Jami Tahlil Qilingan CO₂</div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS TABLE */}
      {activeTab === "users" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Foydalanuvchilar Ro&apos;yxati</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5">Foydalanuvchi</th>
                  <th>Rol</th>
                  <th>Daraja</th>
                  <th>XP</th>
                  <th>Score</th>
                  <th>Ro&apos;yxat sanasi</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="text-slate-300">
                    <td className="py-2.5">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>Lvl {u.level}</td>
                    <td className="font-mono text-emerald-400 font-bold">{u.xp}</td>
                    <td>{u.ecoScore}</td>
                    <td className="text-slate-500 text-[10px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() =>
                          handleRoleChange(
                            u.id,
                            u.role === "ADMIN" ? "USER" : "ADMIN"
                          )
                        }
                        className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                      >
                        {u.role === "ADMIN" ? "User qilish" : "Admin qilish"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="rounded-lg bg-rose-500/20 p-1 text-rose-400 hover:bg-rose-500/30"
                        title="O'chirish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS MODERATION */}
      {activeTab === "projects" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Loyihalar Moderatsiyasi</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5">Loyiha Nomi</th>
                  <th>Muallif</th>
                  <th>Yo&apos;nalish</th>
                  <th>Holati</th>
                  <th>Ovozlar</th>
                  <th className="text-right">Moderatsiya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="text-slate-300">
                    <td className="py-2.5 font-bold text-white max-w-[200px] truncate">
                      {p.title}
                    </td>
                    <td>{p.authorName}</td>
                    <td>{p.category}</td>
                    <td>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          p.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : p.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="font-bold text-emerald-400">{p.votes}</td>
                    <td className="text-right space-x-1.5">
                      {p.status !== "APPROVED" && (
                        <button
                          onClick={() => handleProjectStatus(p.id, "APPROVED")}
                          className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          Tasdiqlash
                        </button>
                      )}
                      {p.status !== "REJECTED" && (
                        <button
                          onClick={() => handleProjectStatus(p.id, "REJECTED")}
                          className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30"
                        >
                          Rad etish
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="rounded-lg bg-rose-500/20 p-1 text-rose-400 hover:bg-rose-500/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COURSES OVERVIEW */}
      {activeTab === "courses" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Akademiya O&apos;quv Rejasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialCourses.map((c) => (
              <div key={c.id} className="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{c.titleUz}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {c.category}
                  </span>
                </div>
                <div className="flex gap-4 text-slate-400 text-[11px]">
                  <span>{c.lessons.length} ta dars</span>
                  <span>{c.quizzes.length} ta test moduli</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
