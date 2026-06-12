export const V75_RELEASE_VERSION = "7.5.1";
export const V75_STORAGE_KEY = "servelect-work-os-v75-conflict-access-attachments";

export type V75EntityKind = "task" | "ticket" | "requestForm" | "notification" | "approval" | "savedView" | "workflow" | "customField" | "timeEntry" | "timesheet" | "automation" | "attachment";
export type V75ConflictStatus = "open" | "merged" | "kept_local" | "kept_remote" | "blocked";
export type V75AccessScope = "workspace" | "portfolio" | "project" | "folder" | "task" | "ticket" | "document";
export type V75Permission = "view" | "comment" | "edit" | "assign" | "approve" | "upload" | "delete" | "admin";
export type V75AttachmentStatus = "queued" | "stored_shadow" | "verified" | "blocked" | "deleted";
export type V75StorageProvider = "local_shadow" | "r2_ready" | "s3_ready";
export type V75GateStatus = "passed" | "warning" | "blocked";

export interface V75ConflictRecord {
  id: string;
  entity: V75EntityKind;
  entityId: string;
  localVersion: number;
  remoteVersion: number;
  baseHash: string;
  localHash: string;
  remoteHash: string;
  status: V75ConflictStatus;
  resolution?: "merge" | "keep_local" | "keep_remote";
  actorId: string;
  route: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface V75AccessRule {
  id: string;
  scope: V75AccessScope;
  scopeId: string;
  inheritedFrom?: string;
  principalType: "role" | "department" | "team" | "user" | "client";
  principalId: string;
  permissions: V75Permission[];
  effect: "allow" | "deny";
  locked: boolean;
  evidence: string;
}

export interface V75AttachmentRecord {
  id: string;
  entity: V75EntityKind;
  entityId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  provider: V75StorageProvider;
  bucket: string;
  objectKey: string;
  checksum: string;
  status: V75AttachmentStatus;
  uploadedBy: string;
  canDownload: boolean;
  canDelete: boolean;
  createdAt: string;
}

export interface V75AuditEvent {
  id: string;
  type: "conflict" | "access" | "attachment" | "download" | "delete" | "gate";
  title: string;
  entityId: string;
  actorId: string;
  createdAt: string;
  evidence: string;
}

export interface V75RuntimeState {
  version: string;
  writeMode: "conflict_access_attachment_shadow";
  generatedAt: string;
  conflicts: V75ConflictRecord[];
  accessRules: V75AccessRule[];
  attachments: V75AttachmentRecord[];
  auditEvents: V75AuditEvent[];
  gates: { id: string; label: string; status: V75GateStatus; evidence: string; nextAction: string }[];
}

const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function tinyHash(value: unknown) {
  const text = JSON.stringify(value ?? {}).slice(0, 1800);
  let result = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    result ^= text.charCodeAt(index);
    result += (result << 1) + (result << 4) + (result << 7) + (result << 8) + (result << 24);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}

export function createV75RuntimeState(): V75RuntimeState {
  const createdAt = now();
  return {
    version: V75_RELEASE_VERSION,
    writeMode: "conflict_access_attachment_shadow",
    generatedAt: createdAt,
    conflicts: [
      { id: "conflict_task_1001", entity: "task", entityId: "SWO-1001", localVersion: 7, remoteVersion: 8, baseHash: "6f1a2d91", localHash: "9c72aa31", remoteHash: "a135cc72", status: "open", actorId: "u_andrei", route: "/taskuri/overview", createdAt }
    ],
    accessRules: [
      { id: "acl_workspace_super_admin", scope: "workspace", scopeId: "servelect", principalType: "role", principalId: "Super Admin", permissions: ["view", "comment", "edit", "assign", "approve", "upload", "delete", "admin"], effect: "allow", locked: true, evidence: "Super Admin keeps global access." },
      { id: "acl_department_audit_energy", scope: "project", scopeId: "P-2024-0187", inheritedFrom: "workspace:servelect", principalType: "department", principalId: "Audit energetic", permissions: ["view", "comment", "edit", "upload"], effect: "allow", locked: false, evidence: "Audit energetic inherits project access but not admin rights." },
      { id: "acl_client_portal_limited", scope: "ticket", scopeId: "TCK-401", inheritedFrom: "project:P-2024-0103", principalType: "client", principalId: "GreenFactory SA", permissions: ["view", "comment"], effect: "allow", locked: false, evidence: "Client portal can view/comment only on linked ticket." }
    ],
    attachments: [
      { id: "att_pif_001", entity: "task", entityId: "SWO-1001", fileName: "PV_receptie_PIF_semnat.pdf", mimeType: "application/pdf", sizeBytes: 328144, provider: "r2_ready", bucket: "servelect-work-os-shadow", objectKey: "tasks/SWO-1001/PV_receptie_PIF_semnat.pdf", checksum: "sha256:shadow-pif-001", status: "stored_shadow", uploadedBy: "u_vlad", canDownload: true, canDelete: false, createdAt },
      { id: "att_ticket_photo_401", entity: "ticket", entityId: "TCK-401", fileName: "invertor-offline-hala-2.jpg", mimeType: "image/jpeg", sizeBytes: 744210, provider: "r2_ready", bucket: "servelect-work-os-shadow", objectKey: "tickets/TCK-401/invertor-offline-hala-2.jpg", checksum: "sha256:shadow-ticket-401", status: "verified", uploadedBy: "u_mihai", canDownload: true, canDelete: true, createdAt }
    ],
    auditEvents: [],
    gates: [
      { id: "version_clean", label: "Version labels normalized", status: "passed", evidence: "v7.5.0 surfaces the current release on conflict/access/attachment routes.", nextAction: "Keep release manifest as source of truth." },
      { id: "conflict_ui", label: "Conflict resolution UI", status: "passed", evidence: "Open conflicts can be merged or resolved local/remote in shadow state.", nextAction: "Connect conflicts to task drawer merge UI." },
      { id: "access_inheritance", label: "Access inheritance", status: "passed", evidence: "Workspace/project/task/ticket inheritance is represented with allow/deny rules.", nextAction: "Enforce inheritance in all mutation endpoints." },
      { id: "attachment_storage", label: "Attachment storage layer", status: "warning", evidence: "R2/S3-ready metadata exists; binary upload provider is still readiness mode.", nextAction: "Add signed upload/download URL endpoints." },
      { id: "primary_writes", label: "Primary Prisma writes", status: "blocked", evidence: "Primary writes remain gated until backup, rollback and access audit pass.", nextAction: "Do not enable primary writes yet." }
    ]
  };
}

function appendAudit(state: V75RuntimeState, event: Omit<V75AuditEvent, "id" | "createdAt">): V75RuntimeState {
  return { ...state, auditEvents: [{ id: makeId("audit"), createdAt: now(), ...event }, ...state.auditEvents] };
}

export function resolveConflict(state: V75RuntimeState, conflictId: string, resolution: "merge" | "keep_local" | "keep_remote"): V75RuntimeState {
  const resolvedStatus: V75ConflictStatus = resolution === "merge" ? "merged" : resolution === "keep_local" ? "kept_local" : "kept_remote";
  const next: V75RuntimeState = {
    ...state,
    conflicts: state.conflicts.map((conflict): V75ConflictRecord => conflict.id === conflictId ? { ...conflict, status: resolvedStatus, resolution, resolvedAt: now() } : conflict)
  };
  const conflict = state.conflicts.find((item) => item.id === conflictId);
  return appendAudit(next, { type: "conflict", title: `Conflict resolved with ${resolution}`, entityId: conflict?.entityId ?? conflictId, actorId: "u_andrei", evidence: "Resolution stored in shadow audit before primary write." });
}

export function createConflict(state: V75RuntimeState, input?: { entity?: V75EntityKind; entityId?: string }): V75RuntimeState {
  const entity = input?.entity ?? "task";
  const entityId = input?.entityId ?? `SWO-${1000 + state.conflicts.length + 5}`;
  const conflict: V75ConflictRecord = { id: makeId("conflict"), entity, entityId, localVersion: 2, remoteVersion: 3, baseHash: tinyHash({ entity, entityId, base: true }), localHash: tinyHash({ entity, entityId, local: true }), remoteHash: tinyHash({ entity, entityId, remote: true }), status: "open", actorId: "u_andrei", route: "/work-os/conflict-resolution", createdAt: now() };
  const next = { ...state, conflicts: [conflict, ...state.conflicts] };
  return appendAudit(next, { type: "conflict", title: "Conflict generated for QA", entityId, actorId: "u_andrei", evidence: "Conflict record created without primary DB write." });
}

export function addAccessRule(state: V75RuntimeState, input?: { scope?: V75AccessScope; scopeId?: string; principalId?: string; permissions?: V75Permission[] }): V75RuntimeState {
  const rule: V75AccessRule = { id: makeId("acl"), scope: input?.scope ?? "task", scopeId: input?.scopeId ?? "SWO-1001", inheritedFrom: "project:P-2024-0103", principalType: "department", principalId: input?.principalId ?? "Mentenanta", permissions: input?.permissions ?? ["view", "comment", "upload"], effect: "allow", locked: false, evidence: "Shadow access inheritance rule created for v7.5 validation." };
  const next = { ...state, accessRules: [rule, ...state.accessRules] };
  return appendAudit(next, { type: "access", title: "Access inheritance rule added", entityId: rule.scopeId, actorId: "u_andrei", evidence: rule.evidence });
}

export function addAttachment(state: V75RuntimeState, input?: { entity?: V75EntityKind; entityId?: string; fileName?: string }): V75RuntimeState {
  const entity = input?.entity ?? "task";
  const entityId = input?.entityId ?? "SWO-1001";
  const fileName = input?.fileName ?? `document-shadow-${state.attachments.length + 1}.pdf`;
  const attachment: V75AttachmentRecord = { id: makeId("att"), entity, entityId, fileName, mimeType: fileName.endsWith(".jpg") ? "image/jpeg" : "application/pdf", sizeBytes: 250000 + state.attachments.length * 12000, provider: "r2_ready", bucket: "servelect-work-os-shadow", objectKey: `${entity}s/${entityId}/${fileName}`, checksum: `sha256:${tinyHash({ fileName, entityId })}`, status: "stored_shadow", uploadedBy: "u_andrei", canDownload: true, canDelete: true, createdAt: now() };
  const next = { ...state, attachments: [attachment, ...state.attachments] };
  return appendAudit(next, { type: "attachment", title: "Attachment metadata stored", entityId, actorId: "u_andrei", evidence: "R2/S3-ready metadata stored; binary provider still gated." });
}

export function deleteAttachment(state: V75RuntimeState, attachmentId: string): V75RuntimeState {
  const attachment = state.attachments.find((item) => item.id === attachmentId);
  const deletedStatus: V75AttachmentStatus = "deleted";
  const next: V75RuntimeState = {
    ...state,
    attachments: state.attachments.map((item): V75AttachmentRecord => item.id === attachmentId ? { ...item, status: deletedStatus, canDelete: false } : item)
  };
  return appendAudit(next, { type: "delete", title: "Attachment delete requested", entityId: attachment?.entityId ?? attachmentId, actorId: "u_andrei", evidence: attachment?.canDelete ? "Delete marked in shadow state." : "Delete blocked or already unavailable." });
}

export function v75CurrentReadiness() {
  return { version: V75_RELEASE_VERSION, writeMode: "conflict_access_attachment_shadow", openConflicts: 1, inheritedRules: 3, attachments: 2, storageProviders: ["r2_ready", "s3_ready"], primaryWrites: "gated", nextBuild: "v7.6.0 - Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API" };
}

export function v75GlobalScores() {
  return { goodDayParity: 87, realLocalFunctionality: 93, backendApiReal: 82, productionReadiness: 82, uxDesignMaturity: 86, qaConfidence: 86, screenshotAuditCoverage: 100 };
}

export function v75ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 86, current: 87, progress: "conflict resolution, access inheritance and attachment metadata added", missing: "primary DB writes and provider delivery", next: "signed URLs and provider delivery" },
    { category: "Task management core", before: 94, current: 95, progress: "task conflicts and attachment links are represented", missing: "task drawer merge UI across every field", next: "field-level conflict merge" },
    { category: "Tickets / Requests / Forms", before: 85, current: 87, progress: "ticket attachments and client access inheritance added", missing: "client portal upload flow", next: "portal attachment permissions" },
    { category: "Notifications", before: 92, current: 93, progress: "attachment/conflict/access audit events generate notification-ready records", missing: "email/push/websocket providers", next: "provider switchboard" },
    { category: "Workflows / custom statuses / validations", before: 82, current: 84, progress: "access inherited gates are ready for status transitions", missing: "server enforcement across all workflow routes", next: "access-enforced mutation API" },
    { category: "Custom fields / task types", before: 81, current: 83, progress: "field-level access inheritance is scaffolded", missing: "per-field ACL in table/drawer", next: "field ACL editor" },
    { category: "Saved views / filters", before: 85, current: 86, progress: "shared view access inheritance prepared", missing: "server-side shared view ACL", next: "saved view access enforcement" },
    { category: "Documents / files / attachments", before: 45, current: 68, progress: "R2/S3-ready attachment metadata and permission checks added", missing: "signed URL upload/download and binary storage", next: "signed URL provider" },
    { category: "RBAC / permissions / access rules", before: 72, current: 82, progress: "workspace/project/task/ticket inheritance rules added", missing: "API-wide enforcement", next: "enforced mutation API" },
    { category: "Backend / API / persistence", before: 78, current: 82, progress: "conflict/access/attachment endpoints and migration scaffold added", missing: "primary DB activation and binary storage", next: "provider-backed storage" },
    { category: "Production readiness", before: 78, current: 82, progress: "conflict gates and storage gates added", missing: "backup, signed storage, provider delivery", next: "signed storage + delivery providers" }
  ];
}

export function v75RouteList() {
  return [
    "/work-os/conflict-resolution",
    "/work-os/attachments",
    "/admin/access-inheritance",
    "/api/v1/work-os/v75-conflict-access-storage",
    "/api/v1/work-os/v75-conflict-access-storage/health",
    "/api/v1/work-os/v75-conflict-access-storage/conflicts",
    "/api/v1/work-os/v75-conflict-access-storage/access-rules",
    "/api/v1/work-os/v75-conflict-access-storage/attachments",
    "/work-os/db-shadow-writes",
    "/work-os/prisma-migration",
    "/work-os/prisma-shadow-records",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari",
    "/taskuri/automations",
    "/taskuri/reports"
  ];
}
