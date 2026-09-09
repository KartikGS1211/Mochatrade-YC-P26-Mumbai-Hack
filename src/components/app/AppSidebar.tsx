"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Pre-trade Check", href: "/risk-check", icon: "⚡" },
  { name: "Portfolio", href: "/portfolio", icon: "💼" },
  { name: "Stress Scenarios", href: "/scenarios", icon: "📊" },
  { name: "Methodology", href: "/methodology", icon: "📐" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-ms-border bg-white flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Branding */}
        <div className="p-6 border-b border-ms-border">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-ms-navy flex items-center justify-center text-white text-base shadow-subtle group-hover:bg-ms-blue transition-colors">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-ms-navy tracking-tight">
                  MochaShield
                </span>
                <span className="text-[10px] bg-ms-softblue text-ms-blue font-semibold px-1.5 py-0.5 rounded">
                  v1.2
                </span>
              </div>
              <p className="text-[10px] font-semibold text-ms-blue tracking-wider uppercase">
                Risk Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold text-ms-muted uppercase tracking-wider">
            Risk Analysis Tools
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-ms-softblue text-ms-blue font-semibold shadow-subtle"
                    : "text-ms-text hover:bg-ms-bg hover:text-ms-navy"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer disclaimer */}
      <div className="p-4 border-t border-ms-border bg-ms-bg/50 m-3 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ms-green animate-pulse" />
          <span className="text-xs font-semibold text-ms-navy">Risk Firewall Active</span>
        </div>
        <p className="text-[11px] text-ms-muted leading-relaxed">
          Decision support only. Not investment advice or trade execution.
        </p>
      </div>
    </aside>
  );
}
