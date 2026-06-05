"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  Command,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { notifications, projects, users } from "@servelect/shared";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatar: string;
  team: string;
  permissionsCount: number;
};

type SessionPayload = {
  user: SessionUser;
  role: string;
  isAuthenticated: boolean;
  authMode: "demo" | "cookie";
  requireAuth: boolean;
};

export function Topbar({
  collapsed: _collapsed,
  onMobileMenu
}: {
  collapsed: boolean;
  onMobileMenu?: () => void;
}) {
  const router = useRouter();
  const unread = useMemo(() => notifications.filter((notification) => !notification.read).length, []);
  const [query, setQuery] = useState("");
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/v1/auth/session")
      .then((response) => response.json())
      .then((payload) => {
        if (active && payload?.ok) setSession(payload.data as SessionPayload);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => undefined);
    setSession((value) => (value ? { ...value, isAuthenticated: false, authMode: "demo" } : value));
    router.refresh();
  }

  const currentUser =
    session?.user ??
    ({
      id: "demo",
      name: "Andrei Popescu",
      email: "andrei.popescu@servelect.ro",
      role: "Administrator",
      title: "Manager proiect",
      avatar: "AP",
      team: "Operations",
      permissionsCount: 19
    } satisfies SessionUser);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const projectResults = projects
      .filter((project) => `${project.code} ${project.name} ${project.clientName}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((project) => ({ label: project.name, meta: project.code, href: "/proiecte" }));

    const peopleResults = users
      .filter((user) => `${user.name} ${user.role} ${user.team}`.toLowerCase().includes(q))
      .slice(0, 2)
      .map((user) => ({ label: user.name, meta: user.title, href: "/echipa" }));

    return [...projectResults, ...peopleResults];
  }, [query]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          onClick={onMobileMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
          aria-label="Deschide meniul"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative min-w-0 flex-1">
          <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută proiecte, taskuri, clienți, echipamente..."
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            />
            <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-black text-slate-400 sm:flex">
              <Command className="h-3 w-3" />K
            </div>
          </div>

          {searchResults.length > 0 ? (
            <div className="absolute left-0 right-0 top-13 z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
              {searchResults.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => setQuery("")}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-400">{item.meta}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="hidden h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 xl:inline-flex">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              AI Brief
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="px-2 py-2 text-sm font-black text-slate-950">Rezumat operațional</div>
            <div className="space-y-2">
              <BriefLine>7 alerte IoT pot genera taskuri de mentenanță.</BriefLine>
              <BriefLine>3 proiecte au milestone în următoarele 48h.</BriefLine>
              <BriefLine>Workload ridicat pe echipa de teren.</BriefLine>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-servelect-600 px-3 text-sm font-black text-white shadow-sm transition hover:bg-servelect-700">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adaugă</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-emerald-50">Task / subtask</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-emerald-50">Proiect nou</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-emerald-50">Ticket / alarmă</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
              <Bell className="h-5 w-5" />
              {unread > 0 ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unread}</span> : null}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 w-96 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-2">
              <div className="text-sm font-black text-slate-950">Notificări</div>
              <div className="text-xs font-bold text-emerald-600">{unread} noi</div>
            </div>
            <div className="max-h-80 space-y-2 overflow-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-sm font-black text-slate-900">{notification.title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{notification.body}</div>
                </div>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 shadow-sm transition hover:bg-slate-50">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{currentUser.avatar}</div>
              <div className="hidden text-left lg:block">
                <div className="text-xs font-black text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] font-semibold text-slate-500">{currentUser.role}</div>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">{currentUser.avatar}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black text-slate-950">{currentUser.name}</div>
                <div className="truncate text-xs font-semibold text-slate-500">{currentUser.email}</div>
                <div className="mt-1 text-[11px] font-bold text-emerald-700">{currentUser.role} · {currentUser.permissionsCount} permisiuni</div>
              </div>
            </div>
            <DropdownItem icon={ShieldCheck}>Schimbă utilizatorul</DropdownItem>
            <DropdownItem icon={Settings}>Setări workspace</DropdownItem>
            <DropdownItem icon={HelpCircle}>Sistem operațional</DropdownItem>
            <button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-red-600 outline-none hover:bg-red-50">
              <LogOut className="h-4 w-4" />Logout demo
            </button>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}

function BriefLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{children}</span>
    </div>
  );
}

function DropdownItem({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <DropdownMenu.Item className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50">
      <Icon className="h-4 w-4 text-slate-400" />
      {children}
    </DropdownMenu.Item>
  );
}
