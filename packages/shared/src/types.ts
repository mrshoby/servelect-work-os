export type Role =
  | "Administrator"
  | "Manager"
  | "Tehnician"
  | "Client"
  | "Financiar"
  | "Vânzări"
  | "Auditor"
  | "Viewer";

export type Permission =
  | "project:read" | "project:write" | "project:delete"
  | "task:read" | "task:write" | "task:assign"
  | "crm:read" | "crm:write"
  | "iot:read" | "iot:write"
  | "equipment:read" | "equipment:write"
  | "maintenance:read" | "maintenance:write"
  | "finance:read" | "finance:write"
  | "hr:read" | "hr:write"
  | "admin:manage";

export type ProjectPhase = "Planificat" | "Proiectare" | "Avizare" | "Montaj" | "Testare" | "PIF" | "În desfășurare" | "Finalizat" | "Blocat";
export type ProjectHealth = "Bun" | "Atenție" | "Risc" | "Critic";

export type TaskStatus = "Backlog" | "De făcut" | "În lucru" | "Review / QA" | "Blocat" | "Finalizat" | "Anulat";
export type Priority = "Scăzut" | "Mediu" | "Ridicat" | "Urgent" | "Critic";
export type ApprovalStatus = "În așteptare" | "Aprobat" | "Respins" | "Anulat";

export interface Workspace {
  id: string;
  name: string;
  plan: "Starter" | "Professional" | "Enterprise";
  tenantSlug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatar: string;
  team: string;
  workload: number;
  online?: boolean;
  phone?: string;
  certifications?: string[];
  permissions: Permission[];
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: "Client activ" | "Prospect" | "Inactiv";
  segment: "B2B" | "Public" | "Rezidențial" | "Industrial";
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientId: string;
  clientName: string;
  location: string;
  powerKwp: number;
  phase: ProjectPhase;
  progress: number;
  health: ProjectHealth;
  ownerId: string;
  ownerName: string;
  deadline: string;
  budgetRon: number;
  workedHours: number;
  risks: number;
  documents: number;
  coordinates?: { lat: number; lng: number };
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  assigneeId?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: "PDF" | "DWG" | "XLSX" | "IMG" | "DOC" | "ZIP";
  size: string;
  url?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  minutes: number;
  billable: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  parentTaskId?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assigneeName: string;
  ownerId: string;
  startDate: string;
  dueDate: string;
  estimateHours: number;
  trackedHours: number;
  tags: string[];
  dependencies: string[];
  customFields: Record<string, string | number | boolean>;
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
  activityLog: ActivityLog[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: "Task" | "Meeting" | "Milestone" | "Revizie" | "Intervenție";
  startsAt: string;
  endsAt: string;
  projectId?: string;
  ownerId: string;
}

export interface CRMLead {
  id: string;
  company: string;
  contact: string;
  valueRon: number;
  stage: "Lead nou" | "Calificat" | "Ofertă emisă" | "Negociere" | "Câștigat" | "Pierdut";
  probability: number;
  ownerId: string;
  nextStep: string;
}

export interface Opportunity extends CRMLead {
  clientId?: string;
  tasks: string[];
  documents: Attachment[];
  expectedCloseDate: string;
}

export interface EnergyInstallation {
  id: string;
  projectId: string;
  name: string;
  location: string;
  powerKwp: number;
  livePowerKw: number;
  energyTodayKwh: number;
  yieldKwhKwp: number;
  status: "Online" | "Offline" | "Atenție" | "Alarmă";
  inverterBrand: "Huawei" | "Fronius" | "SolarEdge" | "Sungrow" | "Growatt";
  co2AvoidedKg: number;
}

export interface IoTAlert {
  id: string;
  installationId: string;
  projectId: string;
  title: string;
  severity: "Informare" | "Atenționare" | "Critică";
  createdAt: string;
  status: "Deschis" | "În lucru" | "Închis";
  recommendedAction: string;
  linkedTaskId?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: "Panou" | "Invertor" | "Baterie" | "Structură" | "Cablu" | "Protecție" | "Accesoriu";
  manufacturer: string;
  model: string;
  power?: string;
  datasheet?: string;
}

export interface InventoryItem {
  id: string;
  equipmentId: string;
  serialNumber: string;
  qrCode: string;
  status: "În stoc" | "Alocat proiect" | "Montat" | "Garanție expiră" | "Defect";
  warehouse: string;
  locationCode: string;
  projectId?: string;
  warrantyUntil: string;
}

export interface MaintenanceTicket {
  id: string;
  projectId: string;
  title: string;
  severity: "Scăzut" | "Mediu" | "Ridicat" | "Critic";
  status: "Nou" | "Alocat" | "În deplasare" | "În lucru" | "Închis";
  slaDueAt: string;
  assigneeId?: string;
  etaMinutes?: number;
}

export interface FundingCase {
  id: string;
  program: "PNRR" | "SEE Grants" | "Electric Up" | "Alte programe";
  projectId: string;
  valueRon: number;
  stage: "Verificare eligibilitate" | "Depunere" | "Evaluare" | "Contractare" | "Implementare";
  progress: number;
  deadline: string;
  ownerId: string;
}

export interface AuditCase {
  id: string;
  code: string;
  clientName: string;
  progress: number;
  deadline: string;
  ownerId: string;
}

export interface ESGMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "Task" | "Approval" | "Alert" | "Message";
  read: boolean;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  requesterId: string;
  ownerId: string;
  projectId?: string;
  status: ApprovalStatus;
  dueDate: string;
  priority: Priority;
}
