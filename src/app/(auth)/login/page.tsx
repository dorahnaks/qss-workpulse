import type { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Client Sign In",
  description: "Sign in to the QSS WorkPulse Client Portal.",
};

export default function LoginPage() {
  return <LoginForm />;
}
