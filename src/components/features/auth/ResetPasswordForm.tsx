"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AUTH_ROUTES } from "@/config/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ApiError } from "@/lib/api/client";
import { resetClientPassword } from "@/services/auth.service";

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "demo-reset-token";

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetClientPassword({
        email,
        token,
        password,
        passwordConfirmation: confirmPassword,
      });
      setSuccessMessage(result.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to reset password. Please request a new reset link.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0B2D4D]">
          {t.auth.resetTitle}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">{t.auth.resetSubtitle}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      {successMessage ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Password updated</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-700">
              {successMessage}
            </p>
          </div>
          <Link
            href={AUTH_ROUTES.login}
            className="block w-full rounded-lg bg-[#0056A7] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#004485]"
          >
            Continue to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.auth.workEmail}
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
            />
          </div>

          <div>
            <label
              htmlFor="reset-password"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.auth.newPassword}
            </label>
            <div className="relative mt-1.5">
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-[#0056A7]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.auth.confirmPassword}
            </label>
            <div className="relative mt-1.5">
              <input
                id="reset-confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056A7] focus:outline-none focus:ring-2 focus:ring-[#0056A7]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-[#0056A7]"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <ul className="space-y-1.5 rounded-xl bg-[#F7F8FA] p-3.5 text-xs text-slate-600">
            <li className={hasMinLength ? "text-emerald-700 font-medium" : ""}>
              {hasMinLength ? "✓" : "•"} Minimum 8 characters
            </li>
            <li className={hasUppercase ? "text-emerald-700 font-medium" : ""}>
              {hasUppercase ? "✓" : "•"} At least one uppercase letter
            </li>
            <li className={hasNumber ? "text-emerald-700 font-medium" : ""}>
              {hasNumber ? "✓" : "•"} At least one number
            </li>
            <li
              className={passwordsMatch ? "text-emerald-700 font-medium" : ""}
            >
              {passwordsMatch ? "✓" : "•"} Passwords match
            </li>
          </ul>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#0056A7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004485] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t.auth.updatingPassword : t.auth.updatePassword}
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
