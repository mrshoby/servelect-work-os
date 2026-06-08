"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Database, GitBranch, Layers3, LockKeyhole, RefreshCw, RotateCcw, ShieldCheck, SlidersHorizontal, UploadCloud, Zap } from "lucide-react";
import {
  getV58CutoverPayload,
  getV58StatusByDomain,
  simulateV58Mutation,
  v58AdapterLanes,
  v58CutoverWaves,
  v58MutationContracts,
  v58RollbackDrills,
  v58SeedParityChecks,
  v58StatusMetrics,
  type V58Domain,
  type V58Readiness,
  type V58RiskTone
} from "@/lib/enterprise/work-os-prisma-cutover";

const readinessClass: Record<V58Readiness, string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
  shadow: "border-blue-200 bg-blue-50 text-blue-800"
};

const riskClass: Record<V58RiskTone, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800"
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "lanes", label: "Adapter lanes" },
  { id: "mutations", label: "Mutation contracts" },
  { id: "parity", label: "Seed parity" },
  { id: "rollback", label: "Rollback" },
  { id: "waves", label: "Cutover waves" },
  { id: "status", label: "Status %" }
] as const;

type TabId = (typeof tabs)[number]["id"];

type Props = {
  mode?: "work-os" | "admin" | "audit" | "parity" | "rollback";
};

function Bar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs font-semibold text-slate-500"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${Math.max(5, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function ShellCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function V58ControlledPrismaCutover({ mode = "work-os" }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(mode === "audit" ? "mutations" : mode === "parity" ? "parity" : mode === "rollback" ? "rollback" : "overview");
  const [selectedDomain, setSelectedDomain] = useState<V58Domain>("tasks");
  const [selectedMutation, setSelectedMutation] = useState(v58MutationContracts[0]?.id ?? "");

  const payload = useMemo(() => getV58CutoverPayload(), []);
  const domainDetails = useMemo(() => getV58StatusByDomain(selectedDomain), [selectedDomain]);
  const mutationPreview = useMemo(() => simulateV58Mutation(selectedMutation), [selectedMutation]);
  const summary = payload.summary;
  const isAdmin = mode === "admin";

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#071826] via-[#0B1F2A] to-[#0B8F43] p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
              <Database className="h-4 w-4" /> SERVELECT WORK OS · v5.8.0
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">Controlled Prisma Cutover, Seed Parity & Live Mutation Audit</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 md:text-base">
                Strat major de trecere controlată de la mock/local/API la Prisma/PostgreSQL: adapter lanes, seed parity, mutation contracts,
                rollback drills, audit live și wave plan. Rămâne task-first: fiecare mutație este legată de proiecte, taskuri, materiale,
                aprobări, IoT, mentenanță și audit.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Production ready" value={`${summary.scores.productionReady}%`} sub="scor calculat din parity/mutations/rollback" />
              <Metric label="Seed parity" value={`${summary.scores.seedParity}%`} sub={`${summary.totals.totalRecords} records mapate`} />
              <Metric label="Mutation coverage" value={`${summary.scores.mutationCoverage}%`} sub={`${summary.totals.mutationContracts} contracts`} />
              <Metric label="Rollback coverage" value={`${summary.scores.rollbackCoverage}%`} sub={`${summary.totals.rollbackDrills} drills`} />
            </div>
          </div>
          <div className="min-w-[280px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/20 p-3"><ShieldCheck className="h-6 w-6 text-emerald-200" /></div>
              <div>
                <div className="text-sm font-black">Write mode</div>
                <div className="text-2xl font-black uppercase">{summary.writeMode}</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-200">Scrierile reale rămân blocate până când SERVELECT_WORK_OS_WRITE_MODE este setat intenționat. v5.8 adaugă control și audit, nu activează periculos producția.</p>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              <MiniStat label="Ready" value={summary.readiness.ready} />
              <MiniStat label="Warn" value={summary.readiness.warnings} />
              <MiniStat label="Block" value={summary.readiness.blocked} />
              <MiniStat label="Shadow" value={summary.readiness.shadow} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${activeTab === tab.id ? "bg-[#0B8F43] text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <ShellCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cutover command map</h2>
                <p className="text-sm text-slate-500">Domeniile principale Work OS și starea lor pentru Prisma/PostgreSQL.</p>
              </div>
              <Link href="/api/v1/work-os/prisma-cutover" className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">API payload</Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {v58AdapterLanes.map((lane) => (
                <button key={lane.id} onClick={() => setSelectedDomain(lane.domain)} className={`text-left rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${selectedDomain === lane.domain ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-slate-900">{lane.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{lane.currentAdapter} → {lane.targetAdapter} · {lane.prismaModel}</div>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${readinessClass[lane.readiness]}`}>{lane.readiness}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                    <Bar value={lane.parityPercent} label="Parity" />
                    <Bar value={lane.mutationCoveragePercent} label="Mutations" />
                    <Bar value={lane.rollbackCoveragePercent} label="Rollback" />
                  </div>
                </button>
              ))}
            </div>
          </ShellCard>

          <ShellCard>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Layers3 className="h-6 w-6" /></div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Domain detail</h2>
                <p className="text-sm text-slate-500">{selectedDomain}</p>
              </div>
            </div>
            {domainDetails.lane && (
              <div className="mt-5 space-y-4">
                <Info label="Owner" value={domainDetails.lane.owner} />
                <Info label="Route" value={domainDetails.lane.route} />
                <Info label="Prisma model" value={domainDetails.lane.prismaModel} />
                <Info label="Seed file" value={domainDetails.lane.seedFile} />
                <Info label="Next action" value={domainDetails.lane.nextAction} />
                <div>
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Blockers</div>
                  <div className="space-y-2">
                    {domainDetails.lane.blockers.length ? domainDetails.lane.blockers.map((blocker) => <div key={blocker} className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{blocker}</div>) : <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Fără blockers critici pentru shadow/pilot.</div>}
                  </div>
                </div>
              </div>
            )}
          </ShellCard>
        </div>
      )}

      {activeTab === "lanes" && (
        <ShellCard>
          <div className="mb-4 flex items-center gap-3"><Database className="h-6 w-6 text-emerald-600" /><div><h2 className="text-xl font-black">Adapter lanes</h2><p className="text-sm text-slate-500">Mock/local/API → Prisma/PostgreSQL, pe fiecare domeniu.</p></div></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="py-3">Domain</th><th>Adapter</th><th>Records</th><th>Parity</th><th>Mutation</th><th>Rollback</th><th>Write</th><th>Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {v58AdapterLanes.map((lane) => (
                  <tr key={lane.id} className="align-top">
                    <td className="py-4"><div className="font-black text-slate-900">{lane.domain}</div><div className="text-xs text-slate-500">{lane.owner}</div></td>
                    <td><div className="font-semibold">{lane.currentAdapter} → {lane.targetAdapter}</div><div className="text-xs text-slate-500">{lane.prismaModel}</div></td>
                    <td>{lane.sourceRecords} → {lane.targetRecords}</td>
                    <td className="w-40"><Bar value={lane.parityPercent} /></td>
                    <td className="w-40"><Bar value={lane.mutationCoveragePercent} /></td>
                    <td className="w-40"><Bar value={lane.rollbackCoveragePercent} /></td>
                    <td><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black uppercase text-slate-700">{lane.writeMode}</span></td>
                    <td><span className={`rounded-full border px-2 py-1 text-xs font-black uppercase ${readinessClass[lane.readiness]}`}>{lane.readiness}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ShellCard>
      )}

      {activeTab === "mutations" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <ShellCard>
            <div className="mb-4 flex items-center gap-3"><SlidersHorizontal className="h-6 w-6 text-blue-600" /><div><h2 className="text-xl font-black">Mutation contracts</h2><p className="text-sm text-slate-500">Contracte write-safe, auditabile, rollback-ready.</p></div></div>
            <div className="grid gap-3">
              {v58MutationContracts.map((contract) => (
                <button key={contract.id} onClick={() => setSelectedMutation(contract.id)} className={`rounded-2xl border p-4 text-left transition hover:shadow-md ${selectedMutation === contract.id ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div><div className="font-black text-slate-900">{contract.title}</div><div className="mt-1 text-xs text-slate-500">{contract.method} {contract.endpoint}</div></div>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-black uppercase text-white">{contract.state}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-3"><div>Perm: <b>{contract.requiredPermission}</b></div><div>Audit: <b>{contract.auditEvent}</b></div><div>Key: <b>{contract.idempotencyKey}</b></div></div>
                </button>
              ))}
            </div>
          </ShellCard>
          <ShellCard>
            <div className="flex items-center gap-3"><LockKeyhole className="h-6 w-6 text-amber-600" /><div><h2 className="text-xl font-black">Mutation simulation</h2><p className="text-sm text-slate-500">Preview shadow-safe pentru contractul selectat.</p></div></div>
            <pre className="mt-4 max-h-[620px] overflow-auto rounded-3xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify(mutationPreview, null, 2)}</pre>
          </ShellCard>
        </div>
      )}

      {activeTab === "parity" && (
        <ShellCard>
          <div className="mb-4 flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-600" /><div><h2 className="text-xl font-black">Seed parity dashboard</h2><p className="text-sm text-slate-500">Mock data, seed candidates și API parity per domeniu.</p></div></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {v58SeedParityChecks.map((check) => (
              <div key={check.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{check.label}</div><div className="text-xs text-slate-500">{check.evidence}</div></div><span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${readinessClass[check.status]}`}>{check.status}</span></div>
                <div className="mt-4"><Bar value={check.parityPercent} label="Seed parity" /></div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><MiniBox label="Mock" value={check.mockCount} /><MiniBox label="Seed" value={check.seedCount} /><MiniBox label="API" value={check.apiCount} /></div>
              </div>
            ))}
          </div>
        </ShellCard>
      )}

      {activeTab === "rollback" && (
        <ShellCard>
          <div className="mb-4 flex items-center gap-3"><RotateCcw className="h-6 w-6 text-purple-600" /><div><h2 className="text-xl font-black">Rollback center</h2><p className="text-sm text-slate-500">Drill-uri concrete înainte de orice write pilot/production.</p></div></div>
          <div className="grid gap-4 xl:grid-cols-2">
            {v58RollbackDrills.map((drill) => (
              <div key={drill.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{drill.title}</div><div className="text-xs text-slate-500">RPO {drill.rpoMinutes}m · RTO {drill.rtoMinutes}m · {drill.drillStatus}</div></div><span className={`rounded-full px-2 py-1 text-xs font-black uppercase ${riskClass[drill.risk]}`}>{drill.risk}</span></div>
                <div className="mt-4"><Bar value={drill.coveragePercent} label="Coverage" /></div>
                <ol className="mt-4 space-y-2 text-sm text-slate-600">
                  {drill.steps.map((step, index) => <li key={step} className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black">{index + 1}</span>{step}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </ShellCard>
      )}

      {activeTab === "waves" && (
        <ShellCard>
          <div className="mb-4 flex items-center gap-3"><GitBranch className="h-6 w-6 text-emerald-600" /><div><h2 className="text-xl font-black">Cutover waves</h2><p className="text-sm text-slate-500">Plan mare de activare controlată pe domenii, nu un switch riscant.</p></div></div>
          <div className="space-y-4">
            {v58CutoverWaves.map((wave) => (
              <div key={wave.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><div className="text-lg font-black text-slate-900">{wave.title}</div><div className="text-sm text-slate-500">{wave.date} · {wave.goal}</div></div><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${readinessClass[wave.gate]}`}>{wave.gate}</span></div>
                <div className="mt-4 flex flex-wrap gap-2">{wave.domains.map((domain) => <span key={domain} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{domain}</span>)}</div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">{wave.exitCriteria.map((criteria) => <div key={criteria} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{criteria}</div>)}</div>
              </div>
            ))}
          </div>
        </ShellCard>
      )}

      {activeTab === "status" && (
        <ShellCard>
          <div className="mb-4 flex items-center gap-3"><Activity className="h-6 w-6 text-emerald-600" /><div><h2 className="text-xl font-black">Status/procente vizibile pe site</h2><p className="text-sm text-slate-500">Procente estimate din cod + funcționalități vizibile, păstrate pentru roadmap.</p></div></div>
          <div className="grid gap-4 md:grid-cols-2">
            {v58StatusMetrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-start justify-between"><div><div className="font-black text-slate-900">{metric.label}</div><div className="mt-1 text-sm text-slate-500">{metric.note}</div></div><span className="text-2xl font-black text-emerald-700">{metric.percent}%</span></div>
                <Bar value={metric.percent} />
              </div>
            ))}
          </div>
        </ShellCard>
      )}

      {isAdmin && (
        <ShellCard className="border-amber-200 bg-amber-50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-amber-700" /><div><h2 className="text-xl font-black text-amber-950">Admin safety gate</h2><p className="text-sm text-amber-800">v5.8 nu activează automat writes reale. Fiecare domeniu trebuie să treacă prin parity, mutation contract, rollback drill și approval.</p></div></div>
            <div className="flex flex-wrap gap-2"><Link href="/work-os/prisma-cutover" className="rounded-2xl bg-amber-900 px-4 py-2 text-sm font-black text-white">Open Work OS view</Link><Link href="/api/v1/work-os/prisma-cutover/status" className="rounded-2xl border border-amber-300 px-4 py-2 text-sm font-black text-amber-900">Status API</Link></div>
          </div>
        </ShellCard>
      )}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded-3xl border border-white/15 bg-white/10 p-4"><div className="text-xs font-bold uppercase tracking-wider text-slate-300">{label}</div><div className="mt-2 text-3xl font-black">{value}</div><div className="mt-1 text-xs text-slate-300">{sub}</div></div>;
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white/10 p-2"><div className="text-lg font-black">{value}</div><div className="text-[10px] font-bold uppercase text-slate-300">{label}</div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 px-3 py-2"><div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</div><div className="text-sm font-bold text-slate-800">{value}</div></div>;
}

function MiniBox({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white p-3"><div className="text-lg font-black text-slate-900">{value}</div><div className="text-[10px] font-bold uppercase text-slate-400">{label}</div></div>;
}
