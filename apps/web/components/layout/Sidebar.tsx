"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Cog,
  Database,
  FileText,
  FolderKanban,
  Gauge,
  Home,
  Menu,
  PackageOpen,
  ShieldCheck,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import { cn } from "@servelect/shared";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/proiecte", label: "Proiecte", icon: FolderKanban, expandable: true },
  { href: "/taskuri", label: "Taskuri", icon: ClipboardList, expandable: true },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/echipa", label: "Echipă / Workload", icon: Users },
  { href: "/crm", label: "CRM & Vânzări", icon: BriefcaseBusiness, expandable: true },
  { href: "/iot", label: "Monitorizare IoT", icon: Gauge, expandable: true, badge: "7" },
  { href: "/echipamente", label: "Echipamente", icon: PackageOpen, expandable: true },
  { href: "/mentenanta", label: "Mentenanță", icon: Wrench, expandable: true },
  { href: "/finantari-esg", label: "Finanțări & ESG", icon: ShieldCheck, expandable: true },
  { href: "/documente", label: "Documente", icon: FileText },
  { href: "/rapoarte", label: "Rapoarte", icon: BarChart3 },
  { href: "/hr-admin", label: "Administrare", icon: Cog, expandable: true }
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#071826] text-white shadow-2xl lg:flex lg:flex-col transition-all", collapsed ? "w-[86px]" : "w-[292px]")}> 
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-servelect-500 to-emerald-700 shadow-lg">
          <Zap className="h-6 w-6 fill-white/20" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-xl font-extrabold tracking-tight">SERVELECT <span className="font-semibold text-slate-300">EMP</span></div>
            <div className="text-xs text-slate-400">Energy Management Platform</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("sidebar-link group", active && "sidebar-link-active", collapsed && "justify-center px-2")} title={collapsed ? item.label : undefined}>
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{item.badge}</span>}
              {!collapsed && item.expandable && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">SRL</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">SERVELECT SRL <span className="text-emerald-400">●</span></div>
                <div className="text-xs text-slate-400">Rol: Administrator</div>
                <div className="text-xs text-emerald-400">Plan: Enterprise</div>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Scurtături</div>
            {[
              ["Harta proiecte", Database],
              ["Rapoarte", BarChart3],
              ["Documente", FileText],
              ["Setări rapide", Cog]
            ].map(([label, Icon]) => (
              <div key={String(label)} className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-slate-300">
                {typeof Icon !== "string" && <Icon className="h-4 w-4" />}
                <span>{String(label)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onToggle} className="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 hover:bg-white/5">
        <Menu className="h-5 w-5" />
        {!collapsed && <span>Restrânge meniul</span>}
      </button>
    </aside>
  );
}
