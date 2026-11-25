"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";

interface DictateButtonProps {
  onResult: (spokenText: string) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export function DictateButton({
  onResult,
  ariaLabel,
  size = "sm",
}: DictateButtonProps) {
  const { t } = useLanguage();
  const { isSupported, isListening, error, toggleListening } = useVoiceDictation({
    onTranscript: onResult,
  });

  const sizeClass = size === "md" ? "h-9 w-9" : "h-7 w-7";

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={!isSupported}
      title={
        !isSupported
          ? t.common.dictateUnsupported
          : error
            ? error
            : isListening
              ? t.common.listening
              : t.common.dictate
      }
      aria-label={ariaLabel ?? (isListening ? t.common.listening : t.common.dictate)}
      className={`inline-flex ${sizeClass} shrink-0 items-center justify-center rounded-lg transition-colors ${
        isListening
          ? "bg-rose-600 text-white animate-pulse"
          : isSupported
            ? "bg-slate-100 text-[#0056A7] hover:bg-[#0056A7]/10"
            : "bg-slate-100 text-slate-300 cursor-not-allowed"
      }`}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}
