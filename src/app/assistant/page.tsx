"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  Sparkles,
  Send,
  PlusCircle,
  Copy,
  Check,
  Bot,
  User,
  AlertCircle,
  Zap,
  Droplets,
  Recycle,
  Sun,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isFallback?: boolean;
}

export default function AssistantPage() {
  const { lang, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        lang === "ru"
          ? "Здравствуйте! Я — **ECOGEN AI Assistant**, ваш интеллектуальный консультант по вопросам экологии, климатической адаптации, зеленых технологий и энергосбережения в Узбекистане. Чем могу помочь вам сегодня?"
          : lang === "en"
          ? "Hello! I am **ECOGEN AI Assistant**, your dedicated intelligence consultant for environmental engineering, solar transition, circular business models, and climate science in Uzbekistan. How can I assist you today?"
          : "Assalomu alaykum! Men — **ECOGEN AI Yordamchi**, sizning ekologiya, quyosh energetikasi, suvni tejash, chiqindilarni qayta ishlash va yashil biznes bo'yicha shaxsiy intellektual maslahatchingizman. Sizga qanday yordam bera olaman?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    setErrorMsg(null);
    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const historyToSend = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyToSend,
          language: lang,
          chatId: activeChatId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }

      if (data.chatId && !activeChatId) {
        setActiveChatId(data.chatId);
      }

      const assistantMsg: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.reply,
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content:
          lang === "ru"
            ? "Новый сеанс консультации начат. Задайте любой экологический или климатический вопрос!"
            : lang === "en"
            ? "New consultation session initialized. Ask any environmental or climate question!"
            : "Yangi suhbat boshlandi. Ekologiya, quyosh panellari yoki yashil biznes bo'yicha savolingizni bering!",
      },
    ]);
    setActiveChatId(undefined);
    setErrorMsg(null);
  };

  const quickPromptChips = [
    {
      label: "Quyosh panellari hisobi",
      icon: Sun,
      prompt: "Xonadonga 5 kVt quyosh panellari o'rnatish qanchaga tushadi va qancha muddatda o'zini oqlaydi?",
    },
    {
      label: "Tomchilatib sug'orish",
      icon: Droplets,
      prompt: "Tomchilatib sug'orish texnologiyasi qanday ishlaydi va suvni qanchalik tejaydi?",
    },
    {
      label: "Plastikni qayta ishlash biznesi",
      icon: Recycle,
      prompt: "Plastik chiqindilarni qayta ishlash bo'yicha kichik korxona ochish uchun qanday uskunalar va sarmoya kerak?",
    },
    {
      label: "Elektr energiyasini tejash",
      icon: Zap,
      prompt: "Xonadonda oylik elektr energiyasi sarfini 30% ga kamaytirish uchun qanday aniq choralarni ko'rish kerak?",
    },
  ];

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-4 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white">
                {t.chat.title}
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.chat.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>{t.chat.newChat}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-900 border border-emerald-500/30 text-emerald-400"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? "bg-emerald-600 text-white rounded-tr-none shadow-md"
                    : "glass-card text-slate-200 rounded-tl-none border border-slate-800"
                }`}
              >
                {/* Fallback Notice Badge if AI is on expert fallback */}
                {m.isFallback && (
                  <div className="mb-2 flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    <span>ECOGEN Avtonom Ekologik Tahlil Modeli</span>
                  </div>
                )}

                {/* Markdown text rendering */}
                <div className="whitespace-pre-wrap space-y-2 prose-invert text-xs">
                  {m.content}
                </div>

                {/* Copy button */}
                {!isUser && (
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                    title={t.chat.copy}
                  >
                    {copiedId === m.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <span>AI tahlil qilmoqda...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips (Quick queries) */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickPromptChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(chip.prompt)}
              disabled={loading}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Icon className="h-3 w-3 text-emerald-400" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="relative mt-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chat.placeholder}
          rows={2}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3 pl-4 pr-14 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none shadow-xl"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-2.5 bottom-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 px-1">
        <span>Enter: Yuborish | Shift + Enter: Yangi qator</span>
        <span>ECOGEN AI v2.4 (O&apos;zbekiston iqlim modeli)</span>
      </div>
    </div>
  );
}
