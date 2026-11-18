"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Leaf, Heart, ShieldCheck, Cpu } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                ECOGEN <span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.slogan}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-400/90">
                AI tizimi faol va monitoring rejimida
              </span>
            </div>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Yo&apos;nalishlar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/economy" className="hover:text-emerald-400 transition-colors">
                  {t.pillars.greenEconomy.title}
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-emerald-400 transition-colors">
                  {t.pillars.ai.title}
                </Link>
              </li>
              <li>
                <Link href="/climate" className="hover:text-emerald-400 transition-colors">
                  {t.pillars.climate.title}
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-emerald-400 transition-colors">
                  {t.pillars.education.title}
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Interaktiv Modullar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/economy#calculator" className="hover:text-emerald-400 transition-colors">
                  Ekologik Kalkulyator
                </Link>
              </li>
              <li>
                <Link href="/climate#map" className="hover:text-emerald-400 transition-colors">
                  O&apos;zbekiston Eko-Xaritasi
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                  Innovatsion Startaplar
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-emerald-400 transition-colors">
                  Haftalik Eko-Topshiriqlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Xalqaro Standartlar
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>ESG & UN SDGs Muvozanati</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>Next-Gen AI & GIS Telemetriya</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 ECOGEN AI. {t.footer.allRights}</p>
          <p className="flex items-center gap-1">
            <span>Barqaror kelajak uchun mehr bilan yaratilgan</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
