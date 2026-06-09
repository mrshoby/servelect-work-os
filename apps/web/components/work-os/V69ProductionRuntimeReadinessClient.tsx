"use client";

import { useMemo, useState } from "react";
import {
  getV69RuntimeSummary,
  v69GateTone,
  type V69DeploymentStage,
  type V69GateStatus,
  type V69RuntimeDomain,
} from "../../lib/enterprise/work-os-v69-production-runtime-readiness";

type V69View = "runtime" | "deployment" | "admin";

const statusLabels: Record<V69GateStatus, string> = {
  passed: "PASS",
  warning: "WARNING",
  blocked: "BLOCKED",
  manual: "MANUAL",
};

const domainLabels: Record<V69RuntimeDomain, string> = {
  taskuri: "Taskuri",
  globalCommand: "Global Command",
  persistenceApi: "Persistence API",
  notifications: "Notificări",
  approvals: "Aprobări",
  projects: "Proiecte",
  crm: "CRM",
  stock: "Stoc",
  iot: "IoT",
  pontaj: "Pontaj",
  documents: "Documente",
};

const stageLabels: Record<V69DeploymentStage, string> = {
  local: "Local QA",
  github: "GitHub",
  "vercel-preview": "Vercel Preview",
  "vercel-production": "Vercel Production",
  "post-deploy": "Post deploy",
};

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function toneClasses(status: V69GateStatus) {
  const tone = v69GateTone(status);
  if (tone === "emerald") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  return "border-sky-200 bg-sky-50 text-sky-800";
}

function MetricCard({ label, value, status }: { label: string; value: string; status: V69GateStatus }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <span className={classNames("mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-black", toneClasses(status))}>{statusLabels[status]}</span>
    </article>
  );
}

function CommandBox({ command }: { command: string }) {
  return <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-950 p-3 text-xs text-emerald-100">{command}</pre>;
}

export function V69ProductionRuntimeReadinessClient({ view = "runtime" }: { view?: V69View }) {
  const summary = useMemo(() => getV69RuntimeSummary(), []);
  const [domainFilter, setDomainFilter] = useState<"all" | V69RuntimeDomain>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | V69GateStatus>("all");
  const [routeArea, setRouteArea] = useState<"all" | "taskuri" | "global" | "persistence" | "admin" | "api">("all");

  const filteredGates = summary.gates.filter((gate) => {
    const domainOk = domainFilter === "all" || gate.domain === domainFilter;
    const statusOk = statusFilter === "all" || gate.status === statusFilter;
    return domainOk && statusOk;
  });

  const filteredRoutes = summary.routes.filter((route) => routeArea === "all" || route.area === routeArea);

  const title = view === "deployment" ? "Deployment Command Center" : view === "admin" ? "Admin Production Runtime" : "Production Runtime Readiness";
  const eyebrow = view === "deployment" ? "GitHub → Vercel → Production" : view === "admin" ? "Governance / Gates / Evidence" : "SERVELECT WORK OS · v6.9.0";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950 lg:px-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 lg:text-5xl">{title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              v6.9.0 adaugă un command center de producție pentru ca fiecare build să aibă traseu clar: QA local, commit/push GitHub, deploy automat Vercel, verificare rute și blocaje pentru persistence/API. Serverul local rămâne doar pentru testare, nu pentru deploy public.
            </p>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Release score</p>
            <p className="mt-2 text-5xl font-black">{summary.releaseScore}%</p>
            <p className="mt-2 text-sm text-slate-300">{summary.release}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summary.metrics.map((metric) => <MetricCard key={metric.label} label={metric.label} value={metric.value} status={metric.tone} />)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Runtime gates</h2>
              <p className="text-sm text-slate-500">Gates reale pentru a evita builduri aplicate local dar nepuse pe GitHub/Vercel.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={domainFilter} onChange={(event) => setDomainFilter(event.target.value as "all" | V69RuntimeDomain)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <option value="all">Toate domeniile</option>
                {(Object.keys(domainLabels) as V69RuntimeDomain[]).map((domain) => <option key={domain} value={domain}>{domainLabels[domain]}</option>)}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | V69GateStatus)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <option value="all">Toate statusurile</option>
                {(Object.keys(statusLabels) as V69GateStatus[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredGates.map((gate) => (
              <article key={gate.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{domainLabels[gate.domain]} · risc {gate.risk}</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">{gate.title}</h3>
                  </div>
                  <span className={classNames("rounded-full border px-3 py-1 text-[11px] font-black", toneClasses(gate.status))}>{statusLabels[gate.status]}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{gate.description}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Owner: {gate.owner}</p>
                <div className="mt-3 rounded-2xl bg-white p-3 text-xs text-slate-600">
                  <strong className="text-slate-900">Evidence</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {gate.evidence.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">Next: {gate.nextAction}</div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Deployment steps</h2>
            <p className="mt-1 text-sm text-slate-500">Pașii corecți pentru GitHub + Vercel.</p>
            <div className="mt-4 space-y-3">
              {summary.deploymentSteps.map((step) => (
                <article key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-slate-900">{step.title}</strong>
                    <span className={classNames("rounded-full border px-2 py-1 text-[10px] font-black", toneClasses(step.status))}>{statusLabels[step.status]}</span>
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{stageLabels[step.stage]} · {step.automatedByVercel ? "Vercel poate automatiza" : "manual/local"}</p>
                  <CommandBox command={step.command} />
                  <p className="mt-2 text-xs text-slate-500">Rezultat așteptat: {step.expectedResult}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black">Next build candidates</h2>
            <div className="mt-4 space-y-3">
              {summary.nextBuildCandidates.map((candidate) => <p key={candidate} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">{candidate}</p>)}
            </div>
          </section>
        </aside>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Route probes</h2>
            <p className="text-sm text-slate-500">Rutele care trebuie să răspundă 200 local și apoi pe Vercel production URL.</p>
          </div>
          <select value={routeArea} onChange={(event) => setRouteArea(event.target.value as "all" | "taskuri" | "global" | "persistence" | "admin" | "api")} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <option value="all">Toate ariile</option>
            <option value="taskuri">Taskuri</option>
            <option value="global">Global</option>
            <option value="persistence">Persistence</option>
            <option value="admin">Admin</option>
            <option value="api">API</option>
          </select>
        </div>
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr><th className="px-4 py-3">Route</th><th className="px-4 py-3">Area</th><th className="px-4 py-3">Expected</th><th className="px-4 py-3">Required</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRoutes.map((route) => (
                <tr key={route.route}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{route.route}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{route.area}</td>
                  <td className="px-4 py-3 text-slate-600">HTTP {route.expectedStatus}</td>
                  <td className="px-4 py-3"><span className={classNames("rounded-full px-2 py-1 text-[11px] font-black", route.required ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>{route.required ? "YES" : "NO"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default V69ProductionRuntimeReadinessClient;
