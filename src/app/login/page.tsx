"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Leaf, Lock, Mail, ArrowRight, PlayCircle, Shield, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo kirishda xatolik");
      }

      router.push(role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
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
            {t.auth.loginSubtitle}
          </p>
        </div>

        {/* Demo Quick Access Box */}
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <PlayCircle className="h-4 w-4" />
            <span>Hakamlar uchun Tezkor Demo Kirish:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin("user")}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 py-2 text-[11px] font-bold text-emerald-300 transition-all cursor-pointer"
            >
              <User className="h-3.5 w-3.5" />
              <span>Talaba (Jasur)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 py-2 text-[11px] font-bold text-amber-300 transition-all cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Boshqaruvchi</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t.auth.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
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
            className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>{t.auth.loginAction}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
          <span>{t.auth.noAccount} </span>
          <Link href="/register" className="text-emerald-400 font-bold hover:underline">
            {t.auth.registerAction}
          </Link>
        </div>
      </div>
    </div>
  );
}
