"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellDot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Cog,
  FileText,
  FolderKanban,
  Gauge,
  Home,
  Menu,
  PackageOpen,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import { cn } from "@servelect/shared";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  badge?: string;
  accent?: "green" | "blue" | "orange" | "red" | "purple";
  meta?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    label: "Work OS",
    items: [
      { href: "/", label: "Command Center", icon: Home, accent: "green", meta: "Home" },
      { href: "/proiecte", label: "Proiecte", icon: FolderKanban, accent: "green", meta: "Gantt · board" },
      { href: "/taskuri", label: "Taskuri", icon: ClipboardList, accent: "blue", meta: "My work", badge: "12" },
      { href: "/calendar", label: "Calendar", icon: CalendarDays, accent: "purple", meta: "Agenda" },
      { href: "/echipa", label: "Echipă / Workload", icon: Users, accent: "blue", meta: "Resurse" }
    ]
  },
  {
    label: "Operațiuni Servelect",
    items: [
      { href: "/crm", label: "CRM & Vânzări", icon: BriefcaseBusiness, accent: "blue", meta: "Pipeline" },
      { href: "/iot", label: "Monitorizare IoT", icon: Gauge, accent: "orange", meta: "Live", badge: "7" },
      { href: "/echipamente", label: "Echipamente", icon: PackageOpen, accent: "purple", meta: "Stoc · QR" },
      { href: "/mentenanta", label: "Mentenanță", icon: Wrench, accent: "red", meta: "SLA" },
      { href: "/finantari-esg", label: "Finanțări & ESG", icon: ShieldCheck, accent: "green", meta: "Audit" }
    ]
  },
  {
    label: "Companie",
    items: [
      { href: "/documente", label: "Documente", icon: FileText, accent: "blue", meta: "Library" },
      { href: "/rapoarte", label: "Rapoarte", icon: BarChart3, accent: "purple", meta: "BI" },
      { href: "/hr-admin", label: "Administrare", icon: Cog, accent: "green", meta: "HR" },
      { href: "/admin/users", label: "Utilizatori & RBAC", icon: ShieldCheck, accent: "green", meta: "Access" }
    ]
  }
];

const accentMap = {
  green: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/15",
  blue: "text-blue-300 bg-blue-400/10 ring-blue-400/15",
  orange: "text-amber-300 bg-amber-400/10 ring-amber-400/15",
  red: "text-red-300 bg-red-400/10 ring-red-400/15",
  purple: "text-violet-300 bg-violet-400/10 ring-violet-400/15"
};

export function Sidebar({ collapsed, onToggle, mobile = false }: { collapsed: boolean; onToggle: () => void; mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-[#071826] text-white shadow-2xl transition-all duration-300",
        mobile ? "flex w-[304px] flex-col" : "hidden lg:flex lg:flex-col",
        collapsed && !mobile ? "w-[86px]" : "w-[304px]"
      )}
    >
      <div className="relative overflow-hidden border-b border-white/10 px-4 py-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.18),transparent_30%)]" />
        <div className={cn("relative flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-servelect-500 to-emerald-700 shadow-[0_16px_40px_rgba(0,132,61,.36)] ring-1 ring-white/20">
            <Zap className="h-6 w-6 fill-white/20" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-300 ring-4 ring-[#071826]" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-tight">
                SERVELECT <span className="font-semibold text-slate-300">EMP</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
                Work OS Enterprise
              </div>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <Link
            href="/taskuri"
            className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-3 text-sm font-bold text-emerald-50 transition hover:bg-emerald-400/15"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Quick create task
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-200" />
          </Link>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                {group.label}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;
                const accent = accentMap[item.accent ?? "green"];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                      active && "bg-white text-slate-950 shadow-[0_20px_45px_rgba(0,0,0,.22)] hover:bg-white hover:text-slate-950",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 transition",
                        active ? "bg-servelect-600 text-white ring-servelect-500/40" : accent
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate leading-4">{item.label}</span>
                          {item.meta && <span className={cn("block truncate text-[11px] font-semibold", active ? "text-slate-500" : "text-slate-500")}>{item.meta}</span>}
                        </span>

                        {item.badge && (
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-black", active ? "bg-red-50 text-red-600" : "bg-red-500 text-white")}>
                            {item.badge}
                          </span>
                        )}

                        <ChevronRight className={cn("h-4 w-4 opacity-0 transition group-hover:opacity-100", active ? "text-slate-400 opacity-100" : "text-slate-500")} />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-black">Operațional azi</div>
                <div className="text-xs text-slate-400">Taskuri, alerte, aprobări</div>
              </div>
              <BellDot className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 p-2">
                <div className="text-lg font-black">32</div>
                <div className="text-[10px] text-slate-400">taskuri</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-2">
                <div className="text-lg font-black text-amber-300">7</div>
                <div className="text-[10px] text-slate-400">alerte</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-2">
                <div className="text-lg font-black text-emerald-300">98%</div>
                <div className="text-[10px] text-slate-400">uptime</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-3 border-t border-white/10 px-5 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white",
          collapsed && "justify-center px-0"
        )}
      >
        <Menu className="h-5 w-5" />
        {!collapsed && <span>Restrânge meniul</span>}
      </button>
    </aside>
  );
}
