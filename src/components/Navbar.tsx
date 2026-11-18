"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { SessionUser } from "@/lib/types";
import {
  Leaf,
  Sparkles,
  TrendingUp,
  Globe,
  GraduationCap,
  FolderKanban,
  CheckSquare,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronDown,
  PlayCircle,
} from "lucide-react";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleQuickDemoLogin = async (role: "user" | "admin") => {
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        router.refresh();
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/assistant", label: t.nav.assistant, icon: Sparkles },
    { href: "/economy", label: t.nav.economy, icon: TrendingUp },
    { href: "/climate", label: t.nav.climate, icon: Globe },
    { href: "/education", label: t.nav.education, icon: GraduationCap },
    { href: "/projects", label: t.nav.projects, icon: FolderKanban },
    { href: "/challenges", label: t.nav.challenges, icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-950/20 bg-slate-950/80 backdrop-blur-xl transition-colors dark:border-emerald-500/10 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5 text-slate-950 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white">
              ECOGEN <span className="text-emerald-400">AI</span>
            </span>
            <span className="hidden text-[10px] font-medium tracking-wider text-emerald-400/80 uppercase sm:inline-block">
              Green Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-emerald-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Access Pill (For Judges) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => handleQuickDemoLogin("user")}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Musobaqa hakamlari uchun demo rejim"
            >
              <PlayCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Demo</span>
            </button>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-700 hover:text-white"
            >
              <span className="uppercase">{lang}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-xl ring-1 ring-black/5 z-50">
                <button
                  onClick={() => {
                    setLang("uz");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    lang === "uz" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  🇺🇿 O&apos;zbek
                </button>
                <button
                  onClick={() => {
                    setLang("ru");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    lang === "ru" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  🇷🇺 Русский
                </button>
                <button
                  onClick={() => {
                    setLang("en");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    lang === "en" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Auth State */}
          {!loadingUser && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 py-1 pl-1.5 pr-3 text-xs font-medium text-white hover:border-emerald-500/60"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 font-bold text-slate-950 text-[10px]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-semibold">{user.name.split(" ")[0]}</span>
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 font-bold">
                      Lvl {user.level}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl ring-1 ring-black/5 z-50">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-400 font-bold">{user.xp} XP</span>
                          <span className="text-slate-400">Score: {user.ecoScore}</span>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <User className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{t.nav.dashboard}</span>
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 hover:bg-slate-800"
                        >
                          <Shield className="h-3.5 w-3.5 text-amber-400" />
                          <span>{t.nav.admin}</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    {t.nav.register}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-300 hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  handleQuickDemoLogin("user");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-300"
              >
                Demo Talaba
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin("admin");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-semibold text-amber-300"
              >
                Demo Admin
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
