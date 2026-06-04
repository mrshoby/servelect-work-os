"use client";

import { useMemo, useState } from "react";
import { Bell, Check, ChevronDown, Command, HelpCircle, Plus, Search, Sparkles } from "lucide-react";
import { notifications } from "@servelect/shared";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Topbar({ collapsed }: { collapsed: boolean }) {
  const unread = useMemo(() => notifications.filter((n) => !n.read).length, []);
  const [query, setQuery] = useState("");

  return (
    <header className={collapsed ? "sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur lg:left-[86px]" : "sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur lg:left-[292px]"}>
      <div className="mx-auto flex h-20 max-w-[1780px] items-center gap-4 px-4 sm:px-6 lg:px-7">
        <div className="hidden min-w-0 flex-1 md:block">
          <div className="input-shell max-w-[620px]">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută proiecte, taskuri, clienți, echipamente..."
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
            />
            <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500"><Command className="h-3 w-3" />K</span>
          </div>
        </div>

        <button className="btn-secondary hidden sm:inline-flex"><Sparkles className="h-4 w-4" /> AI Brief</button>
        <button className="btn-primary"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">Adaugă nou</span></button>

        <button className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-servelect-600 text-[11px] font-bold text-white">{unread}</span>
        </button>
        <button className="hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-50 sm:block">
          <HelpCircle className="h-5 w-5" />
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm hover:bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-600 text-xs font-bold text-white">AP</div>
              <div className="hidden text-left lg:block">
                <div className="text-sm font-bold leading-4">Andrei Popescu</div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm outline-none hover:bg-slate-50">Profilul meu</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm outline-none hover:bg-slate-50">Setări workspace</DropdownMenu.Item>
            <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm outline-none hover:bg-slate-50">Notificări</DropdownMenu.Item>
            <div className="my-2 h-px bg-slate-100" />
            <DropdownMenu.Item className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-servelect-700 outline-none hover:bg-servelect-50"><Check className="h-4 w-4" /> Sistem operațional</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
