"use client";

import { type LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@servelect/shared";

const toneMap = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700", stroke: "#0B8F43" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", stroke: "#2563EB" },
  orange: { bg: "bg-amber-50", text: "text-amber-700", stroke: "#F59E0B" },
  red: { bg: "bg-red-50", text: "text-red-700", stroke: "#EF4444" },
  purple: { bg: "bg-violet-50", text: "text-violet-700", stroke: "#7C3AED" }
};

type Tone = keyof typeof toneMap;

const spark = [18, 24, 21, 29, 34, 31, 38, 42, 40, 48, 53, 50, 58];

export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  tone = "green"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  trend: string;
  tone?: Tone;
}) {
  const t = toneMap[tone];
  const points = spark.map((v, i) => `${(i / (spark.length - 1)) * 112},${62 - v}`).join(" ");

  return (
    <div className="card-tight min-h-[132px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", t.bg, t.text)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</div>
            <div className="text-xs text-slate-500">{sub}</div>
          </div>
        </div>

        <svg viewBox="0 0 112 64" className="h-16 w-28 overflow-visible" aria-hidden="true">
          <polyline
            points={`0,64 ${points} 112,64`}
            fill={t.stroke}
            opacity="0.08"
          />
          <polyline
            points={points}
            fill="none"
            stroke={t.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <TrendingUp className="h-4 w-4" />
        {trend}
      </div>
    </div>
  );
}
