"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Leaf, Lock, Mail, ArrowRight, Shield, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Admin hisobi oldindan yozilgan turadi
  const [email, setEmail] = useState("admin@ecogen.uz");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kirishda xatolik");
      }

      // Agar admin bo'lsa /admin ga, oddiy user bo'lsa /dashboard ga
      if (data.user?.role === "ADMIN" || email === "admin@ecogen.uz") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (selectedEmail: string, selectedPass: string) => {
    setEmail(selectedEmail);
    setPassword(selectedPass);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Leaf className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {t.auth.loginTitle}
          </h1>
          <p className="text-xs text-slate-400">
            Boshqaruvchi (Admin) ma&apos;lumotlari kiritilgan, faqat <strong>&quot;Kirish&quot;</strong> tugmasini bosing
          </p>
        </div>

        {/* Tezkor tanlash (Admin yoki Talaba) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleSelectAccount("admin@ecogen.uz", "admin123")}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 font-bold transition-all ${
              email === "admin@ecogen.uz"
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAccount("demo@ecogen.uz", "demo123")}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 font-bold transition-all ${
              email === "demo@ecogen.uz"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Talaba (Jasur)</span>
          </button>
        </div>

        {/* Asosiy Kirish Formasi */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Elektron pochta (Login):
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Parol:
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-2.5 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>Kirish</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
          <span>Hisobingiz yo&apos;qmi? </span>
          <Link href="/register" className="text-emerald-400 font-bold hover:underline">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </div>
    </div>
  );
}
