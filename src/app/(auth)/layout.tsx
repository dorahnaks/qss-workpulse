import type { ReactNode } from "react";
import { AuthShell } from "@/components/layout/AuthShell";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthShell>{children}</AuthShell>
      </AuthProvider>
    </LanguageProvider>
  );
}
