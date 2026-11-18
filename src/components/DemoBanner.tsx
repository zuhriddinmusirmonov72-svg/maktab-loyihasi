"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Shield, User, X, Check } from "lucide-react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const router = useRouter();

  if (dismissed) return null;

  const handleLogin = async (role: "user" | "admin") => {
    setActiveRole(role);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        router.refresh();
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setActiveRole(null), 1000);
    }
  };

  return (
    <div className="relative isolate z-40 flex items-center justify-between gap-x-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-900 px-4 py-2 sm:px-6 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
          <PlayCircle className="h-4 w-4 animate-pulse" />
          <span>Musobaqa Taqdimot Rejimi (Demo Mode):</span>
        </div>
        <span className="text-slate-300 hidden md:inline">
          Hakamlar va mehmonlar uchun tayyorlangan sinov hisoblariga 1 ta tugma bilan kiring:
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleLogin("user")}
          disabled={activeRole !== null}
          className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all cursor-pointer"
        >
          {activeRole === "user" ? <Check className="h-3 w-3 text-emerald-400" /> : <User className="h-3 w-3" />}
          <span>Talaba (Jasur)</span>
        </button>

        <button
          onClick={() => handleLogin("admin")}
          disabled={activeRole !== null}
          className="flex items-center gap-1 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-all cursor-pointer"
        >
          {activeRole === "admin" ? <Check className="h-3 w-3 text-amber-400" /> : <Shield className="h-3 w-3" />}
          <span>Boshqaruvchi (Admin)</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-slate-400 hover:text-white"
          title="Yopish"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
