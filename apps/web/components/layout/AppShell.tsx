"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("servelect-shell-collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem("servelect-shell-collapsed", next ? "1" : "0");
      return next;
    });
  }

  if (pathname?.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[318px] max-w-[88vw]" onClick={(event) => event.stopPropagation()}>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute left-[268px] top-4 grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-800 shadow-xl"
              aria-label="Închide meniul"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <main className={collapsed ? "transition-all duration-300 lg:pl-[86px]" : "transition-all duration-300 lg:pl-[304px]"}>
        <Topbar collapsed={collapsed} onMobileMenu={() => setMobileOpen(true)} />
        <div className="mx-auto w-full max-w-[1800px] px-4 py-5 pb-28 sm:px-6 lg:px-7 lg:pb-8">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}


