"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  Command,
  HelpCircle,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Zap
} from "lucide-react";
import { notifications, projects, users } from "@servelect/shared";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const pageMeta: Record<string, { title: string; section: string }> = {
  "/": { title: "Command Center", section: "Work OS" },
  "/proiecte": { title: "Proiecte", section: "Work OS" },
  "/taskuri": { title: "Taskuri", section: "Work OS" },
  "/calendar": { title: "Calendar", section: "Planificare" },
  "/echipa": { title: "Echipă / Workload", section: "Resurse" },
  "/crm": { title: "CRM & Vânzări", section: "Operațiuni" },
  "/iot": { title: "Monitorizare IoT", section: "Energie" },
  "/echipamente": { title: "Echipamente", section: "Logistică" },
  "/mentenanta": { title: "Mentenanță", section: "Dispatch" },
  "/finantari-esg": { title: "Finanțări & ESG", section: "Conformitate" },
  "/documente": { title: "Documente", section: "Company" },
  "/rapoarte": { title: "Rapoarte", section: "BI" },
  "/hr-admin": { title: "HR & Administrare", section: "Admin" },
  "/mobile": { title: "Mobile Preview", section: "Field OS" }
};

export function Topbar({ collapsed, onMobileMenu }: { collapsed: boolean; onMobileMenu?: () => void }) {
  const pathname = usePathname();
  const unread = useMemo(() => notifications.filter((n) => !n.read).length, []);
  const [query, setQuery] = useState("");

  const meta = pageMeta[pathname] ?? { title: "SERVELECT EMP", section: "Workspace" };
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-[76px] max-w-[1800px] items-center gap-3 px-4 sm:px-6 lg:px-7">
        <button
          onClick={onMobileMenu}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
          aria-label="Deschide meniul"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400 md:flex">
            <span>SERVELECT EMP</span>
            <span>/</span>
            <span className="text-servelect-600">{meta.section}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-3">
            <h1 className="truncate text-base font-black tracking-tight text-slate-950 md:text-xl">{meta.title}</h1>
            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100 sm:inline-flex">
              Live
            </span>
          </div>
        </div>

        <div className="relative hidden w-full max-w-[620px] lg:block">
          <div className="input-shell h-11 rounded-2xl bg-slate-50/80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută proiecte, taskuri, clienți, echipamente..."
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="ml-auto inline-flex items-center gap-1 rounded-xl bg-white px-2 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
              <Command className="h-3 w-3" />K
            </span>
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-[3.5rem] z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
              {searchResults.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-slate-50">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-400">{item.meta}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex">
              <Sparkles className="h-4 w-4 text-servelect-600" />
              AI Brief
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 mt-2 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="px-2 pb-2 text-sm font-black text-slate-950">Rezumat operațional</div>
            <div className="space-y-2">
              <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">7 alerte IoT pot genera taskuri de mentenanță.</div>
              <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-900">3 proiecte au milestone în următoarele 48h.</div>
              <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">Workload ridicat pe echipa de teren.</div>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="btn-primary h-11 rounded-2xl px-3 sm:px-4">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adaugă nou</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 mt-2 w-72 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            <Link href="/taskuri" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
              <Check className="h-4 w-4 text-servelect-600" /> Task / subtask
            </Link>
            <Link href="/proiecte" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
              <Zap className="h-4 w-4 text-servelect-600" /> Proiect nou
            </Link>
            <Link href="/mentenanta" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
              <Bell className="h-4 w-4 text-red-500" /> Ticket / alarmă
            </Link>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-servelect-600 text-[11px] font-black text-white">{unread}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 mt-2 w-96 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="font-black text-slate-950">Notificări</div>
              <span className="text-xs font-bold text-servelect-600">{unread} noi</span>
            </div>
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl px-3 py-3 text-sm hover:bg-slate-50">
                <div className="font-black text-slate-900">{notification.title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{notification.body}</div>
              </div>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <button className="hidden h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:grid">
          <HelpCircle className="h-5 w-5" />
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 shadow-sm transition hover:bg-slate-50">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-950 to-slate-600 text-xs font-black text-white">AP</div>
              <div className="hidden text-left xl:block">
                <div className="text-sm font-black leading-4">Andrei Popescu</div>
                <div className="text-xs font-semibold text-slate-500">Administrator</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 mt-2 w-72 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-slate-50">Profilul meu</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-slate-50">Setări workspace</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-2xl px-3 py-2 text-sm font-bold outline-none hover:bg-slate-50">Notificări</DropdownMenu.Item>
            <div className="my-2 h-px bg-slate-100" />
            <DropdownMenu.Item className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-servelect-700 outline-none hover:bg-servelect-50">
              <Settings className="h-4 w-4" /> Sistem operațional
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
