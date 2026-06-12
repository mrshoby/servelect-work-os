"use client";

import { useEffect, useMemo, useState } from "react";
import {
  V75_STORAGE_KEY,
  addAccessRule,
  addAttachment,
  createConflict,
  createV75RuntimeState,
  deleteAttachment,
  resolveConflict,
  v75GlobalScores,
  v75ProgressScores,
  type V75RuntimeState
} from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export type V75View = "overview" | "conflicts" | "access" | "attachments" | "task" | "ticket" | "forms" | "timesheets" | "workload" | "automations" | "reports" | "admin";

type Tab = { id: V75View; label: string; route: string };

const tabs: Tab[] = [
  { id: "overview", label: "Conflict overview", route: "/work-os/conflict-resolution" },
  { id: "conflicts", label: "Conflict resolution", route: "/work-os/conflict-resolution" },
  { id: "access", label: "Access inheritance", route: "/admin/access-inheritance" },
  { id: "attachments", label: "Attachments", route: "/work-os/attachments" },
  { id: "task", label: "Task files", route: "/taskuri/overview" },
  { id: "ticket", label: "Ticket files", route: "/taskuri/tickets-notificari" },
  { id: "forms", label: "Request files", route: "/taskuri/forms" },
  { id: "timesheets", label: "Timesheets", route: "/taskuri/timesheets" },
  { id: "workload", label: "Workload", route: "/taskuri/workload-aprobari" },
  { id: "automations", label: "Automations", route: "/taskuri/automations" },
  { id: "reports", label: "Reports", route: "/taskuri/reports" },
  { id: "admin", label: "Admin gates", route: "/admin/access-inheritance" }
];

function loadState(): V75RuntimeState {
  if (typeof window === "undefined") return createV75RuntimeState();
  const raw = window.localStorage.getItem(V75_STORAGE_KEY);
  if (!raw) return createV75RuntimeState();
  try {
    const parsed = JSON.parse(raw) as V75RuntimeState;
    return parsed.version === "7.5.0" ? parsed : createV75RuntimeState();
  } catch {
    return createV75RuntimeState();
  }
}

function Badge({ status }: { status: string }) {
  const tone = status === "passed" || status === "merged" || status === "verified" || status === "stored_shadow" ? "bg-emerald-50 text-emerald-700" : status === "blocked" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-[11px] font-black ${tone}`}>{status}</span>;
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-black text-slate-950">{title}</h2>{action}</div>{children}</section>;
}

function SmallButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-black text-emerald-700 hover:bg-emerald-50" onClick={onClick}>{children}</button>;
}

export function V75ConflictAccessAttachmentsClient({ view = "overview" }: { view?: V75View }) {
  const [state, setState] = useState<V75RuntimeState>(() => createV75RuntimeState());
  const [mounted, setMounted] = useState(false);
  const scores = useMemo(() => v75GlobalScores(), []);
  const progress = useMemo(() => v75ProgressScores(), []);
  const activeConflicts = state.conflicts.filter((item) => item.status === "open");
  const storedAttachments = state.attachments.filter((item) => item.status !== "deleted");

  useEffect(() => { setState(loadState()); setMounted(true); }, []);
  useEffect(() => { if (mounted) window.localStorage.setItem(V75_STORAGE_KEY, JSON.stringify(state)); }, [mounted, state]);

  const save = (next: V75RuntimeState) => setState(next);

  return <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 lg:px-10">
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.45em] text-emerald-600">SERVELECT WORK OS · v7.5.0</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">Conflict Resolution, Access Inheritance & Real Attachment Storage</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">v7.5.0 curăță direcția după v7.4.0: adaugă conflict merge UI, moștenire de acces workspace → proiect → task/ticket și metadate de atașamente R2/S3-ready. Primary Prisma writes rămân gated.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-black">Runtime status</p>
          <p>v{state.version} loaded. Conflict/access/attachment shadow mode active.</p>
          <select className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2" value={state.writeMode} onChange={() => undefined}>
            <option value="conflict_access_attachment_shadow">conflict_access_attachment_shadow</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        {[ ["GOODDAY PARITY", scores.goodDayParity + "%"], ["BACKEND/API", scores.backendApiReal + "%"], ["PRODUCTION", scores.productionReadiness + "%"], ["CONFLICTS", String(activeConflicts.length)], ["ACL RULES", String(state.accessRules.length)], ["ATTACHMENTS", String(storedAttachments.length)], ["AUDIT", String(state.auditEvents.length)] ].map(([label, value]) => <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={label}><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => <a key={tab.id} href={tab.route} className={`rounded-full border px-4 py-2 text-sm font-black ${view === tab.id ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-800"}`}>{tab.label}</a>)}
      </div>
    </section>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {(view === "overview" || view === "admin") && <Card title={view === "admin" ? "Production gates and NEXT_BUILD_PLAN" : "v7.5 readiness"} action={<SmallButton onClick={() => save(addAccessRule(addAttachment(createConflict(state))))}>Run full v7.5 QA action</SmallButton>}>
          {view === "admin" ? <pre className="max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-5 text-emerald-100">{JSON.stringify({ readiness: { version: state.version, mode: state.writeMode, openConflicts: activeConflicts.length, accessRules: state.accessRules.length, attachments: storedAttachments.length, primaryWrites: "gated", nextBuild: "v7.6.0 - Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API" }, scores, nextBuild: "v7.6.0" }, null, 2)}</pre> : <div className="grid gap-3 md:grid-cols-2">{state.gates.map((gate) => <div key={gate.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black">{gate.label}</p><Badge status={gate.status} /></div><p className="mt-2 text-sm text-slate-600">{gate.evidence}</p><p className="mt-2 text-xs text-slate-500">Next: {gate.nextAction}</p></div>)}</div>}
        </Card>}

        {view === "conflicts" && <Card title="Optimistic conflict resolution" action={<SmallButton onClick={() => save(createConflict(state))}>Create conflict</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.conflicts.map((conflict) => <div key={conflict.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{conflict.entityId}</p><p className="text-sm text-slate-600">local v{conflict.localVersion} · remote v{conflict.remoteVersion}</p></div><Badge status={conflict.status} /></div><p className="mt-2 text-xs text-slate-500">{conflict.localHash} / {conflict.remoteHash}</p><div className="mt-3 flex flex-wrap gap-2"><SmallButton onClick={() => save(resolveConflict(state, conflict.id, "merge"))}>Merge</SmallButton><SmallButton onClick={() => save(resolveConflict(state, conflict.id, "keep_local"))}>Keep local</SmallButton><SmallButton onClick={() => save(resolveConflict(state, conflict.id, "keep_remote"))}>Keep remote</SmallButton></div></div>)}</div>
        </Card>}

        {view === "access" && <Card title="Access inheritance rules" action={<SmallButton onClick={() => save(addAccessRule(state))}>Add inherited rule</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.accessRules.map((rule) => <div key={rule.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black">{rule.scope}:{rule.scopeId}</p><Badge status={rule.effect} /></div><p className="mt-1 text-sm text-slate-600">{rule.principalType} · {rule.principalId}</p><p className="mt-2 text-xs text-slate-500">Inherited from: {rule.inheritedFrom ?? "root"}</p><div className="mt-3 flex flex-wrap gap-1">{rule.permissions.map((permission) => <span key={permission} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold">{permission}</span>)}</div></div>)}</div>
        </Card>}

        {(view === "attachments" || view === "task" || view === "ticket" || view === "forms") && <Card title="R2/S3-ready attachment storage" action={<SmallButton onClick={() => save(addAttachment(state, { entity: view === "ticket" ? "ticket" : "task", entityId: view === "ticket" ? "TCK-401" : "SWO-1001" }))}>Add attachment metadata</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.attachments.map((attachment) => <div key={attachment.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{attachment.fileName}</p><p className="text-sm text-slate-600">{attachment.entity} · {attachment.entityId}</p></div><Badge status={attachment.status} /></div><p className="mt-2 text-xs text-slate-500">{attachment.provider} · {attachment.bucket}/{attachment.objectKey}</p><p className="mt-1 text-xs text-slate-500">{attachment.checksum} · {Math.round(attachment.sizeBytes / 1024)} KB</p><div className="mt-3 flex gap-2"><SmallButton onClick={() => save(appendDownloadAudit(state, attachment.id))}>Download check</SmallButton><SmallButton onClick={() => save(deleteAttachment(state, attachment.id))}>Delete check</SmallButton></div></div>)}</div>
        </Card>}

        {(view === "timesheets" || view === "workload" || view === "automations" || view === "reports") && <Card title="Downstream evidence after conflict/access/storage layer">
          <div className="grid gap-3 md:grid-cols-2">{progress.slice(0, 8).map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{row.category}</p><span className="font-black text-emerald-700">{row.current}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.progress}</p></div>)}</div>
        </Card>}
      </div>

      <aside className="space-y-6">
        <Card title="Audit stream"><div className="space-y-3">{state.auditEvents.length === 0 ? <p className="text-sm text-slate-500">Nu există mutații în această sesiune.</p> : state.auditEvents.slice(0, 8).map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 p-3"><p className="font-black">{event.title}</p><p className="text-xs text-slate-500">{event.type} · {event.entityId}</p></div>)}</div></Card>
        <Card title="Progress after v7.5.0"><div className="space-y-3">{progress.slice(0, 8).map((row) => <div key={row.category}><div className="flex justify-between gap-2 text-xs font-black"><span>{row.category}</span><span>{row.current}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-1 text-[11px] text-slate-500">{row.progress}</p></div>)}</div></Card>
        <Card title="Current gaps"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>Primary Prisma writes remain gated.</li><li>Signed R2/S3 upload/download URLs are next.</li><li>Email/push/websocket providers are not active.</li><li>Field-level conflict merge needs deeper task drawer UI.</li></ul></Card>
      </aside>
    </div>
  </main>;
}

function appendDownloadAudit(state: V75RuntimeState, attachmentId: string): V75RuntimeState {
  const attachment = state.attachments.find((item) => item.id === attachmentId);
  return {
    ...state,
    auditEvents: [{ id: `audit_${Date.now()}`, type: "download", title: "Attachment download permission checked", entityId: attachment?.entityId ?? attachmentId, actorId: "u_andrei", createdAt: new Date().toISOString(), evidence: attachment?.canDownload ? "Download allowed by inherited access rule." : "Download blocked by access rule." }, ...state.auditEvents]
  };
}
