"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className={collapsed ? "lg:pl-[86px] transition-all" : "lg:pl-[292px] transition-all"}>
        <Topbar collapsed={collapsed} />
        <div className="mx-auto w-full max-w-[1780px] px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </div>
      </main>
    </div>
  );
}
