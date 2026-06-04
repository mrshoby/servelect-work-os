"use client";

import { useMemo } from "react";
import { energyCurve } from "@servelect/shared";

export function EnergyChart({ compact = false }: { compact?: boolean }) {
  const chart = useMemo(() => {
    const data = energyCurve.slice(0, compact ? 16 : energyCurve.length);
    const width = 640;
    const height = compact ? 180 : 260;
    const max = Math.max(...data.map((d) => Math.max(d.real, d.estimate, d.yesterday)), 1);

    const line = (key: "real" | "estimate" | "yesterday") =>
      data
        .map((d, i) => {
          const x = (i / Math.max(data.length - 1, 1)) * width;
          const y = height - 28 - (d[key] / max) * (height - 56);
          return `${x},${y}`;
        })
        .join(" ");

    return { data, width, height, real: line("real"), estimate: line("estimate"), yesterday: line("yesterday") };
  }, [compact]);

  return (
    <div className={compact ? "h-48 w-full" : "h-72 w-full"}>
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-full w-full overflow-visible" aria-label="Grafic producție energie">
        <defs>
          <linearGradient id="energy-lite-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B8F43" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0B8F43" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }).map((_, i) => {
          const y = 20 + i * ((chart.height - 50) / 4);
          return <line key={i} x1="0" x2={chart.width} y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="5 6" />;
        })}

        <polyline points={`0,${chart.height - 28} ${chart.real} ${chart.width},${chart.height - 28}`} fill="url(#energy-lite-fill)" stroke="none" />
        <polyline points={chart.yesterday} fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <polyline points={chart.estimate} fill="none" stroke="#2563EB" strokeWidth="2.4" strokeDasharray="7 7" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        <polyline points={chart.real} fill="none" stroke="#0B8F43" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />

        {chart.data.filter((_, i) => i % 4 === 0).map((d, i) => (
          <text key={d.time} x={i * 160} y={chart.height - 6} fill="#94A3B8" fontSize="11">
            {d.time}
          </text>
        ))}
      </svg>
    </div>
  );
}
