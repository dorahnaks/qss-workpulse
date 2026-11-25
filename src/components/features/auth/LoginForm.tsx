"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AUTH_ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to sign in right now. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0B2D4D]">
          {t.auth.loginTitle}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">{t.auth.loginSubtitle}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700"
          >
            {t.auth.workEmail}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="name@company.com"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.auth.password}
            </label>
            <Link
              href={AUTH_ROUTES.forgotPassword}
              className="text-xs font-semibold text-[#0056A7] hover:text-[#004485]"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter your password"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-[#0056A7]"
            >
              {showPassword ? t.auth.hide : t.auth.show}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-xs text-slate-600 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-[#0056A7]"
          />
          {t.auth.keepSignedIn}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#0056A7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004485] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.auth.signingIn : t.common.signIn}
        </button>
      </form>
    </div>
  );
}
