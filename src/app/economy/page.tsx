"use client";

import React, { useState, useTransition } from "react";
import { useLanguage } from "@/lib/language-context";
import { calculateEcoImpact } from "@/lib/eco-calculator";
import { GREEN_BUSINESS_IDEAS } from "@/lib/green-business-data";
import { EcoCalculationResult } from "@/lib/types";
import {
  Zap,
  Droplets,
  Car,
  Trash2,
  TreePine,
  DollarSign,
  TrendingDown,
  Info,
  ChevronRight,
  Filter,
  CheckCircle,
  Lightbulb,
  Building,
  Leaf,
  Award,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function GreenEconomyPage() {
  const { lang, t } = useLanguage();
  const [, startTransition] = useTransition();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"calculator" | "business" | "methodology">("calculator");

  // Calculator Form State
  const [electricityKwh, setElectricityKwh] = useState<number>(250);
  const [waterM3, setWaterM3] = useState<number>(14);
  const [transportKm, setTransportKm] = useState<number>(400);
  const [transportType, setTransportType] = useState<
    "petrol_car" | "diesel_car" | "hybrid" | "ev" | "bus" | "metro" | "bicycle"
  >("petrol_car");
  const [wasteKg, setWasteKg] = useState<number>(18);

  const [savingCalc, setSavingCalc] = useState(false);
  const [calcSavedNotice, setCalcSavedNotice] = useState(false);

  // Compute live calculation
  const [result, setResult] = useState<EcoCalculationResult>(() =>
    calculateEcoImpact({
      electricityKwh: 250,
      waterM3: 14,
      transportKm: 400,
      transportType: "petrol_car",
      wasteKg: 18,
    })
  );

  const handleRecalculate = () => {
    startTransition(() => {
      const computed = calculateEcoImpact({
        electricityKwh,
        waterM3,
        transportKm,
        transportType,
        wasteKg,
      });
      setResult(computed);
    });
  };

  const handleSaveCalculation = async () => {
    setSavingCalc(true);
    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electricityKwh,
          waterM3,
          transportKm,
          transportType,
          wasteKg,
        }),
      });
      if (res.ok) {
        setCalcSavedNotice(true);
        setTimeout(() => setCalcSavedNotice(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingCalc(false);
    }
  };

  // Business Ideas Filter
  const [businessCategory, setBusinessCategory] = useState<string>("all");

  const filteredIdeas = GREEN_BUSINESS_IDEAS.filter((item) => {
    if (businessCategory === "all") return true;
    return item.categoryEn.toLowerCase().includes(businessCategory.toLowerCase()) ||
           item.categoryUz.toLowerCase().includes(businessCategory.toLowerCase());
  });

  // Chart Data preparation
  const barChartData = [
    { name: "Elektr", value: result.electricityCo2, fill: "#10b981" },
    { name: "Transport", value: result.transportCo2, fill: "#06b6d4" },
    { name: "Chiqindi", value: result.wasteCo2, fill: "#f59e0b" },
    { name: "Suv", value: result.waterCo2, fill: "#3b82f6" },
  ];

  const pieData = [
    { name: "Elektr", value: Math.max(1, result.electricityCo2) },
    { name: "Transport", value: Math.max(1, result.transportCo2) },
    { name: "Chiqindi", value: Math.max(1, result.wasteCo2) },
    { name: "Suv", value: Math.max(1, result.waterCo2) },
  ];
  const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#3b82f6"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-2">
            <Leaf className="h-3.5 w-3.5" />
            <span>Green Economy & Circular Systems</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Yashil Iqtisodiyot Markazi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Shaxsiy uglerod izingizni hisoblang, resurslarni tejash orqali xarajatlarni qisqartiring va ekologik biznes modellarini o&apos;rganing.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "calculator"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kalkulyator
          </button>
          <button
            onClick={() => setActiveTab("business")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "business"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Biznes G&apos;oyalar
          </button>
          <button
            onClick={() => setActiveTab("methodology")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "methodology"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Metodologiya
          </button>
        </div>
      </div>

      {/* TAB 1: ECO CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-emerald-500/20 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Oylik Iste&apos;mol Ko&apos;rsatkichlari</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono">1 OY</span>
            </div>

            {/* 1. Electricity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Elektr energiyasi</span>
                </label>
                <span className="text-emerald-400 font-bold">{electricityKwh} kVt⋅soat</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={electricityKwh}
                onChange={(e) => {
                  setElectricityKwh(Number(e.target.value));
                  handleRecalculate();
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 kVt</span>
                <span>O&apos;rtacha: 250 kVt</span>
                <span>1000 kVt</span>
              </div>
            </div>

            {/* 2. Water */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Ichimlik suvi</span>
                </label>
                <span className="text-cyan-400 font-bold">{waterM3} m³</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={waterM3}
                onChange={(e) => {
                  setWaterM3(Number(e.target.value));
                  handleRecalculate();
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 m³</span>
                <span>O&apos;rtacha: 12 m³</span>
                <span>50 m³</span>
              </div>
            </div>

            {/* 3. Transport Type & Km */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-blue-400" />
                  <span>Transport turi va oylik masofa</span>
                </label>
                <span className="text-blue-400 font-bold">{transportKm} km</span>
              </div>

              <select
                value={transportType}
                onChange={(e) => {
                  setTransportType(e.target.value as typeof transportType);
                  handleRecalculate();
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="petrol_car">Benzinli avtomobil (Ai-92/95)</option>
                <option value="diesel_car">Dizel avtomobil</option>
                <option value="hybrid">Gibrid avtomobil</option>
                <option value="ev">Elektromobil (EV)</option>
                <option value="bus">Jamoat transporti (Avtobus)</option>
                <option value="metro">Toshkent Metropoliteni</option>
                <option value="bicycle">Velosiped / Piyoda yurish</option>
              </select>

              <input
                type="range"
                min="0"
                max="2500"
                step="25"
                value={transportKm}
                onChange={(e) => {
                  setTransportKm(Number(e.target.value));
                  handleRecalculate();
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* 4. Municipal Waste */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5 text-amber-500" />
                  <span>Oylik maishiy chiqindi</span>
                </label>
                <span className="text-amber-400 font-bold">{wasteKg} kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="2"
                value={wasteKg}
                onChange={(e) => {
                  setWasteKg(Number(e.target.value));
                  handleRecalculate();
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSaveCalculation}
                disabled={savingCalc}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {savingCalc ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>Hisobotni Profilga Saqlash (+15 XP)</span>
              </button>
            </div>

            {calcSavedNotice && (
              <div className="text-center text-xs text-emerald-400 font-semibold animate-pulse">
                ✓ Natijalar profilingizga muvaffaqiyatli saqlandi!
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Top KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-[10px] text-slate-400 font-medium">Jami CO₂</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {result.totalCo2Kg}
                </div>
                <div className="text-[10px] text-slate-500">kg / oy</div>
              </div>

              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-[10px] text-slate-400 font-medium">Zarur Daraxtlar</div>
                <div className="text-2xl font-black text-teal-400 mt-1 flex items-center justify-center gap-1">
                  <TreePine className="h-5 w-5" />
                  <span>{result.treeOffsetNeeded}</span>
                </div>
                <div className="text-[10px] text-slate-500">tup / yil</div>
              </div>

              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-[10px] text-slate-400 font-medium">Oylik Xarajat</div>
                <div className="text-lg font-black text-white mt-1">
                  {(result.monthlyCostUzs / 1000).toFixed(0)}k
                </div>
                <div className="text-[10px] text-slate-500">so&apos;m</div>
              </div>

              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>Tejash Mumkin</span>
                </div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {(result.potentialSavingsUzs / 1000).toFixed(0)}k
                </div>
                <div className="text-[10px] text-slate-500">so&apos;m / oy</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Bar Chart */}
              <div className="md:col-span-7 glass-card rounded-2xl p-4">
                <div className="text-xs font-bold text-white mb-3">
                  Emissiyalar Taqsimoti (kg CO₂)
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          fontSize: 11,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="md:col-span-5 glass-card rounded-2xl p-4 flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-white mb-1">
                  Struktura Foizda
                </div>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          fontSize: 11,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] font-bold text-emerald-400">
                  Eco Score: {result.ecoScore} / 100
                </div>
              </div>
            </div>

            {/* AI Actionable Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <span>AI Tavsiyalari va Optimallashtirish Rejasi</span>
              </h3>

              <div className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-xl p-3 flex items-start gap-3 border border-slate-800"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">
                          {lang === "ru" ? rec.titleRu : lang === "en" ? rec.titleEn : rec.titleUz}
                        </h4>
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {lang === "ru" ? rec.impactRu : lang === "en" ? rec.impactEn : rec.impactUz}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GREEN BUSINESS IDEAS */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Daromadli Yashil Biznes G&apos;oyalari (Climate Tech)
              </h2>
              <p className="text-xs text-slate-400">
                O&apos;zbekiston bozorida yuqori talabga ega, davlat tomonidan qo&apos;llab-quvvatlanayotgan ekologik startaplar modeli.
              </p>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">Barcha sohalar</option>
                <option value="solar">Quyosh energiyasi</option>
                <option value="recycling">Qayta ishlash</option>
                <option value="water">Suvni tejash</option>
                <option value="organic">Organik qishloq xo&apos;jaligi</option>
                <option value="packaging">Eko-qadoqlash</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-800 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      {lang === "ru" ? idea.categoryRu : lang === "en" ? idea.categoryEn : idea.categoryUz}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {idea.paybackPeriod}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {lang === "ru" ? idea.titleRu : lang === "en" ? idea.titleEn : idea.titleUz}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase">Muammo:</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {lang === "ru" ? idea.problemRu : lang === "en" ? idea.problemEn : idea.problemUz}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Yechim:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {lang === "ru" ? idea.solutionRu : lang === "en" ? idea.solutionEn : idea.solutionUz}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sarmoya:</span>
                    <span className="text-white font-bold">{idea.investmentUzs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ekologik foyda:</span>
                    <span className="text-emerald-400 font-medium text-right max-w-[65%] truncate">
                      {lang === "ru" ? idea.ecoBenefitRu : lang === "en" ? idea.ecoBenefitEn : idea.ecoBenefitUz}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: METHODOLOGY & COEFFICIENTS */}
      {activeTab === "methodology" && (
        <div className="max-w-4xl glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Hisoblash Metodologiyasi va Manbalar
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            ECOGEN AI platformasidagi barcha hisob-kitoblar xalqaro <strong>IPCC (Intergovernmental Panel on Climate Change)</strong> standartlari hamda O&apos;zbekiston Respublikasi Energetika vazirligi va Ekologiya qo&apos;mitasining rasmiy statistik koeffitsiyentlariga asoslangan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <h3 className="font-bold text-emerald-400">1. Elektr quvvati omili</h3>
              <p className="text-slate-400 leading-relaxed">
                O&apos;zbekiston energetika tizimida elektr ishlab chiqarishning qariyb 85% i issiqlik elektr stansiyalari (tabiiy gaz va ko&apos;mir) hissasiga to&apos;g&apos;ri keladi. 1 kVt⋅soat elektr energiyasi uchun milliy o&apos;rtacha koeffitsiyent <strong>0.52 kg CO₂</strong> qilib belgilangan.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-400">2. Ichimlik suvi ta&apos;minoti</h3>
              <p className="text-slate-400 leading-relaxed">
                Ichimlik suvini chuqur quduqlardan tortib olish, filtrlash, xlorlash va nasos stansiyalari orqali xonadonlarga yetkazib berish jarayonida 1 m³ suv sarfi uchun <strong>0.298 kg CO₂</strong> ekvivalenti hisoblanadi.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <h3 className="font-bold text-blue-400">3. Transport emissiyalari</h3>
              <p className="text-slate-400 leading-relaxed">
                Har 1 km masofa uchun benzinli yengil avtomobil <strong>0.192 kg CO₂</strong>, dizel <strong>0.171 kg CO₂</strong>, elektrobus/metro yo&apos;lovchisi esa bor-yo&apos;g&apos;i <strong>0.028 - 0.068 kg CO₂</strong> ajratadi.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <h3 className="font-bold text-amber-400">4. Daraxtlar kompensatsiyasi</h3>
              <p className="text-slate-400 leading-relaxed">
                Birlashgan Millatlar Tashkiloti (UNEP) ma&apos;lumotlariga ko&apos;ra, bitta o&apos;rtacha voyaga yetgan daraxt yiliga taxminan <strong>21.77 kg CO₂</strong> ni fotosintez orqali yutadi va kislorod ajratadi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
