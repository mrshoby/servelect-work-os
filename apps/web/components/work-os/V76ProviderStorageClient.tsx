"use client";

import { useEffect, useMemo, useState } from "react";
import {
  V76_STORAGE_KEY,
  type V76DeliveryProvider,
  type V76RuntimeState,
  createV76RuntimeState,
  deleteOrRestoreAttachment,
  evaluateAccess,
  requestSignedDownload,
  requestSignedUpload,
  runProviderDelivery,
  v76GlobalScores,
  v76ProgressScores
} from "@/lib/enterprise/work-os-v76-provider-storage";

export type V76View = "overview" | "attachments" | "providers" | "access" | "versions" | "task" | "ticket" | "forms" | "timesheets" | "workload" | "automations" | "reports" | "admin";

const viewLabels: Record<V76View, string> = {
  overview: "Provider overview",
  attachments: "Signed attachments",
  providers: "Provider delivery",
  access: "Access enforcement",
  versions: "File versions",
  task: "Task attachments",
  ticket: "Ticket uploads",
  forms: "Request uploads",
  timesheets: "Timesheet evidence",
  workload: "Access workload",
  automations: "Provider automations",
  reports: "Reports",
  admin: "Admin provider gates"
};

const tabs: { id: V76View; label: string; route: string }[] = [
  { id: "overview", label: "Provider overview", route: "/work-os/signed-attachments" },
  { id: "attachments", label: "Signed URLs", route: "/work-os/attachments" },
  { id: "providers", label: "Provider delivery", route: "/work-os/provider-delivery" },
  { id: "access", label: "Access guards", route: "/admin/access-enforced-mutations" },
  { id: "versions", label: "File versions", route: "/work-os/signed-attachments" },
  { id: "task", label: "Task files", route: "/taskuri/overview" },
  { id: "ticket", label: "Ticket files", route: "/taskuri/tickets-notificari" },
  { id: "forms", label: "Forms", route: "/taskuri/forms" },
  { id: "timesheets", label: "Timesheets", route: "/taskuri/timesheets" },
  { id: "workload", label: "Workload", route: "/taskuri/workload-aprobari" },
  { id: "automations", label: "Automations", route: "/taskuri/automations" },
  { id: "reports", label: "Reports", route: "/taskuri/reports" },
  { id: "admin", label: "Admin storage", route: "/admin/access-inheritance" }
];

function loadState(): V76RuntimeState {
  if (typeof window === "undefined") return createV76RuntimeState();
  const raw = window.localStorage.getItem(V76_STORAGE_KEY);
  if (!raw) return createV76RuntimeState();
  try {
    const parsed = JSON.parse(raw) as V76RuntimeState;
    return parsed.version === "7.6.0" ? parsed : createV76RuntimeState();
  } catch {
    return createV76RuntimeState();
  }
}

function Badge({ status }: { status: string }) {
  const color = status.includes("denied") || status.includes("blocked") || status.includes("failed") ? "bg-red-50 text-red-700" : status.includes("warning") || status.includes("queued") || status.includes("ready") ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>{status}</span>;
}

function SmallButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-50">{children}</button>;
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-2xl font-black tracking-tight">{title}</h2>{action}</div>{children}</section>;
}

export function V76ProviderStorageClient({ view = "overview" }: { view?: V76View }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<V76RuntimeState>(() => createV76RuntimeState());
  const scores = useMemo(() => v76GlobalScores(), []);
  const progress = useMemo(() => v76ProgressScores(), []);
  const activeSigned = state.signedUrls.filter((item) => item.status !== "deleted_shadow");
  const queuedDeliveries = state.deliveries.filter((item) => item.status === "queued" || item.status === "failed");
  const blockedGuards = state.mutationGuards.filter((item) => item.status === "blocked");

  useEffect(() => { setState(loadState()); setMounted(true); }, []);
  useEffect(() => { if (mounted) window.localStorage.setItem(V76_STORAGE_KEY, JSON.stringify(state)); }, [mounted, state]);
  const save = (next: V76RuntimeState) => setState(next);

  return <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 lg:px-10">
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.45em] text-emerald-600">SERVELECT WORK OS · v7.6.0</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">v7.6.0 continuă strict după v7.5.1: adaugă contracte signed upload/download pentru R2/S3, provider delivery switchboard și access enforcement înainte de mutații. Primary Prisma writes rămân gated.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-black">Runtime status</p>
          <p>v{state.version} loaded. Signed storage provider shadow active.</p>
          <select className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2" value={state.writeMode} onChange={() => undefined}>
            <option value="signed_storage_provider_shadow">signed_storage_provider_shadow</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        {[["GOODDAY PARITY", `${scores.goodDayParity}%`], ["BACKEND/API", `${scores.backendApiReal}%`], ["PRODUCTION", `${scores.productionReadiness}%`], ["SIGNED URLS", String(activeSigned.length)], ["QUEUE", String(queuedDeliveries.length)], ["BLOCKED", String(blockedGuards.length)], ["AUDIT", String(state.auditEvents.length)]].map(([label, value]) => <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={label}><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => <a key={tab.id} href={tab.route} className={`rounded-full border px-4 py-2 text-sm font-black ${view === tab.id ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-800"}`}>{tab.label}</a>)}
      </div>
    </section>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        {(view === "overview" || view === "admin") && <Card title={view === "admin" ? "Production gates and NEXT_BUILD_PLAN" : "Signed storage / provider readiness"} action={<SmallButton onClick={() => save(evaluateAccess(runProviderDelivery(requestSignedUpload(state))))}>Run full v7.6 QA action</SmallButton>}>
          {view === "admin" ? <pre className="max-h-[540px] overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-5 text-emerald-100">{JSON.stringify({ readiness: { version: state.version, mode: state.writeMode, signedUrls: activeSigned.length, queuedDeliveries: queuedDeliveries.length, blockedGuards: blockedGuards.length, primaryWrites: "gated", nextBuild: "v7.7.0 - Provider Rehearsal, Primary Write Dry Run & Observability" }, scores, nextBuild: "v7.7.0" }, null, 2)}</pre> : <div className="grid gap-3 md:grid-cols-2">{state.gates.map((gate) => <div key={gate.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black">{gate.label}</p><Badge status={gate.status} /></div><p className="mt-2 text-sm text-slate-600">{gate.evidence}</p><p className="mt-2 text-xs text-slate-500">Next: {gate.nextAction}</p></div>)}</div>}
        </Card>}

        {(view === "attachments" || view === "versions" || view === "task" || view === "ticket" || view === "forms") && <Card title="Signed upload/download URLs and file versions" action={<SmallButton onClick={() => save(requestSignedUpload(state, { entity: view === "ticket" ? "ticket" : "task", entityId: view === "ticket" ? "TCK-401" : "SWO-1001" }))}>Issue signed upload</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.signedUrls.map((attachment) => <div key={attachment.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{attachment.fileName}</p><p className="text-sm text-slate-600">{attachment.entity} · {attachment.entityId} · v{attachment.version}</p></div><Badge status={attachment.status} /></div><p className="mt-2 text-xs text-slate-500">{attachment.provider} · {attachment.bucket}/{attachment.objectKey}</p><p className="mt-1 text-xs text-slate-500">expires {new Date(attachment.expiresAt).toLocaleString()} · {attachment.checksum}</p><div className="mt-3 flex flex-wrap gap-2"><SmallButton onClick={() => save(requestSignedDownload(state, attachment.id))}>Signed download</SmallButton><SmallButton onClick={() => save(deleteOrRestoreAttachment(state, attachment.id))}>Delete / restore</SmallButton></div></div>)}</div>
        </Card>}

        {view === "providers" && <Card title="Provider delivery switchboard" action={<SmallButton onClick={() => save(runProviderDelivery(state, "email_ready"))}>Run worker tick</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.deliveries.map((delivery) => <div key={delivery.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{delivery.subject}</p><p className="text-sm text-slate-600">{delivery.provider} · {delivery.entity} · {delivery.entityId}</p></div><Badge status={delivery.status} /></div><p className="mt-2 text-xs text-slate-500">attempts {delivery.attempts}/{delivery.maxAttempts} · target {delivery.targetUserId}</p><div className="mt-3 flex gap-2"><SmallButton onClick={() => save(runProviderDelivery(state, delivery.provider))}>Process provider</SmallButton></div></div>)}</div>
        </Card>}

        {(view === "access" || view === "workload") && <Card title="Access inheritance enforced before mutation" action={<SmallButton onClick={() => save(evaluateAccess(state, { principalId: "Client Portal", action: "delete", entity: "attachment", entityId: "TCK-401" }))}>Check client delete</SmallButton>}>
          <div className="grid gap-3 md:grid-cols-2">{state.accessEvaluations.map((access) => <div key={access.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black">{access.principalId}</p><Badge status={access.decision} /></div><p className="mt-1 text-sm text-slate-600">{access.requestedAction} · {access.entity} · {access.entityId}</p><p className="mt-2 text-xs text-slate-500">Inherited from: {access.inheritedFrom}</p><p className="mt-2 text-xs text-slate-500">{access.reason}</p></div>)}</div>
        </Card>}

        {(view === "automations" || view === "reports" || view === "timesheets") && <Card title="Provider/storage/report evidence">
          <div className="grid gap-3 md:grid-cols-2">{progress.map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{row.category}</p><span className="font-black text-emerald-700">{row.current}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.progress}</p></div>)}</div>
        </Card>}
      </div>

      <aside className="space-y-6">
        <Card title="Audit stream"><div className="space-y-3">{state.auditEvents.length === 0 ? <p className="text-sm text-slate-500">Nu există mutații în această sesiune.</p> : state.auditEvents.slice(0, 8).map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 p-3"><p className="font-black">{event.title}</p><p className="text-xs text-slate-500">{event.type} · {event.entityId}</p></div>)}</div></Card>
        <Card title="Progress after v7.6.0"><div className="space-y-3">{progress.map((row) => <div key={row.category}><div className="flex justify-between gap-2 text-xs font-black"><span>{row.category}</span><span>{row.current}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-1 text-[11px] text-slate-500">{row.progress}</p></div>)}</div></Card>
        <Card title="Current gaps"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>Primary Prisma writes remain gated.</li><li>R2/S3 credentials are not configured in repo.</li><li>Email/push/websocket providers are readiness mode, not live delivery.</li><li>Provider rehearsal and observability are next-build scope.</li></ul></Card>
      </aside>
    </div>
  </main>;
}
