import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your QSS WorkPulse account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
