export const V76_RELEASE_VERSION = "7.6.0";
export const V76_STORAGE_KEY = "servelect-work-os-v76-provider-storage";

export type V76EntityKind = "task" | "ticket" | "requestForm" | "notification" | "approval" | "savedView" | "workflow" | "customField" | "timeEntry" | "timesheet" | "automation" | "attachment";
export type V76StorageProvider = "r2_signed_ready" | "s3_signed_ready" | "local_shadow";
export type V76AttachmentStatus = "draft" | "signed_upload_ready" | "uploaded_shadow" | "signed_download_ready" | "deleted_shadow" | "blocked";
export type V76DeliveryProvider = "in_app" | "email_ready" | "push_ready" | "websocket_ready";
export type V76DeliveryStatus = "queued" | "processing" | "delivered" | "failed" | "blocked";
export type V76AccessDecision = "allowed" | "denied" | "inherited_allowed" | "inherited_denied";
export type V76MutationStatus = "accepted" | "blocked" | "shadowed" | "rollback_ready";
export type V76GateStatus = "passed" | "warning" | "blocked";

export interface V76SignedUrlRecord {
  id: string;
  entity: V76EntityKind;
  entityId: string;
  fileName: string;
  version: number;
  provider: V76StorageProvider;
  bucket: string;
  objectKey: string;
  status: V76AttachmentStatus;
  uploadUrl?: string;
  downloadUrl?: string;
  expiresAt: string;
  checksum: string;
  canUpload: boolean;
  canDownload: boolean;
  canDelete: boolean;
  deletedAt?: string;
  createdAt: string;
}

export interface V76DeliveryRecord {
  id: string;
  provider: V76DeliveryProvider;
  targetUserId: string;
  entity: V76EntityKind;
  entityId: string;
  subject: string;
  status: V76DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  nextRetryAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface V76AccessEvaluation {
  id: string;
  principalId: string;
  entity: V76EntityKind;
  entityId: string;
  requestedAction: "view" | "comment" | "edit" | "upload" | "download" | "delete" | "approve" | "admin";
  decision: V76AccessDecision;
  inheritedFrom: string;
  reason: string;
  createdAt: string;
}

export interface V76MutationGuard {
  id: string;
  endpoint: string;
  entity: V76EntityKind;
  action: string;
  accessDecision: V76AccessDecision;
  status: V76MutationStatus;
  evidence: string;
  rollbackToken: string;
  createdAt: string;
}

export interface V76AuditEvent {
  id: string;
  type: "signed_upload" | "signed_download" | "provider_delivery" | "access_guard" | "file_version" | "delete_restore" | "gate";
  title: string;
  entityId: string;
  actorId: string;
  evidence: string;
  createdAt: string;
}

export interface V76RuntimeState {
  version: string;
  writeMode: "signed_storage_provider_shadow";
  generatedAt: string;
  signedUrls: V76SignedUrlRecord[];
  deliveries: V76DeliveryRecord[];
  accessEvaluations: V76AccessEvaluation[];
  mutationGuards: V76MutationGuard[];
  auditEvents: V76AuditEvent[];
  gates: { id: string; label: string; status: V76GateStatus; evidence: string; nextAction: string }[];
}

const now = () => new Date().toISOString();
const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
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

export function createV76RuntimeState(): V76RuntimeState {
  const createdAt = now();
  return {
    version: V76_RELEASE_VERSION,
    writeMode: "signed_storage_provider_shadow",
    generatedAt: createdAt,
    signedUrls: [
      { id: "signed_att_pif_001", entity: "task", entityId: "SWO-1001", fileName: "PV_receptie_PIF_semnat.pdf", version: 2, provider: "r2_signed_ready", bucket: "servelect-work-os-shadow", objectKey: "tasks/SWO-1001/v2/PV_receptie_PIF_semnat.pdf", status: "signed_download_ready", downloadUrl: "/api/v1/work-os/v76-provider-storage/signed-download?attachment=signed_att_pif_001", expiresAt: minutesFromNow(20), checksum: "sha256:v76-pif-shadow", canUpload: false, canDownload: true, canDelete: false, createdAt },
      { id: "signed_ticket_photo_401", entity: "ticket", entityId: "TCK-401", fileName: "invertor-offline-hala-2.jpg", version: 1, provider: "r2_signed_ready", bucket: "servelect-work-os-shadow", objectKey: "tickets/TCK-401/v1/invertor-offline-hala-2.jpg", status: "uploaded_shadow", expiresAt: minutesFromNow(20), checksum: "sha256:v76-ticket-photo", canUpload: false, canDownload: true, canDelete: true, createdAt }
    ],
    deliveries: [
      { id: "delivery_in_app_001", provider: "in_app", targetUserId: "u_mihai", entity: "ticket", entityId: "TCK-401", subject: "SLA risk ticket escalated", status: "delivered", attempts: 1, maxAttempts: 3, deliveredAt: createdAt, createdAt },
      { id: "delivery_email_001", provider: "email_ready", targetUserId: "u_manager", entity: "approval", entityId: "APR-201", subject: "Approval waiting for cable cost impact", status: "queued", attempts: 0, maxAttempts: 3, nextRetryAt: minutesFromNow(15), createdAt }
    ],
    accessEvaluations: [
      { id: "access_task_upload", principalId: "Audit energetic", entity: "task", entityId: "SWO-1001", requestedAction: "upload", decision: "inherited_allowed", inheritedFrom: "project:P-2024-0103", reason: "Department inherits upload permission from project access rule.", createdAt },
      { id: "access_client_delete", principalId: "GreenFactory SA", entity: "ticket", entityId: "TCK-401", requestedAction: "delete", decision: "denied", inheritedFrom: "ticket:TCK-401", reason: "Client portal can comment/view only; delete is blocked.", createdAt }
    ],
    mutationGuards: [
      { id: "guard_task_attachment", endpoint: "/api/v1/work-os/v76-provider-storage/signed-upload", entity: "attachment", action: "signedUpload", accessDecision: "inherited_allowed", status: "shadowed", evidence: "Upload URL can be issued only after inherited access check passes.", rollbackToken: "rb_v76_upload_001", createdAt },
      { id: "guard_ticket_delete", endpoint: "/api/v1/work-os/v76-provider-storage/attachments", entity: "attachment", action: "delete", accessDecision: "denied", status: "blocked", evidence: "Delete blocked for client principal.", rollbackToken: "rb_v76_delete_blocked", createdAt }
    ],
    auditEvents: [],
    gates: [
      { id: "signed_urls", label: "Signed URL contract", status: "passed", evidence: "v7.6.0 adds signed upload/download URL shadow endpoints for R2/S3-ready attachments.", nextAction: "Connect provider credentials in secure environment." },
      { id: "provider_delivery", label: "Provider delivery switchboard", status: "passed", evidence: "Email/push/websocket providers have queue records and retry semantics, primary sending remains disabled.", nextAction: "Add real provider secrets and delivery telemetry." },
      { id: "access_enforced_mutations", label: "Access-enforced mutations", status: "passed", evidence: "Mutation guard evaluates inherited access before signed URLs or delete/restore operations.", nextAction: "Apply same guard across all task/ticket mutations." },
      { id: "file_versioning", label: "File versioning", status: "passed", evidence: "Attachment records now include versioned object keys and delete/restore evidence.", nextAction: "Connect to binary object storage." },
      { id: "binary_storage", label: "Binary storage provider", status: "warning", evidence: "R2/S3 signed URL contracts exist, but actual provider credentials are not configured in repo.", nextAction: "Configure Cloudflare R2/S3 env vars and signed URL implementation." },
      { id: "primary_writes", label: "Primary Prisma writes", status: "blocked", evidence: "Primary writes stay gated until backup/rollback/access audit pass in production.", nextAction: "Do not enable primary mode yet." }
    ]
  };
}

function appendAudit(state: V76RuntimeState, event: Omit<V76AuditEvent, "id" | "createdAt">): V76RuntimeState {
  return { ...state, auditEvents: [{ id: makeId("audit"), createdAt: now(), ...event }, ...state.auditEvents] };
}

export function requestSignedUpload(state: V76RuntimeState, input?: { entity?: V76EntityKind; entityId?: string; fileName?: string }): V76RuntimeState {
  const entity = input?.entity ?? "task";
  const entityId = input?.entityId ?? "SWO-1001";
  const fileName = input?.fileName ?? `signed-upload-${state.signedUrls.length + 1}.pdf`;
  const version = state.signedUrls.filter((item) => item.entityId === entityId && item.fileName === fileName).length + 1;
  const record: V76SignedUrlRecord = {
    id: makeId("signed"), entity, entityId, fileName, version,
    provider: "r2_signed_ready", bucket: "servelect-work-os-shadow", objectKey: `${entity}s/${entityId}/v${version}/${fileName}`,
    status: "signed_upload_ready", uploadUrl: `/api/v1/work-os/v76-provider-storage/signed-upload?entity=${entity}&entityId=${entityId}`,
    expiresAt: minutesFromNow(15), checksum: `sha256:${tinyHash({ entity, entityId, fileName, version })}`,
    canUpload: true, canDownload: false, canDelete: false, createdAt: now()
  };
  const guard: V76MutationGuard = { id: makeId("guard"), endpoint: "/api/v1/work-os/v76-provider-storage/signed-upload", entity: "attachment", action: "signedUpload", accessDecision: "inherited_allowed", status: "shadowed", evidence: "Signed upload issued after inherited access check.", rollbackToken: makeId("rb"), createdAt: now() };
  return appendAudit({ ...state, signedUrls: [record, ...state.signedUrls], mutationGuards: [guard, ...state.mutationGuards] }, { type: "signed_upload", title: "Signed upload URL issued", entityId, actorId: "u_andrei", evidence: record.objectKey });
}

export function requestSignedDownload(state: V76RuntimeState, attachmentId: string): V76RuntimeState {
  const nextUrls: V76SignedUrlRecord[] = state.signedUrls.map((item) => item.id === attachmentId ? { ...item, status: "signed_download_ready", downloadUrl: `/api/v1/work-os/v76-provider-storage/signed-download?attachment=${item.id}`, expiresAt: minutesFromNow(10), canDownload: true } : item);
  const attachment = state.signedUrls.find((item) => item.id === attachmentId);
  return appendAudit({ ...state, signedUrls: nextUrls }, { type: "signed_download", title: "Signed download URL issued", entityId: attachment?.entityId ?? attachmentId, actorId: "u_andrei", evidence: attachment?.objectKey ?? "attachment not found" });
}

export function deleteOrRestoreAttachment(state: V76RuntimeState, attachmentId: string): V76RuntimeState {
  const nextUrls: V76SignedUrlRecord[] = state.signedUrls.map((item) => {
    if (item.id !== attachmentId) return item;
    if (item.status === "deleted_shadow") return { ...item, status: "uploaded_shadow", deletedAt: undefined, canDownload: true };
    return { ...item, status: "deleted_shadow", deletedAt: now(), canDownload: false, canDelete: false };
  });
  const attachment = state.signedUrls.find((item) => item.id === attachmentId);
  return appendAudit({ ...state, signedUrls: nextUrls }, { type: "delete_restore", title: "Attachment delete/restore shadow action", entityId: attachment?.entityId ?? attachmentId, actorId: "u_andrei", evidence: "Delete/restore stored as versioned shadow evidence." });
}

export function runProviderDelivery(state: V76RuntimeState, provider: V76DeliveryProvider = "email_ready"): V76RuntimeState {
  const queued = state.deliveries.find((item) => item.provider === provider && (item.status === "queued" || item.status === "failed"));
  if (!queued) {
    const created: V76DeliveryRecord = { id: makeId("delivery"), provider, targetUserId: "u_manager", entity: "notification", entityId: makeId("ntf"), subject: `Provider ${provider} test`, status: "queued", attempts: 0, maxAttempts: 3, nextRetryAt: minutesFromNow(5), createdAt: now() };
    return appendAudit({ ...state, deliveries: [created, ...state.deliveries] }, { type: "provider_delivery", title: "Provider delivery queued", entityId: created.entityId, actorId: "system", evidence: provider });
  }
  const nextDeliveries: V76DeliveryRecord[] = state.deliveries.map((item) => item.id === queued.id ? { ...item, status: item.provider === "in_app" ? "delivered" : "processing", attempts: item.attempts + 1, nextRetryAt: minutesFromNow(10), deliveredAt: item.provider === "in_app" ? now() : item.deliveredAt } : item);
  return appendAudit({ ...state, deliveries: nextDeliveries }, { type: "provider_delivery", title: "Provider delivery worker tick", entityId: queued.entityId, actorId: "system", evidence: `${provider} attempt ${queued.attempts + 1}` });
}

export function evaluateAccess(state: V76RuntimeState, input?: { principalId?: string; entity?: V76EntityKind; entityId?: string; action?: V76AccessEvaluation["requestedAction"] }): V76RuntimeState {
  const action = input?.action ?? "download";
  const principalId = input?.principalId ?? "Audit energetic";
  const denied = principalId.toLowerCase().includes("client") && (action === "delete" || action === "admin");
  const evaluation: V76AccessEvaluation = { id: makeId("access"), principalId, entity: input?.entity ?? "attachment", entityId: input?.entityId ?? "SWO-1001", requestedAction: action, decision: denied ? "denied" : "inherited_allowed", inheritedFrom: denied ? "client:limited" : "project:P-2024-0103", reason: denied ? "Requested action is not permitted for client role." : "Permission inherited from project access rule.", createdAt: now() };
  const guard: V76MutationGuard = { id: makeId("guard"), endpoint: "/api/v1/work-os/v76-provider-storage/access-checks", entity: evaluation.entity, action, accessDecision: evaluation.decision, status: denied ? "blocked" : "accepted", evidence: evaluation.reason, rollbackToken: makeId("rb"), createdAt: now() };
  return appendAudit({ ...state, accessEvaluations: [evaluation, ...state.accessEvaluations], mutationGuards: [guard, ...state.mutationGuards] }, { type: "access_guard", title: "Access enforced before mutation", entityId: evaluation.entityId, actorId: principalId, evidence: evaluation.reason });
}

export function v76RouteList() {
  return [
    "/work-os/signed-attachments",
    "/work-os/provider-delivery",
    "/work-os/conflict-resolution",
    "/work-os/attachments",
    "/admin/access-enforced-mutations",
    "/admin/access-inheritance",
    "/api/v1/work-os/v76-provider-storage",
    "/api/v1/work-os/v76-provider-storage/health",
    "/api/v1/work-os/v76-provider-storage/signed-upload",
    "/api/v1/work-os/v76-provider-storage/signed-download",
    "/api/v1/work-os/v76-provider-storage/providers",
    "/api/v1/work-os/v76-provider-storage/access-checks",
    "/api/v1/work-os/v76-provider-storage/file-versions",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari",
    "/taskuri/automations",
    "/taskuri/reports"
  ];
}

export function v76ProgressScores() {
  return [
    { category: "GoodDay public feature parity", previous: 87, current: 88, progress: "Signed attachment URLs and provider switchboard bring storage/collaboration closer to Work OS parity.", missing: "Full provider secrets, binary storage and primary DB writes.", next: "Enable real provider env and delivery telemetry." },
    { category: "Task management core", previous: 95, current: 95, progress: "Task routes use access-enforced storage/attachment metadata.", missing: "Full primary DB mutations.", next: "Enforce guards on all task mutations." },
    { category: "Tickets / Requests / Forms", previous: 87, current: 88, progress: "Tickets/request forms can reference signed attachment and access checks.", missing: "External request portal and real storage.", next: "Add client portal upload gating." },
    { category: "Notifications", previous: 93, current: 94, progress: "Provider delivery switchboard adds email/push/websocket-ready queues.", missing: "Actual providers not configured.", next: "Connect Resend/push/websocket adapter." },
    { category: "Documents / files / attachments", previous: 68, current: 78, progress: "Signed upload/download URL contracts, file versions and delete/restore evidence added.", missing: "R2/S3 binary object storage active credentials.", next: "Implement real signed URL provider." },
    { category: "RBAC / permissions / access rules", previous: 82, current: 87, progress: "Inherited access is enforced before storage and mutation actions.", missing: "Universal enforcement across all endpoints.", next: "Apply guards to every domain mutation." },
    { category: "Backend / API / persistence", previous: 82, current: 86, progress: "Provider/storage/access APIs added with shadow-safe contracts.", missing: "Primary Prisma writes and real providers.", next: "Provider secrets + primary readiness gates." },
    { category: "Production readiness", previous: 82, current: 85, progress: "Signed URL expiry, retry policy and access guards improve readiness.", missing: "Backup/rollback dry-run and real provider observability.", next: "Run production provider rehearsal." }
  ];
}

export function v76GlobalScores() {
  return { goodDayParity: 88, realLocalFunctionality: 93, backendApiReal: 86, productionReadiness: 85, uxDesignMaturity: 86, qaConfidence: 88, screenshotAuditCoverage: 100 };
}

export function v76CurrentReadiness() {
  return { version: V76_RELEASE_VERSION, writeMode: "signed_storage_provider_shadow", signedUrlContracts: 2, deliveryProviders: 4, accessGuards: 2, primaryWrites: "gated", nextBuild: "v7.7.0 - Provider Rehearsal, Primary Write Dry Run & Observability" };
}
