import type { ReactNode } from "react";
import { AuthShell } from "@/components/layout/AuthShell";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthShell>{children}</AuthShell>
    </AuthProvider>
  );
}
