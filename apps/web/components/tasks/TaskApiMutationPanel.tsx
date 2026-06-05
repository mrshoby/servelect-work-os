"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Plus, RefreshCw, Send, ShieldAlert } from "lucide-react";

type ApiTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  assigneeName?: string;
  dueDate?: string;
  trackedHours?: number;
  estimateHours?: number;
};

type ApiProject = {
  id: string;
  code?: string;
  name: string;
};

type ApiState = "idle" | "loading" | "saving" | "error" | "ready";

const statusOptions = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorityOptions = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];

async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `Request failed: ${response.status}`);
  return data;
}

export function TaskApiMutationPanel() {
  const [state, setState] = useState<ApiState>("idle");
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [title, setTitle] = useState("Verificare API task nou");
  const [priority, setPriority] = useState("Mediu");
  const [status, setStatus] = useState("De făcut");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [message, setMessage] = useState("API bridge pregătit. Provider curent: mock-memory, DB writes reale încă OFF.");

  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0], [selectedTaskId, tasks]);
  const firstProject = projects[0];

  async function refresh() {
    setState("loading");
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        readJson<{ ok: boolean; tasks: ApiTask[] }>("/api/v1/tasks"),
        readJson<{ ok: boolean; projects: ApiProject[] }>("/api/v1/projects")
      ]);

      const nextTasks = taskResponse.tasks ?? [];
      setTasks(nextTasks);
      setProjects(projectResponse.projects ?? []);
      if (!selectedTaskId && nextTasks[0]) setSelectedTaskId(nextTasks[0].id);
      setMessage(`API refresh OK: ${nextTasks.length} taskuri citite din /api/v1/tasks.`);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nu am putut citi taskurile din API.");
      setState("error");
    }
  }

  async function createTask() {
    if (!title.trim()) {
      setMessage("Titlul este obligatoriu pentru create task.");
      setState("error");
      return;
    }

    setState("saving");
    try {
      const response = await readJson<{ ok: boolean; task: ApiTask }>("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          priority,
          status,
          projectId: firstProject?.id,
          description: "Task creat din UI v2.9 Real Task Create/Update API UI Activation.",
          tags: ["v2.9", "api-ui"]
        })
      });

      setMessage(`Task creat prin API: ${response.task.title}`);
      setSelectedTaskId(response.task.id);
      await refresh();
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Create task a eșuat.");
      setState("error");
    }
  }

  async function updateSelectedTask() {
    const task = selectedTask;
    if (!task) {
      setMessage("Nu există task selectat pentru update.");
      setState("error");
      return;
    }

    setState("saving");
    try {
      const nextStatus = task.status === "În lucru" ? "Review / QA" : "În lucru";
      const response = await readJson<{ ok: boolean; task: ApiTask }>("/api/v1/tasks", {
        method: "PATCH",
        body: JSON.stringify({
          id: task.id,
          patch: {
            status: nextStatus,
            customFields: {
              Source: "v2.9 API UI mutation",
              PreviousStatus: task.status
            }
          }
        })
      });

      setMessage(`Task actualizat prin API: ${response.task.title} → ${response.task.status}`);
      await refresh();
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update task a eșuat.");
      setState("error");
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBusy = state === "loading" || state === "saving";

  return (
    <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> v2.9 API UI active
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
              DB writes OFF
            </span>
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-950">Real Task Create / Update API UI</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Panou de activare pentru create/update task prin API. Interfața principală rămâne stabilă, iar providerul curent este mock-memory până la Prisma write-gate.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh API
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-black text-slate-950">Creează task prin API</div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_160px]">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Titlu task"
            />
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
              {statusOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={createTask}
            disabled={isBusy}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Creează prin API
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-black text-slate-950">Actualizează status task selectat</div>
          <select
            value={selectedTask?.id ?? ""}
            onChange={(event) => setSelectedTaskId(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
          >
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>{task.title} — {task.status}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={updateSelectedTask}
            disabled={isBusy || !selectedTask}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Trimite PATCH status
          </button>
        </div>
      </div>

      <div className={`mt-4 flex items-start gap-2 rounded-2xl border p-3 text-sm font-semibold ${state === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
        {state === "error" ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{message}</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_120px_120px] border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-400">
          <div>Task</div>
          <div>Status</div>
          <div>Prioritate</div>
        </div>
        <div className="max-h-64 overflow-auto">
          {tasks.slice(0, 8).map((task) => (
            <div key={task.id} className="grid grid-cols-[1.4fr_120px_120px] gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0">
              <div>
                <div className="font-bold text-slate-900">{task.title}</div>
                <div className="mt-1 text-xs text-slate-500">{task.projectCode} · {task.assigneeName ?? "neatribuit"}</div>
              </div>
              <div className="font-semibold text-slate-600">{task.status}</div>
              <div className="font-semibold text-slate-600">{task.priority}</div>
            </div>
          ))}
          {tasks.length === 0 && <div className="px-4 py-6 text-sm font-semibold text-slate-500">Nu există taskuri citite din API.</div>}
        </div>
      </div>
    </section>
  );
}
