export const V95_RELEASE_VERSION = "9.5.0";

export type V95Surface =
  | "collaboration"
  | "checklists"
  | "files"
  | "sla"
  | "workload"
  | "decisions"
  | "requests"
  | "admin";

export const v95Navigation = [
  { label: "Collaboration hub", href: "/taskuri/collaboration-hub-v95" },
  { label: "Checklists", href: "/taskuri/checklists-quality-v95" },
  { label: "Files & evidence", href: "/taskuri/files-evidence-v95" },
  { label: "SLA inbox", href: "/taskuri/sla-escalation-v95" },
  { label: "Workload forecast", href: "/taskuri/workload-forecast-v95" },
  { label: "Decisions", href: "/taskuri/decision-register-v95" },
  { label: "Requests bridge", href: "/taskuri/request-portal-bridge-v95" },
] as const;

export const v95Readiness = [
  { category: "Website/Web App", value: 98, status: "ready", evidence: "Taskuri canonical shell, single navigation and v9.5 operational routes." },
  { category: "Task & Project Core", value: 96, status: "ready", evidence: "Task drawer, hierarchy, timeline, dependencies, checklists and activity stream are connected as one execution layer." },
  { category: "GoodDay parity", value: 91, status: "queued", evidence: "Collaboration, files, checklist, workload, SLA and decision surfaces are now in Taskuri." },
  { category: "Backend/API", value: 93, status: "ready", evidence: "v95 API exposes collaboration, checklist, files, SLA, workload, decisions and readiness endpoints." },
  { category: "Database/Prisma/Seed", value: 82, status: "needs_approval", evidence: "Persistence stays pilot-gated; adapters are represented with audit envelopes and rollback checkpoints." },
  { category: "Auth/RBAC", value: 89, status: "needs_approval", evidence: "Manager gates and department policies continue to protect mutations." },
  { category: "Mobile App", value: 62, status: "scheduled", evidence: "Collaboration and evidence contracts are ready for a field mobile surface later." },
] as const;

export const v95Metrics = [
  { label: "Open updates", value: "34", trend: "12 need owner response" },
  { label: "Checklist completion", value: "78%", trend: "quality gates attached to field tasks" },
  { label: "Evidence files", value: "126", trend: "photos, PDFs, signed PV and supplier docs" },
  { label: "SLA at risk", value: "7", trend: "manager review required" },
  { label: "Workload balance", value: "83%", trend: "capacity forecast tied to task dates" },
  { label: "Decision log", value: "18", trend: "approved / pending / escalated" },
] as const;

export const v95Tasks = [
  { id: "tsk-950-001", code: "SWO-950", title: "Finalize checklist and evidence for PV reception package", project: "P-2026-0187 Sistem FV Cluj", owner: "Ioana Marinescu", department: "Producție", status: "In lucru", priority: "Urgent", due: "2026-06-19", checklist: 8, checklistDone: 6, files: 12, comments: 9, watchers: ["Andrei", "Mihai", "Cristian"], sla: "S1 · 6h left", gate: "manager_approval" },
  { id: "tsk-950-002", code: "SWO-951", title: "Validate webhook intake for SLA ticket escalation", project: "SERVELECT Work OS", owner: "Mihai Ionescu", department: "Automatizări", status: "Review", priority: "Ridicată", due: "2026-06-20", checklist: 10, checklistDone: 7, files: 5, comments: 13, watchers: ["Alexandra", "George"], sla: "S2 · 1d left", gate: "provider_gate" },
  { id: "tsk-950-003", code: "SWO-952", title: "Prepare customer request bridge for support intake", project: "Portal client & mentenanță", owner: "Alexandra Rusu", department: "Comercial", status: "Planificat", priority: "Medie", due: "2026-06-24", checklist: 6, checklistDone: 3, files: 3, comments: 4, watchers: ["Ioana"], sla: "S3 · normal", gate: "department_policy" },
] as const;

export const v95Activity = [
  { at: "09:10", actor: "Ioana Marinescu", action: "attached evidence pack", target: "SWO-950", detail: "PV reception photos and signed customer note added to task evidence.", type: "file" },
  { at: "09:22", actor: "Mihai Ionescu", action: "queued provider callback", target: "SWO-951", detail: "Webhook intake matched idempotency key and stayed gated.", type: "webhook" },
  { at: "09:35", actor: "Cristian Radu", action: "requested manager decision", target: "SWO-950", detail: "S1 SLA escalation requires approval before dispatch reassignment.", type: "approval" },
  { at: "09:44", actor: "Alexandra Rusu", action: "converted request to task", target: "SWO-952", detail: "Client portal request mapped to owner, SLA and checklist.", type: "request" },
] as const;

export const v95Checklists = [
  { name: "PV reception quality gate", complete: 76, required: 12, blocked: 2, owner: "Producție", evidence: "Mandatory photos, inverter serials, client signature and handover PDF." },
  { name: "Provider callback review", complete: 70, required: 10, blocked: 1, owner: "Automatizări", evidence: "Signature, idempotency, replay lock and delivery receipt." },
  { name: "Client request triage", complete: 50, required: 6, blocked: 0, owner: "Comercial", evidence: "Request type, owner, SLA, attachments and next action." },
] as const;

export const v95Files = [
  { name: "PV_receptie_semnata.pdf", task: "SWO-950", kind: "signed-pdf", size: "2.4 MB", status: "ready", owner: "Ioana Marinescu" },
  { name: "inverter_serials_photo_pack.zip", task: "SWO-950", kind: "field-photo", size: "18.7 MB", status: "queued", owner: "Cristian Radu" },
  { name: "webhook_delivery_receipt.json", task: "SWO-951", kind: "audit-json", size: "42 KB", status: "ready", owner: "Mihai Ionescu" },
  { name: "client_request_context.docx", task: "SWO-952", kind: "client-doc", size: "860 KB", status: "needs_approval", owner: "Alexandra Rusu" },
] as const;

export const v95Sla = [
  { lane: "S1 Critical", count: 2, breached: 0, atRisk: 2, action: "Manager approval before dispatch reassignment." },
  { lane: "S2 High", count: 5, breached: 1, atRisk: 3, action: "Provider callback and owner acknowledgement." },
  { lane: "S3 Normal", count: 14, breached: 0, atRisk: 2, action: "Daily review and request bridge cleanup." },
] as const;

export const v95Workload = [
  { person: "Ioana Marinescu", role: "Project manager", capacity: 40, allocated: 36, risk: "green", next: "Keep allocation." },
  { person: "Mihai Ionescu", role: "Automation lead", capacity: 40, allocated: 44, risk: "amber", next: "Move webhook replay task to George." },
  { person: "Cristian Radu", role: "Field technician", capacity: 38, allocated: 41, risk: "amber", next: "Rebalance S1 dispatch." },
  { person: "Alexandra Rusu", role: "Commercial owner", capacity: 40, allocated: 31, risk: "green", next: "Own client request bridge." },
] as const;

export const v95Decisions = [
  { id: "dec-950-001", title: "Allow S1 dispatch reassignment", status: "pending", owner: "Department manager", due: "2026-06-18 16:00", evidence: "Workload imbalance and SLA risk." },
  { id: "dec-950-002", title: "Accept webhook callback as evidence", status: "approved", owner: "Automation lead", due: "2026-06-18 12:00", evidence: "Signature and idempotency proof passed." },
  { id: "dec-950-003", title: "Convert customer request to maintenance ticket", status: "queued", owner: "Commercial manager", due: "2026-06-19 10:00", evidence: "Client request has scope, photo and preferred schedule." },
] as const;

export function getV95Payload(surface: V95Surface = "collaboration") {
  return {
    ok: true,
    version: V95_RELEASE_VERSION,
    release: "v9.5.0 — GoodDay Collaboration Files SLA Operations Layer",
    surface,
    canonicalEntry: "/taskuri",
    globalProductionWrites: "disabled_pilot_gated",
    navigation: v95Navigation,
    metrics: v95Metrics,
    readiness: v95Readiness,
    tasks: v95Tasks,
    activity: v95Activity,
    checklists: v95Checklists,
    files: v95Files,
    sla: v95Sla,
    workload: v95Workload,
    decisions: v95Decisions,
    audit: {
      noParallelShell: true,
      noSeparateSurface: true,
      noLegacyLabels: true,
      nextBuildReadBeforeApply: true,
      evidence: "Taskuri/Admin/API surfaces only, with compatibility routing kept outside a visible second shell.",
    },
  };
}

export function getV95Section(section: string) {
  const payload = getV95Payload();
  if (section === "health") return { ok: true, version: payload.version, writes: payload.globalProductionWrites };
  if (section === "collaboration") return { ok: true, tasks: payload.tasks, activity: payload.activity };
  if (section === "checklists") return { ok: true, checklists: payload.checklists };
  if (section === "files") return { ok: true, files: payload.files };
  if (section === "sla") return { ok: true, sla: payload.sla };
  if (section === "workload") return { ok: true, workload: payload.workload };
  if (section === "decisions") return { ok: true, decisions: payload.decisions };
  if (section === "readiness") return { ok: true, readiness: payload.readiness, audit: payload.audit };
  return payload;
}
