"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Database, RefreshCw, Wifi, WifiOff } from "lucide-react";

type BridgeState = {
  loading: boolean;
  ok: boolean;
  message: string;
  taskCount?: number;
  boardColumns?: number;
  updatedAt?: string;
};

async function readJson(path: string) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

export function TaskApiBridgeBanner() {
  const [state, setState] = useState<BridgeState>({ loading: true, ok: false, message: "Verific API bridge..." });

  async function refresh() {
    setState((value) => ({ ...value, loading: true }));

    try {
      const [tasksPayload, boardPayload] = await Promise.allSettled([
        readJson("/api/v1/tasks"),
        readJson("/api/v1/tasks/board-state")
      ]);

      const tasksOk = tasksPayload.status === "fulfilled";
      const boardOk = boardPayload.status === "fulfilled";

      const taskCount = tasksOk
        ? Array.isArray(tasksPayload.value?.data)
          ? tasksPayload.value.data.length
          : Array.isArray(tasksPayload.value?.tasks)
            ? tasksPayload.value.tasks.length
            : Array.isArray(tasksPayload.value)
              ? tasksPayload.value.length
              : undefined
        : undefined;

      const boardColumns = boardOk
        ? Array.isArray(boardPayload.value?.columns)
          ? boardPayload.value.columns.length
          : Array.isArray(boardPayload.value?.data?.columns)
            ? boardPayload.value.data.columns.length
            : undefined
        : undefined;

      setState({
        loading: false,
        ok: tasksOk || boardOk,
        message: tasksOk || boardOk ? "API bridge activ cu fallback local" : "API bridge indisponibil, fallback local activ",
        taskCount,
        boardColumns,
        updatedAt: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })
      });
    } catch (error) {
      setState({
        loading: false,
        ok: false,
        message: error instanceof Error ? error.message : "API bridge indisponibil",
        updatedAt: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })
      });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const tone = useMemo(() => {
    if (state.loading) return "border-blue-200 bg-blue-50 text-blue-800";
    if (state.ok) return "border-emerald-200 bg-emerald-50 text-emerald-800";
    return "border-amber-200 bg-amber-50 text-amber-800";
  }, [state.loading, state.ok]);

  const Icon = state.loading ? RefreshCw : state.ok ? Wifi : WifiOff;

  return (
    <section className={`mb-4 rounded-[1.5rem] border p-4 shadow-sm ${tone}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm">
            <Icon className={`h-5 w-5 ${state.loading ? "animate-spin" : ""}`} />
          </div>
          <div>
            <div className="text-sm font-black">Task Page API Bridge · v2.8</div>
            <p className="mt-1 text-sm font-semibold opacity-85">{state.message}</p>
            <p className="mt-1 text-xs font-semibold opacity-70">
              Interfața rămâne aceeași. API-ul este verificat în siguranță, iar Zustand/localStorage rămâne fallback până la DB writes reale.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 ring-1 ring-current/10">
            <Activity className="h-3.5 w-3.5" /> Tasks: {state.taskCount ?? "fallback"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 ring-1 ring-current/10">
            <Database className="h-3.5 w-3.5" /> Columns: {state.boardColumns ?? "local"}
          </span>
          <button onClick={refresh} className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
            Recheck
          </button>
        </div>
      </div>
    </section>
  );
}
