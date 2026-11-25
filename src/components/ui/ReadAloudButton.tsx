"use client";

import { useReadAloud } from "@/hooks/useReadAloud";

interface ReadAloudButtonProps {
  text: string;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export function ReadAloudButton({
  text,
  ariaLabel,
  size = "sm",
}: ReadAloudButtonProps) {
  const { isSupported, isSpeaking, isPaused, speak, stop, toggle } = useReadAloud();

  const sizeClass = size === "md" ? "h-9 w-9" : "h-7 w-7";

  const handleClick = () => {
    if (isSpeaking) {
      if (isPaused) {
        toggle();
      } else {
        stop();
      }
    } else {
      speak(text);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isSpeaking ? (isPaused ? "Resume" : "Stop reading") : "Read aloud"}
      aria-label={ariaLabel ?? (isSpeaking ? "Stop reading" : "Read aloud")}
      className={`inline-flex ${sizeClass} shrink-0 items-center justify-center rounded-lg transition-colors ${
        isSpeaking
          ? "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
          : "bg-slate-100 text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
      }`}
    >
      {isSpeaking ? (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
