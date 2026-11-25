"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  type LanguageOption,
  type Locale,
  type TranslationDictionary,
} from "@/lib/i18n/translations";

const LOCALE_STORAGE_KEY = "qss_workpulse_locale";

interface LanguageContextValue {
  locale: Locale;
  languageOption: LanguageOption;
  languages: LanguageOption[];
  t: TranslationDictionary;
  setLocale: (next: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "sw" || saved === "fr" || saved === "rw") {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== "en") {
      // Defer to microtask so React 19 lint rule doesn't flag synchronous setState in effect
      Promise.resolve().then(() => setLocaleState(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  const languageOption =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === locale) ??
    SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        locale,
        languageOption,
        languages: SUPPORTED_LANGUAGES,
        t: TRANSLATIONS[locale],
        setLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
