"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DictateButton } from "@/components/ui/DictateButton";
import { useLanguage } from "@/context/LanguageContext";
import {
  sendAssistantMessage,
  type ChatMessage,
} from "@/services/chatbot.service";

function getTimeLabel(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WorkPulseChatbot() {
  const { locale, languageOption, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  const displayedMessages: ChatMessage[] =
    messages.length > 0
      ? messages
      : [
          {
            id: "welcome",
            role: "assistant",
            content: t.assistant.welcome,
            timestamp: "",
          },
        ];

  useEffect(() => {
    if (open) {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, displayedMessages.length, sending]);

  const speakReply = (text: string) => {
    if (!readAloud || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageOption.speechLang;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore browser TTS errors
    }
  };

  const submitPrompt = async (rawPrompt: string) => {
    const trimmed = rawPrompt.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: getTimeLabel(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const response = await sendAssistantMessage(trimmed, locale);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: getTimeLabel(),
        action: response.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      speakReply(response.reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant right now. Please try again.",
          timestamp: getTimeLabel(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitPrompt(input);
  };

  const handleClear = () => {
    setMessages([]);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Drawer */}
      {open && (
        <section
          aria-label={t.assistant.title}
          className="mb-3 flex h-[500px] max-h-[calc(100vh-6rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0B2D4D] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056A7] text-xs font-bold">
                AI
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B2D4D] bg-[#F6BA16]" />
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-tight">
                  {t.assistant.title}
                </h2>
                <p className="text-[11px] text-slate-300">
                  {languageOption.nativeLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white"
              >
                {t.assistant.clear}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
                className="rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Read-aloud toggle bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#F7F8FA] px-4 py-2 text-[11px] text-slate-600">
            <span>{t.assistant.subtitle}</span>
            <label className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-[#0B2D4D]">
              <input
                type="checkbox"
                checked={readAloud}
                onChange={(e) => setReadAloud(e.target.checked)}
                className="h-3.5 w-3.5 rounded accent-[#0056A7]"
              />
              <span>TTS</span>
            </label>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0056A7] text-white"
                      : "border border-slate-200 bg-[#F7F8FA] text-[#212121]"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.action && (
                    <Link
                      href={msg.action.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0056A7] ring-1 ring-[#0056A7]/25 hover:bg-[#0056A7]/5"
                    >
                      {msg.action.label} &rarr;
                    </Link>
                  )}
                </div>
                {msg.timestamp && (
                  <span className="mt-1 px-1 text-[10px] text-slate-400">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            ))}

            {sending && (
              <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-[#F7F8FA] px-3.5 py-2.5 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0056A7]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0056A7] [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F6BA16] [animation-delay:240ms]" />
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3.5 py-2.5">
              {t.assistant.prompts.map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => void submitPrompt(promptText)}
                  className="rounded-full border border-slate-200 bg-[#F7F8FA] px-2.5 py-1 text-[11px] font-medium text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40 hover:bg-[#0056A7]/5 hover:text-[#0056A7]"
                >
                  {promptText}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar with Voice Dictate */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <DictateButton
              size="md"
              onResult={(spoken) =>
                setInput((prev) => (prev ? `${prev} ${spoken}` : spoken))
              }
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistant.placeholder}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-[#F7F8FA] px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="shrink-0 rounded-lg bg-[#0056A7] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004485] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.assistant.send}
            </button>
          </form>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2.5 rounded-full bg-[#0056A7] px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#004485] focus:outline-none focus:ring-2 focus:ring-[#F6BA16] focus:ring-offset-2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F6BA16] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F6BA16]" />
        </span>
        <span>{t.assistant.buttonLabel}</span>
      </button>
    </div>
  );
}
