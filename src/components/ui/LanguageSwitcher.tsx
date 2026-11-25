"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, languages, setLocale, t } = useLanguage();

  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0B2D4D] transition-colors hover:border-[#0056A7]/40">
      <svg
        className="h-3.5 w-3.5 shrink-0 text-[#0056A7]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span className="sr-only">{t.common.language}</span>
      <select
        aria-label={t.common.language}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="cursor-pointer bg-transparent text-xs font-semibold text-[#0B2D4D] focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {compact ? lang.code.toUpperCase() : lang.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
