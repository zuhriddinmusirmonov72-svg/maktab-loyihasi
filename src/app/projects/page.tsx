"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  FolderKanban,
  ThumbsUp,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  ExternalLink,
  X,
  Loader2,
  TreePine,
  Sun,
  Droplets,
  Recycle,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  category: string;
  imageUrl: string | null;
  authorName: string;
  votes: number;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const { lang, t } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const [newCategory, setNewCategory] = useState("Quyosh energiyasi");
  const [newImageUrl, setNewImageUrl] = useState("");

  const fetchProjects = async () => {
    try {
      const url = new URL("/api/projects", window.location.origin);
      if (selectedCategory !== "all") url.searchParams.set("category", selectedCategory);
      if (searchQuery) url.searchParams.set("q", searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleVote = async (id: string) => {
    if (votedIds[id]) return;
    try {
      const res = await fetch(`/api/projects/${id}/vote`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setVotedIds((prev) => ({ ...prev, [id]: true }));
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, votes: data.votes } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          problem: newProblem,
          solution: newSolution,
          category: newCategory,
          imageUrl: newImageUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Loyihani saqlashda xatolik");
      }

      setFormSuccess(true);
      fetchProjects();
      setTimeout(() => {
        setModalOpen(false);
        setFormSuccess(false);
        setNewTitle("");
        setNewDescription("");
        setNewProblem("");
        setNewSolution("");
        setNewImageUrl("");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-2">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>Community Climate Tech & Grassroots Innovation</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Ekologik Loyihalar Hamjamiyati
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Yosh olimlar, ekologlar va startapchilar tomonidan ilgari surilgan yashil tashabbuslar. Ovoz bering yoki o&apos;z g&apos;oyangizni e&apos;lon qiling!
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Loyiha Qo&apos;shish (+50 XP)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Loyihalarni qidirish... (masalan: saksovul, datchik, quyosh)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none w-full sm:w-auto"
          >
            <option value="all">Barcha yo&apos;nalishlar</option>
            <option value="Quyosh energiyasi">Quyosh energiyasi</option>
            <option value="Suvni tejash">Suvni tejash</option>
            <option value="Qayta ishlash">Qayta ishlash</option>
            <option value="Iqlim va O'rmonlar">Iqlim va O&apos;rmonlar</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
          <FolderKanban className="h-8 w-8 mx-auto text-slate-600" />
          <p>Ushbu qidiruv bo&apos;yicha loyihalar topilmadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const hasVoted = Boolean(votedIds[p.id]);
            return (
              <div
                key={p.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 transition-all hover:border-emerald-500/30"
              >
                {/* Project Image */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={p.imageUrl || "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80"}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {p.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div>
                        <span className="font-bold text-rose-400">Muammo: </span>
                        <span className="text-slate-400">{p.problem}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-400">Yechim: </span>
                        <span className="text-slate-300">{p.solution}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Voting */}
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Muallif: <strong className="text-slate-300">{p.authorName}</strong>
                    </span>

                    <button
                      onClick={() => handleVote(p.id)}
                      disabled={hasVoted}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-xs transition-all ${
                        hasVoted
                          ? "bg-emerald-500 text-slate-950 cursor-default"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{p.votes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-lg font-black text-white">
                Yangi Ekologik Loyihani Ta&apos;sis Etish
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                G&apos;oyangizni batafsil tasvirlang va hamjamiyatdan qo&apos;llab-quvvatlash oling.
              </p>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center text-emerald-400 font-bold text-sm space-y-2">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-400" />
                <p>Loyihangiz muvaffaqiyatli qabul qilindi va platformada e&apos;lon qilindi!</p>
                <p className="text-xs text-slate-400">+50 XP profilingizga qo&apos;shildi.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Loyiha Nomi:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Farg'ona vodiysi uchun aqlli biokompost"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Yo&apos;nalish:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Quyosh energiyasi">Quyosh energiyasi</option>
                      <option value="Suvni tejash">Suvni tejash</option>
                      <option value="Qayta ishlash">Qayta ishlash</option>
                      <option value="Iqlim va O'rmonlar">Iqlim va O&apos;rmonlar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Rasm Havolasi (URL):
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Qisqacha Tavsif:
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Loyiha haqida 2-3 jumlada umumiy tushuncha..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-rose-400 font-semibold mb-1">
                    Mavjud Muammo:
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Qanday ekologik muammo hal qilinmoqda?"
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">
                    Taklif Qilinayotgan Innovatsion Yechim:
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Siz taklif etayotgan amaliy texnologik yechim..."
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                {formError && (
                  <div className="text-rose-400 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-800 px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-40"
                  >
                    {submitting ? "Saqlanmoqda..." : "E'lon qilish"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
