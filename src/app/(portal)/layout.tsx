import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { AuthProvider } from "@/context/AuthContext";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PortalShell>{children}</PortalShell>
    </AuthProvider>
  );
}
