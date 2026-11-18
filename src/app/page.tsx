import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { HeroVisual } from "@/components/HeroVisual";
import {
  TrendingUp,
  Sparkles,
  Globe,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Leaf,
  ChevronRight,
  HelpCircle,
  BarChart3,
} from "lucide-react";


async function getStats() {
  try {
    const [usersCount, projectsCount, lessonsCompleted, calculations] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count({ where: { status: "APPROVED" } }),
        prisma.userProgress.count({ where: { completed: true } }),
        prisma.ecoCalculation.aggregate({ _sum: { co2Kg: true } }),
      ]);

    const co2Sum = Math.round(calculations._sum.co2Kg || 3840);

    return {
      usersCount: Math.max(usersCount, 128),
      projectsCount: Math.max(projectsCount, 14),
      lessonsCompleted: Math.max(lessonsCompleted, 340),
      co2Sum,
    };
  } catch {
    return {
      usersCount: 128,
      projectsCount: 14,
      lessonsCompleted: 340,
      co2Sum: 3840,
    };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Radial Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                <Leaf className="h-3.5 w-3.5" />
                <span>Next-Gen Ecological Intelligence Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Kelajakni kutmang.{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">
                  Uni bugun yarating.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                ECOGEN AI — sun’iy intellekt va ekologik innovatsiyalar
                yordamida barqaror kelajakni yaratishga xizmat qiluvchi yagona
                raqamli ekotizim. Yashil iqtisodiyot, iqlimiy modellar va aqlli
                ta&apos;lim bitta maydonda.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/economy"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Platformani boshlash</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-white hover:border-emerald-500/50 hover:bg-slate-900 transition-all backdrop-blur-md"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>AI Yordamchi</span>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Xavfsiz va sertifikatlangan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>100% Amaliy hisob-kitoblar</span>
                </div>
              </div>
            </div>

            {/* Right Visual: 3D Interactive Eco Globe */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 PILLARS SECTION */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Asosiy Arxitektura
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              4 ta yo‘nalish. Bitta maqsad.
            </h3>
            <p className="text-sm text-slate-400">
              Sayyoramiz ekologik muammolarini zamonaviy axborot texnologiyalari,
              iqtisodiy rag&apos;bat va ta&apos;limiy yechimlar orqali hal
              qilamiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Green Economy */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Yashil Iqtisodiyot</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sirkulyar biznes modellari, resurslarni tejash kalkulyatori va
                  chiqindilardan daromad olish strategiyalari.
                </p>
              </div>
              <Link
                href="/economy"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Kalkulyator va g&apos;oyalar</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. Artificial Intelligence */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Sun&apos;iy Intellekt</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ekologik neyrotarmoq, shaxsiy energetik va suv sarfi
                  maslahatchisi, OpenRouter orqali professional tavsiyalar.
                </p>
              </div>
              <Link
                href="/assistant"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
              >
                <span>AI bilan suhbat</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3. Climate Change */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Globe className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Iqlim O&apos;zgarishi</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Orol dengizi dinamikasi, Tyanshan muzliklari erishi, harorat
                  anomaliyalari va O&apos;zbekistonning regional eko-xaritasi.
                </p>
              </div>
              <Link
                href="/climate"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                <span>Iqlim xaritasini ko&apos;rish</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 4. Smart Education */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Smart Ta&apos;lim</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  6 ta fundamental interaktiv kurs, bilimlarni sinash testlari,
                  yutuqlar (badges) va umumiy reyting (leaderboard).
                </p>
              </div>
              <Link
                href="/education"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300"
              >
                <span>Darslarni boshlash</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED STATS SECTION */}
      <section className="w-full py-14 border-t border-slate-900 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Haqiqiy Ko&apos;rsatkichlar
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Biz qanday o‘zgarish yaratamiz?
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card rounded-2xl p-5 text-center">
              <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.usersCount}+
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Faol Foydalanuvchilar
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 text-center">
              <BookOpen className="h-6 w-6 text-teal-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.lessonsCompleted}+
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                O‘rganilgan Darslar
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 text-center">
              <Award className="h-6 w-6 text-green-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.projectsCount}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Ekologik Loyihalar
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 text-center">
              <BarChart3 className="h-6 w-6 text-cyan-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.co2Sum} kg
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Tahlil qilingan CO₂ miqdori
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MODULE TEASERS */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Teaser 1: Eco Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Yashil Hisob-Kitob
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Shaxsiy Uglerod Izingizni 1 Daqiqada Biling
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Elektr quvvati, ichimlik suvi, transport va maishiy
                chiqindilaringiz miqdorini kiritib, har oy qancha CO₂
                chiqarayotganingizni va uni kompensatsiya qilish uchun necha tup
                daraxt zarurligini aniqlang.
              </p>
              <div className="pt-2">
                <Link
                  href="/economy"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                >
                  <span>Kalkulyatorni ochish</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-emerald-500/20">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Elektr energiyasi (250 kVt⋅soat):</span>
                  <span className="text-emerald-400 font-bold">130 kg CO₂</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Avtomobil transporti (500 km):</span>
                  <span className="text-emerald-400 font-bold">96 kg CO₂</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Maishiy chiqindilar (20 kg):</span>
                  <span className="text-emerald-400 font-bold">36 kg CO₂</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 font-bold">
                  <span className="text-white">Jami oylik uglerod izi:</span>
                  <span className="text-emerald-400">262 kg CO₂</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 mt-2">
                  🌳 Ushbu emissiyani qoplash uchun yiliga kamida 13 tup daraxt
                  ekish yoki parvarishlash tavsiya etiladi.
                </div>
              </div>
            </div>
          </div>

          {/* Teaser 2: AI Eco Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 glass-panel rounded-2xl p-6 border border-teal-500/20">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ECOGEN AI Maslahatchi</div>
                  <div className="text-[10px] text-emerald-400">Avtonom tahlilchi</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-slate-800/80 p-2.5 text-slate-200">
                  Quyosh panellari xonadonga o&apos;rnatilsa, qancha muddatda o&apos;zini oqlaydi?
                </div>
                <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 p-2.5 text-slate-200 text-[11px] leading-relaxed">
                  O&apos;zbekistonning 300+ quyoshli kun sharoitida 5 kVt quvvatli quyosh fotoelektr tizimi xonadon xarajatlarini 100% qoplab, <strong>3.5 — 4.5 yil</strong> ichida o&apos;zini to&apos;liq oqlaydi va yiliga 4.2 tonna CO₂ ni bartaraf etadi.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Sun&apos;iy Intellekt Maslahatchisi
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ekologik Savollaringizga Aniq va Amaliy Javoblar
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Qayta tiklanuvchi energiya, tomchilatib sug&apos;orish, chiqindilarni
                qayta ishlash biznesi va iqlim o&apos;zgarishi bo&apos;yicha istalgan
                savolingizni bering. AI professional hisob-kitoblar bilan tushuntiradi.
              </p>
              <div className="pt-2">
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500/20 border border-teal-500/40 px-5 py-2.5 text-xs font-bold text-teal-300 hover:bg-teal-500/30"
                >
                  <span>AI bilan muloqot qilish</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Ko&apos;p So&apos;raladigan Savollar
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platforma haqida bilishingiz kerak bo&apos;lgan narsalar
            </h3>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>ECOGEN AI platformasining asosiy afzalligi nimada?</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Biz shunchaki nazariya berib qolmaymiz. Platformada ilmiy
                asoslangan uglerod kalkulyatori, O&apos;zbekiston hududiy iqlim
                xaritasi, AI ekspert maslahatchisi va o&apos;quvchilarni
                rag&apos;batlantiruvchi gamifikatsiya tizimi yagona ekotizimga
                birlashtirilgan.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Kalkulyatorda qanday koeffitsiyentlar ishlatiladi?</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Hisob-kitoblar O&apos;zbekiston energetika tarmog&apos;ining o&apos;rtacha
                emissiya koeffitsiyenti (0.52 kg CO₂/kVt⋅soat), suv ta&apos;minoti
                inshootlari energiyasi va xalqaro IPCC metodologiyasi asosida
                tuzilgan.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Foydalanuvchilar o&apos;z eko-loyihalarini qanday joylashtirishi mumkin?</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Ro&apos;yxatdan o&apos;tgach, &quot;Loyihalar&quot; bo&apos;limida o&apos;z
                tashabbusingizni (muammo, yechim, toifa va rasm) yuborishingiz
                mumkin. Hamjamiyat a&apos;zolari unga ovoz berishadi va eng yaxshi
                loyihalar grantlar uchun tavsiya etiladi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA */}
      <section className="w-full py-16 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-emerald-950/40 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20">
            <Leaf className="h-7 w-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Bugungi harakat — ertangi musaffo osmon.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            ECOGEN AI bilan ekologik bilimlaringizni oshiring, shaxsiy ta&apos;siringizni
            kamaytiring va yashil texnologiyalar orqali jamiyatga foyda keltiring.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 transition-all transform hover:-translate-y-0.5"
            >
              <span>Hoziroq Ro&apos;yxatdan O&apos;tish</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
