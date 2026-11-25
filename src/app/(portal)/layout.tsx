import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PortalShell>{children}</PortalShell>
      </AuthProvider>
    </LanguageProvider>
  );
}
