"use client";

import { useMemo, useState } from "react";
import {
  getV68GlobalPersistenceHealth,
  getV68ReadinessTone,
  type V68DomainAdapter,
  type V68PersistenceMode,
} from "../../lib/enterprise/work-os-v68-persistence-api-unification";

const modeLabel: Record<V68PersistenceMode, string> = {
  localStorage: "Local mock / localStorage",
  apiAdapter: "API adapter",
  prismaShadow: "Prisma shadow",
  prismaPrimary: "Prisma primary",
};

const toneClass = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blue: "border-sky-200 bg-sky-50 text-sky-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-800",
};

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function ProgressBar({ value }: { value: number }) {
  const tone = getV68ReadinessTone(value);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={classNames(
          "h-full rounded-full transition-all",
          tone === "green" && "bg-emerald-500",
          tone === "blue" && "bg-sky-500",
          tone === "amber" && "bg-amber-500",
          tone === "red" && "bg-red-500",
        )}
        style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

function DomainCard({ domain }: { domain: V68DomainAdapter & { score: number; tone: keyof typeof toneClass } }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{domain.id}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{domain.label}</h3>
          <p className="mt-1 text-sm text-slate-500">Owner: {domain.owner}</p>
        </div>
        <span className={classNames("rounded-full border px-3 py-1 text-xs font-bold", toneClass[domain.tone])}>{domain.score}%</span>
      </div>

      <div className="mt-4">
        <ProgressBar value={domain.score} />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{modeLabel[domain.currentMode]}</span>
          <span>Țintă: {modeLabel[domain.targetMode]}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {[
          ["Read model", domain.readModelReady],
          ["Write model", domain.writeModelReady],
          ["Audit", domain.mutationAuditReady],
          ["RBAC", domain.rbacReady],
          ["Rollback", domain.rollbackReady],
        ].map(([label, ok]) => (
          <span key={String(label)} className={classNames("rounded-2xl border px-3 py-2 font-semibold", ok ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500")}>
            {ok ? "✓" : "•"} {label}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
        <div className="flex items-center justify-between"><span>Entități</span><strong>{domain.entityCount}</strong></div>
        <div className="mt-1 flex items-center justify-between"><span>Mutații 24h</span><strong>{domain.mutationCount24h}</strong></div>
        <div className="mt-1 flex items-center justify-between"><span>Failure rate</span><strong>{domain.failureRate}%</strong></div>
      </div>

      {domain.blockers.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <strong>Blockere:</strong>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {domain.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function V68RealPersistenceApiUnificationClient() {
  const health = useMemo(() => getV68GlobalPersistenceHealth(), []);
  const [selectedMode, setSelectedMode] = useState<"all" | V68PersistenceMode>("all");
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  const filteredDomains = health.domains.filter((domain) => {
    const modeOk = selectedMode === "all" || domain.currentMode === selectedMode || domain.targetMode === selectedMode;
    const blockedOk = !showBlockedOnly || domain.blockers.length > 0 || domain.score < 70;
    return modeOk && blockedOk;
  });

  const highRiskContracts = health.contracts.filter((contract) => contract.status !== "ready");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950 lg:px-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">SERVELECT WORK OS · v6.8.0</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 lg:text-5xl">Real Persistence / API Unification</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Buildul v6.8.0 pune un strat operațional peste mock/localStorage, API adapters și viitorul Prisma. Scopul este să fie clar ce domenii pot trece spre shadow writes, ce rămâne blocat și ce mutații au audit/RBAC/rollback înainte de DB real.
            </p>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-3xl bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-slate-400">Readiness</p>
              <p className="mt-2 text-3xl font-black">{health.averageReadiness}%</p>
            </div>
            <div className="rounded-3xl bg-emerald-600 p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100">Shadow ready</p>
              <p className="mt-2 text-3xl font-black">{health.readyForShadow}</p>
            </div>
            <div className="rounded-3xl bg-amber-500 p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-amber-100">Blocked</p>
              <p className="mt-2 text-3xl font-black">{health.blocked}</p>
            </div>
            <div className="rounded-3xl bg-sky-600 p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-sky-100">Mutations 24h</p>
              <p className="mt-2 text-3xl font-black">{health.totalMutations}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Domain adapter switchboard</h2>
              <p className="text-sm text-slate-500">Filtrează domeniile după mod de persistență și blocaje.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "localStorage", "apiAdapter", "prismaShadow", "prismaPrimary"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className={classNames(
                    "rounded-full border px-3 py-2 text-xs font-bold transition",
                    selectedMode === mode ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {mode === "all" ? "Toate" : modeLabel[mode]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowBlockedOnly((value) => !value)}
                className={classNames(
                  "rounded-full border px-3 py-2 text-xs font-bold transition",
                  showBlockedOnly ? "border-amber-500 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
              >
                Doar riscuri/blocaje
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredDomains.map((domain) => <DomainCard key={domain.id} domain={domain} />)}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Mutation contracts</h2>
            <p className="mt-1 text-sm text-slate-500">Contracte minime pentru mutații reale: RBAC, audit și rollback.</p>
            <div className="mt-4 space-y-3">
              {health.contracts.map((contract) => (
                <article key={contract.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-slate-900">{contract.action}</strong>
                    <span className={classNames("rounded-full px-2 py-1 text-[11px] font-black uppercase", contract.status === "ready" ? "bg-emerald-100 text-emerald-700" : contract.status === "shadow" ? "bg-sky-100 text-sky-700" : "bg-red-100 text-red-700")}>{contract.status}</span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-500">{contract.method} {contract.route}</p>
                  <p className="mt-2 text-xs text-slate-500">RBAC: {contract.rbacGate}</p>
                  <p className="mt-1 text-xs text-slate-500">Audit: {contract.auditEvent}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Command gates</h2>
            <div className="mt-4 space-y-3">
              {health.commands.map((command) => (
                <article key={command.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-slate-900">{command.label}</strong>
                    <span className={classNames("rounded-full px-2 py-1 text-[11px] font-black uppercase", command.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>{command.enabled ? "ON" : "OFF"}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{command.description}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Afectează: {command.affects.join(", ")}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black">Next gates</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {health.nextGates.map((gate) => <li key={gate} className="rounded-2xl bg-white/5 p-3">{gate}</li>)}
            </ul>
            <p className="mt-4 text-xs text-slate-500">High-risk contracts: {highRiskContracts.length}</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
