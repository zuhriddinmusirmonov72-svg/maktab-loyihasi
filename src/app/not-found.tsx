import React from "react";
import Link from "next/link";
import { Leaf, ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Leaf className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Xatolik 404
          </span>
          <h1 className="text-2xl font-black text-white">
            Sahifa Topilmadi
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Siz qidirayotgan sahifa ko&apos;chirilgan, nomi o&apos;zgartirilgan yoki vaqtincha mavjud emas.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Bosh Sahifa</span>
          </Link>
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>AI Yordamchi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
