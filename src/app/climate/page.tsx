"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  CLIMATE_TIME_SERIES,
  UZBEKISTAN_REGIONS_DATA,
  RegionEcoData,
} from "@/lib/climate-data";
import {
  Globe,
  Sun,
  Droplets,
  Wind,
  Layers,
  Thermometer,
  TreePine,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function ClimatePage() {
  const { lang, t } = useLanguage();

  const [selectedRegion, setSelectedRegion] = useState<RegionEcoData>(
    UZBEKISTAN_REGIONS_DATA[0] // Karakalpakstan (Aral Sea) default
  );

  const [activeMetric, setActiveMetric] = useState<"temp" | "co2" | "aral" | "renewables">("temp");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-2">
          <Globe className="h-3.5 w-3.5" />
          <span>Climate Science & Regional GIS Telemetry</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Iqlim O&apos;zgarishi va Markaziy Osiyo Ekotizimlari
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          NASA, WMO va O&apos;zgidromet ilmiy ma&apos;lumotlari asosida global isish, Orol dengizi dinamikasi va O&apos;zbekistonning hududiy ekologik salohiyati.
        </p>
      </div>

      {/* 1. CLIMATE DASHBOARD WITH TIME SERIES CHARTS */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-cyan-400" />
              <span>{t.climate.dashboardTitle}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t.climate.dashboardSubtitle}
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveMetric("temp")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeMetric === "temp"
                  ? "bg-rose-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Harorat Anomaliyasi (°C)
            </button>
            <button
              onClick={() => setActiveMetric("co2")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeMetric === "co2"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              CO₂ Konsentratsiyasi (ppm)
            </button>
            <button
              onClick={() => setActiveMetric("aral")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeMetric === "aral"
                  ? "bg-blue-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Orol Suv Sathi (km²)
            </button>
            <button
              onClick={() => setActiveMetric("renewables")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeMetric === "renewables"
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Qayta Tiklanuvchi Energiya (GW)
            </button>
          </div>
        </div>

        {/* Main Chart Box */}
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">
              Tarixiy dinamika: 1960 — 2026 yillar
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">
              Manba: NASA GISTEMP / NOAA Mauna Loa / O&apos;zgidromet
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === "temp" ? (
                <AreaChart data={CLIMATE_TIME_SERIES}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 1.6]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tempAnomaly"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGrad)"
                    name="Global Isish Anomaliyasi (°C)"
                  />
                </AreaChart>
              ) : activeMetric === "co2" ? (
                <LineChart data={CLIMATE_TIME_SERIES}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[300, 450]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2Ppm"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    name="CO₂ darajasi (ppm)"
                    dot={{ r: 4, fill: "#f59e0b" }}
                  />
                </LineChart>
              ) : activeMetric === "aral" ? (
                <AreaChart data={CLIMATE_TIME_SERIES}>
                  <defs>
                    <linearGradient id="aralGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aralWaterSurfaceKm2"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#aralGrad)"
                    name="Orol dengizi maydoni (km²)"
                  />
                </AreaChart>
              ) : (
                <AreaChart data={CLIMATE_TIME_SERIES}>
                  <defs>
                    <linearGradient id="reGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uzbekRenewableGw"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#reGrad)"
                    name="Qayta Tiklanuvchi Energiya Quvvati (GW)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 2. REGIONAL ECO MAP OF UZBEKISTAN */}
      <section id="map" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>{t.climate.mapTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.climate.mapSubtitle} (Viloyatni tanlang va batafsil ko&apos;rsatkichlarni ko&apos;ring)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Regions Grid / Map Canvas */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span>O&apos;zbekiston Respublikasi Viloyatlari:</span>
              <span className="text-emerald-400">14 ta ma&apos;muriy birlik</span>
            </div>

            {/* Visual Region Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {UZBEKISTAN_REGIONS_DATA.map((region) => {
                const isSelected = selectedRegion.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`rounded-xl p-3 text-left transition-all border ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      {lang === "ru" ? region.nameRu : lang === "en" ? region.nameEn : region.nameUz}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{region.solarPotentialKwh} kVt/m²</span>
                      <span
                        className={`font-semibold ${
                          region.waterStress === "O'ta yuqori"
                            ? "text-rose-400"
                            : region.waterStress === "Yuqori"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {region.waterStress}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Details Inspector */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Tanlangan Hudud
                </span>
                <h3 className="text-lg font-black text-white">
                  {lang === "ru" ? selectedRegion.nameRu : lang === "en" ? selectedRegion.nameEn : selectedRegion.nameUz}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Solar Radiation */}
              <div className="flex justify-between items-center rounded-xl bg-slate-900 p-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Quyosh Nurlanish Salohiyati:</span>
                </div>
                <span className="font-bold text-amber-400">
                  {selectedRegion.solarPotentialKwh} kVt⋅soat / m² / yil
                </span>
              </div>

              {/* Water Stress Level */}
              <div className="flex justify-between items-center rounded-xl bg-slate-900 p-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <span>Suv Resurslari Bosimi:</span>
                </div>
                <span
                  className={`font-bold ${
                    selectedRegion.waterStress === "O'ta yuqori"
                      ? "text-rose-400"
                      : selectedRegion.waterStress === "Yuqori"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {selectedRegion.waterStress}
                </span>
              </div>

              {/* Forest Coverage */}
              <div className="flex justify-between items-center rounded-xl bg-slate-900 p-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <TreePine className="h-4 w-4 text-emerald-400" />
                  <span>O&apos;rmon va Yashil Qoplamalar:</span>
                </div>
                <span className="font-bold text-emerald-400">
                  {selectedRegion.forestCoverPercent}%
                </span>
              </div>

              {/* Priority Project */}
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/20 p-3 space-y-1">
                <div className="text-[10px] font-bold uppercase text-emerald-400">
                  Ustuvor Ekologik Tashabbus:
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {lang === "ru"
                    ? selectedRegion.priorityProjectRu
                    : lang === "en"
                    ? selectedRegion.priorityProjectEn
                    : selectedRegion.priorityProjectUz}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLIMATE EDUCATION DEEP-DIVE */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            Iqlim Ilmi va Ta&apos;limiy Materiallar
          </h2>
          <p className="text-xs text-slate-400">
            Global jarayonlar va ularning Markaziy Osiyo mintaqasiga ko&apos;rsatayotgan bevosita oqibatlari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Thermometer className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Global Isish va Issiqxona Effekti
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yoqilg&apos;i yoqish natijasida atmosferada CO₂ 426 ppm ga yetdi. Bu sayyoramizda 3 million yildan buyon kuzatilmagan eng yuqori ko&apos;rsatkichdir.
            </p>
            <div className="text-[11px] text-rose-400 font-semibold pt-1">
              Natija: Harorat 1.35°C ga ko&apos;tarildi
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Droplets className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Tyanshan Muzliklari va Suv Inqirozi
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Markaziy Osiyodagi asosiy daryolar (Amudaryo va Sirdaryo) manbai bo&apos;lgan tog&apos; muzliklarining 30% dan ortig&apos;i erib bo&apos;ldi.
            </p>
            <div className="text-[11px] text-blue-400 font-semibold pt-1">
              Yechim: Tomchilatib sug&apos;orish va suv havzalari
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Wind className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Orolqum va Chang-Tuz Bo&apos;ronlari
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Qurigan dengiz tubidan ko&apos;tarilayotgan zaharli tuz changlari aholi salomatligiga jiddiy tahdid solmoqda. Saksovulzorlar fitobarer vazifasini bajaradi.
            </p>
            <div className="text-[11px] text-amber-400 font-semibold pt-1">
              Harakat: 2 mln gektarga saksovul ekish
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRACTICAL SOLUTIONS ACTION PLAN */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>{t.climate.solutionsTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.climate.solutionsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <TreePine className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">&quot;Yashil Makon&quot; umummilliy loyihasi</span>
              <p className="text-slate-400 text-[11px] mt-0.5">Har yili 200 million tup ko&apos;chat ekish orqali shaharlarda mikroiqlimni yumshatish.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sun className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Tomlarda Quyosh Stansiyalari</span>
              <p className="text-slate-400 text-[11px] mt-0.5">Xonadon va tadbirkorlik binolarida quyosh panellari o&apos;rnatish va tarmoqqa sotish.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Droplets className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Aqlli Tomchilatib Sug&apos;orish</span>
              <p className="text-slate-400 text-[11px] mt-0.5">Qishloq xo&apos;jaligida suv sarfini 50% tejab, hosildorlikni kafolatlash.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
