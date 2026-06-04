"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { energyCurve } from "@servelect/shared";

export function EnergyChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "h-48 w-full" : "h-72 w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={energyCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="energy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0B8F43" stopOpacity={0.28}/>
              <stop offset="95%" stopColor="#0B8F43" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94A3B8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
          <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #E2E8F0", boxShadow: "0 12px 30px rgba(15,23,42,.08)" }} />
          <Area type="monotone" dataKey="real" name="Real" stroke="#0B8F43" strokeWidth={2.2} fill="url(#energy)" />
          <Area type="monotone" dataKey="estimate" name="Estimat" stroke="#2563EB" strokeDasharray="5 5" strokeWidth={1.8} fill="transparent" />
          <Area type="monotone" dataKey="yesterday" name="Ieri" stroke="#94A3B8" strokeWidth={1.4} fill="transparent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
