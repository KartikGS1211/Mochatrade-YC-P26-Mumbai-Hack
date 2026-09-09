"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  subtitle?: string;
  statusText?: string;
}

export function Header({ subtitle, statusText }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-ms-panel/60 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-xl font-bold tracking-tight text-ms-text group-hover:text-ms-blue transition-colors">
            ☕ MochaShield
          </span>
          {subtitle && (
            <>
              <span className="hidden sm:inline text-ms-muted/50">|</span>
              <span className="hidden sm:inline text-sm text-ms-muted">
                {subtitle}
              </span>
            </>
          )}
        </Link>

        {/* Status */}
        {statusText && (
          <Badge
            variant="secondary"
            className="bg-ms-raised text-ms-muted text-xs font-medium border border-border/50"
          >
            {statusText}
          </Badge>
        )}
      </div>
    </header>
  );
}
