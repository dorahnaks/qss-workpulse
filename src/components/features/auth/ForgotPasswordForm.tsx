"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AUTH_ROUTES } from "@/config/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";
import { requestPasswordReset } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [demoResetUrl, setDemoResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await requestPasswordReset({ email });
      setSentMessage(result.message);
      setDemoResetUrl(result.demoResetUrl ?? null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to send reset instructions. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0B2D4D]">
          {t.auth.forgotTitle}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          {t.auth.forgotSubtitle}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      {sentMessage ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-700">
              {sentMessage}
            </p>
          </div>

          {demoResetUrl && (
            <div className="rounded-xl border border-[#F6BA16]/50 bg-[#F6BA16]/10 p-4 text-xs text-[#0B2D4D]">
              <p className="font-semibold">Demo Mode Shortcut</p>
              <p className="mt-1 text-slate-700">
                Laravel email delivery isn&apos;t connected yet. Open the reset
                link directly to test the flow:
              </p>
              <Link
                href={demoResetUrl}
                className="mt-3 inline-flex items-center rounded-lg bg-[#0056A7] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004485]"
              >
                Continue to Reset Password &rarr;
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setSentMessage(null);
                setDemoResetUrl(null);
              }}
              className="font-semibold text-slate-600 hover:text-[#0B2D4D]"
            >
              Try another email
            </button>
            <Link
              href={AUTH_ROUTES.login}
              className="font-semibold text-[#0056A7] hover:text-[#004485]"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.auth.workEmail}
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.jenkins@acmelogistics.com"
              className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#0056A7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004485] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t.auth.sendingLink : t.auth.sendResetLink}
          </button>

          <p className="text-center text-xs text-slate-600">
            <Link
              href={AUTH_ROUTES.login}
              className="font-semibold text-[#0056A7] hover:text-[#004485]"
            >
              {t.auth.backToSignIn}
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
