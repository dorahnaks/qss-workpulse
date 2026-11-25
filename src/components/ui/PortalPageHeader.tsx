import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

interface PortalPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  clientName?: string;
  isLiveData?: boolean;
  actions?: ReactNode;
}

export function PortalPageHeader({
  eyebrow,
  title,
  description,
  clientName,
  isLiveData,
  actions,
}: PortalPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {eyebrow}
          </span>
          {clientName ? (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-600">
                {clientName}
              </span>
            </>
          ) : null}
          {typeof isLiveData === "boolean" ? (
            <Badge variant={isLiveData ? "success" : "info"} dot>
              {isLiveData ? "Live Laravel API" : "Demo Snapshot"}
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
