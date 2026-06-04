"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ClipboardList, Home, Plus, UserRound } from "lucide-react";
import { cn } from "@servelect/shared";

const items = [
  { href: "/", label: "Acasă", icon: Home },
  { href: "/taskuri", label: "Taskuri", icon: ClipboardList },
  { href: "/taskuri", label: "Nou", icon: Plus, primary: true },
  { href: "/iot", label: "Alerte", icon: Bell },
  { href: "/hr-admin", label: "Profil", icon: UserRound }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-14px_40px_rgba(15,23,42,.10)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black text-slate-500 transition",
                active && !item.primary && "bg-emerald-50 text-servelect-700",
                item.primary && "-mt-5 bg-servelect-600 text-white shadow-[0_18px_35px_rgba(0,132,61,.32)]"
              )}
            >
              <span className={cn("grid place-items-center rounded-xl", item.primary ? "h-11 w-11" : "h-6 w-6")}>
                <Icon className={item.primary ? "h-5 w-5" : "h-4 w-4"} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
