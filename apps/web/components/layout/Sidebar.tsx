"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
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
  Users,
  Wrench,
  Zap,
  type LucideIcon
} from "lucide-react";
import { cn } from "@servelect/shared";

interface SidebarChild {
  href: string;
  label: string;
}

interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  expandable?: boolean;
  children?: SidebarChild[];
}

const taskChildren: SidebarChild[] = [
  { href: "/taskuri", label: "Overview" },
  { href: "/taskuri/my-work", label: "My Work" },
  { href: "/taskuri/inbox", label: "Inbox" },
  { href: "/taskuri/tickets", label: "Tickets" },
  { href: "/taskuri/proiecte-active", label: "Proiecte active" },
  { href: "/taskuri/proiecte-viitoare", label: "Proiecte viitoare" },
  { href: "/taskuri/proiecte-finalizate", label: "Proiecte finalizate" },
  { href: "/taskuri/board", label: "Board" },
  { href: "/taskuri/tabel", label: "Tabel" },
  { href: "/taskuri/calendar", label: "Calendar" },
  { href: "/taskuri/workload", label: "Workload" }
];

const items: SidebarItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/proiecte", label: "Proiecte", icon: FolderKanban, expandable: true },
  { href: "/taskuri", label: "Taskuri", icon: ClipboardList, expandable: true, children: taskChildren },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, expandable: true },
  { href: "/echipa", label: "Echipă", icon: Users, expandable: true },
  { href: "/crm", label: "CRM & Vânzări", icon: BriefcaseBusiness, expandable: true },
  { href: "/iot", label: "Monitorizare IoT", icon: Gauge, expandable: true },
  { href: "/echipamente", label: "Echipamente", icon: PackageOpen, expandable: true },
  { href: "/mentenanta", label: "Mentenanță", icon: Wrench, expandable: true },
  { href: "/finantari-esg", label: "Finanțări & ESG", icon: ShieldCheck, expandable: true },
  { href: "/documente", label: "Documente", icon: FileText },
  { href: "/rapoarte", label: "Rapoarte", icon: BarChart3 },
  { href: "/hr-admin", label: "Administrare", icon: Cog, expandable: true }
];

const shortcuts: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/work-os/goodday-compliance", label: "GoodDay audit", icon: ShieldCheck },
  { href: "/work-os/department-command", label: "Departamente", icon: Users },
  { href: "/work-os/workflow-automation", label: "Automatizări", icon: Bell },
  { href: "/documente", label: "Documente", icon: FileText }
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const taskAreaActive = pathname === "/taskuri" || pathname.startsWith("/taskuri/");

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#071826] text-white shadow-2xl transition-all lg:flex lg:flex-col", collapsed ? "w-[86px]" : "w-[292px]")}> 
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-lg"><Zap className="h-6 w-6 fill-white/20" /></div>
        {!collapsed ? <div><div className="text-xl font-extrabold tracking-tight">SERVELECT <span className="font-semibold text-slate-300">EMP</span></div><div className="text-xs text-emerald-400">Work OS</div></div> : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const showChildren = !collapsed && item.children && taskAreaActive;
          return (
            <div key={item.href}>
              <Link href={item.href} className={cn("sidebar-link group", active && "sidebar-link-active", collapsed && "justify-center px-2")} title={collapsed ? item.label : undefined}>
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}
                {!collapsed && item.children ? <ChevronDown className="h-4 w-4 text-emerald-200" /> : null}
                {!collapsed && item.expandable && !item.children ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
              </Link>
              {showChildren ? (
                <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                  {(item.children ?? []).map((child) => {
                    const childActive = pathname === child.href;
                    return <Link key={child.href} href={child.href} className={cn("block rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white", childActive && "bg-emerald-600/80 text-white shadow-sm")}>{child.label}</Link>;
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="px-4 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">SRL</div><div className="min-w-0"><div className="truncate text-sm font-bold">SERVELECT SRL <span className="text-emerald-400">●</span></div><div className="text-xs text-slate-400">Rol: Super Admin</div><div className="text-xs text-emerald-400">Plan: Enterprise</div></div></div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Scurtături</div>
            {shortcuts.map((shortcut) => <Shortcut key={shortcut.href} href={shortcut.href} label={shortcut.label} icon={shortcut.icon} />)}
          </div>
        </div>
      ) : null}

      <button onClick={onToggle} className="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 hover:bg-white/5"><Menu className="h-5 w-5" />{!collapsed ? <span>Restrânge meniul</span> : null}</button>
    </aside>
  );
}

function Shortcut({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-slate-300 hover:text-white">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
