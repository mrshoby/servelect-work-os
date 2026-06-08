"use client";

import { useMemo, useState } from "react";
import type { V57DataAdapter, V57Domain, V57MutationContract, V57MutationQueueItem, V57SourceMap } from "@/lib/enterprise/work-os-data-switchboard";
import { WorkOsBadge, WorkOsCard, WorkOsMetric, WorkOsProgress } from "@/components/work-os/WorkOsBlocks";

type SwitchboardPayload = {
  version: string;
  title: string;
  writeMode: string;
  prismaEnabled: boolean;
  readiness: number;
  summary: {
    adapters: number;
    activeAdapters: number;
    mutationContracts: number;
    readyMutations: number;
    queuedMutations: number;
    blockedQueue: number;
    sourceMaps: number;
    linkedRecords: number;
  };
  adapters: V57DataAdapter[];
  sourceMaps: V57SourceMap[];
  mutationContracts: V57MutationContract[];
  mutationQueue: V57MutationQueueItem[];
  nextRecommendedVersion: { version: string; title: string; focus: string };
};

const domainLabels: Record<V57Domain, string> = {
  tasks: "Taskuri",
  projects: "Proiecte",
  pontaj: "Pontaj",
  materials: "Materiale",
  approvals: "Aprobări",
  iot: "IoT",
  maintenance: "Mentenanță",
  users: "Utilizatori",
  documents: "Documente",
  reports: "Rapoarte"
};

function toneForStatus(status: string) {
  if (["active", "ready", "validated"].includes(status)) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (["shadow", "shadowed", "queued"].includes(status)) return "border-blue-200 bg-blue-50 text-blue-800";
  if (status === "blocked") return "border-red-200 bg-red-50 text-red-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function Pill({ value }: { value: string }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${toneForStatus(value)}`}>{value}</span>;
}

export function V57DatabaseAdapterSwitchboard({ payload }: { payload: SwitchboardPayload }) {
  const [domain, setDomain] = useState<V57Domain | "all">("all");
  const [selectedAdapter, setSelectedAdapter] = useState(payload.adapters[0]?.id ?? "");
  const [mutationPreview, setMutationPreview] = useState("Nu a fost generat încă niciun preview de mutație.");

  const filteredSources = useMemo(() => payload.sourceMaps.filter((item) => domain === "all" || item.domain === domain), [domain, payload.sourceMaps]);
  const filteredContracts = useMemo(() => payload.mutationContracts.filter((item) => domain === "all" || item.domain === domain), [domain, payload.mutationContracts]);
  const selected = payload.adapters.find((item) => item.id === selectedAdapter) ?? payload.adapters[0];

  async function createShadowPreview(contract: V57MutationContract) {
    setMutationPreview(JSON.stringify({ loading: true, contract: contract.id }, null, 2));
    try {
      const response = await fetch("/api/v1/work-os/data-switchboard/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: contract.domain,
          title: contract.title,
          adapter: contract.adapter,
          actor: "Vlad Taran / Admin demo",
          payloadSummary: `${contract.verb} via ${contract.route}`
        })
      });
      const json = await response.json();
      setMutationPreview(JSON.stringify(json, null, 2));
    } catch (error) {
      setMutationPreview(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, null, 2));
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <WorkOsMetric label="Readiness DB switchboard" value={`${payload.readiness}%`} hint="Scor calculat din coverage adapters, source maps, mutation contracts și queue blockers." />
        <WorkOsMetric label="Adapters" value={`${payload.summary.activeAdapters}/${payload.summary.adapters}`} hint="Active/ready/shadow adapters disponibile pentru Work OS." />
        <WorkOsMetric label="Mutation contracts" value={`${payload.summary.readyMutations}/${payload.summary.mutationContracts}`} hint="Contracte create pentru taskuri, materiale, aprobări, IoT și comentarii." />
        <WorkOsMetric label="Queued mutations" value={payload.summary.queuedMutations} hint="Queue shadow-safe pentru acțiuni reale viitoare." />
        <WorkOsMetric label="Linked records" value={payload.summary.linkedRecords} hint="Recorduri operaționale legate de tasks/projects/stoc/IoT/tickete." />
      </section>

      <WorkOsCard title="Adapter switchboard" subtitle="Panoul central care decide de unde se citește fiecare domeniu Work OS și unde se pot scrie mutații reale, shadow sau queued.">
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <div className="space-y-3">
            {payload.adapters.map((adapter) => (
              <button
                key={adapter.id}
                type="button"
                onClick={() => setSelectedAdapter(adapter.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedAdapter === adapter.id ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-950">{adapter.title}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{adapter.kind} · {adapter.owner}</div>
                  </div>
                  <Pill value={adapter.status} />
                </div>
                <div className="mt-3"><WorkOsProgress value={adapter.coverage} /></div>
                <p className="mt-3 text-xs leading-5 text-slate-600">{adapter.evidence}</p>
              </button>
            ))}
          </div>

          {selected ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">selected adapter</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">{selected.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{selected.nextAction}</p>
                </div>
                <div className="flex flex-wrap gap-2"><Pill value={selected.writeMode} /><Pill value={selected.risk} /></div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Source</div>
                  <div className="mt-2 text-sm font-black text-slate-800">{selected.source}</div>
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Target</div>
                  <div className="mt-2 text-sm font-black text-slate-800">{selected.target}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.domains.map((item) => <WorkOsBadge key={item} value={domainLabels[item]} />)}
              </div>
            </div>
          ) : null}
        </div>
      </WorkOsCard>

      <WorkOsCard title="Source maps pe domenii" subtitle="Fiecare modul rămâne parte din Work OS: taskuri, proiecte, pontaj, materiale, aprobări, IoT și mentenanță sunt legate prin aceleași contracte.">
        <div className="mb-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setDomain("all")} className={`rounded-full px-4 py-2 text-xs font-black ${domain === "all" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>Toate</button>
          {Object.entries(domainLabels).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setDomain(id as V57Domain)} className={`rounded-full px-4 py-2 text-xs font-black ${domain === id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}>{label}</button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Domeniu</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Primary source</th>
                <th className="px-4 py-3">Fallback</th>
                <th className="px-4 py-3">Write gate</th>
                <th className="px-4 py-3">API</th>
                <th className="px-4 py-3">Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredSources.map((source) => (
                <tr key={source.domain}>
                  <td className="px-4 py-4 font-black text-slate-950">{domainLabels[source.domain]}</td>
                  <td className="px-4 py-4 text-slate-700">{source.records}</td>
                  <td className="px-4 py-4 text-slate-700">{source.primarySource}</td>
                  <td className="px-4 py-4 text-slate-500">{source.fallbackSource}</td>
                  <td className="px-4 py-4"><Pill value={source.writeGate} /></td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{source.apiRoute}</td>
                  <td className="px-4 py-4"><WorkOsProgress value={source.readiness} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkOsCard>

      <section className="grid gap-4 xl:grid-cols-[1fr_460px]">
        <WorkOsCard title="Mutation contracts" subtitle="Contracte de mutație cu write-mode, rollback, audit event și permisiune necesară. Butoanele generează preview shadow-safe.">
          <div className="space-y-3">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-950">{contract.title}</div>
                    <div className="mt-1 font-mono text-xs text-slate-500">{contract.route}</div>
                  </div>
                  <div className="flex flex-wrap gap-2"><Pill value={contract.status} /><Pill value={contract.writeMode} /></div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-black uppercase text-slate-400">Audit</div><div className="mt-1 text-xs font-bold text-slate-700">{contract.auditEvent}</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-black uppercase text-slate-400">Permisiune</div><div className="mt-1 text-xs font-bold text-slate-700">{contract.requiredPermission}</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-black uppercase text-slate-400">Rollback</div><div className="mt-1 text-xs font-bold text-slate-700">disponibil</div></div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">{contract.rollback}</p>
                <button type="button" onClick={() => createShadowPreview(contract)} className="mt-4 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800">
                  Generează preview mutație
                </button>
              </div>
            ))}
          </div>
        </WorkOsCard>

        <WorkOsCard title="Shadow mutation preview" subtitle="Rezultatul POST-ului trece prin API-ul v5.7. În mod implicit nu scrie în producție.">
          <pre className="max-h-[620px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{mutationPreview}</pre>
        </WorkOsCard>
      </section>

      <WorkOsCard title="Mutation queue operațională" subtitle="Coadă unificată pentru taskuri, materiale, aprobări, pontaj și alerte IoT. Aici se vede ce e ready, shadowed, queued sau blocat.">
        <div className="grid gap-3 lg:grid-cols-2">
          {payload.mutationQueue.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-950">{item.title}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{domainLabels[item.domain]} · {item.actor}</div>
                </div>
                <Pill value={item.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.payloadSummary}</p>
              <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">{item.safety}</p>
            </div>
          ))}
        </div>
      </WorkOsCard>
    </div>
  );
}
