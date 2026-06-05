import type { Permission, Role } from "@servelect/shared";
import { rolePermissionMap } from "@/lib/auth/permissions";

export const SERVELECT_APP_VERSION = "1.0.0";
export const SERVELECT_APP_CHANNEL = "v1.0 Enterprise Work OS Baseline";

export type CapabilityStatus = "ready" | "foundation" | "mock" | "planned";

export type SystemCapability = {
  id: string;
  module: string;
  title: string;
  status: CapabilityStatus;
  description: string;
  requiredPermissions: Permission[];
  routes: string[];
};

export const systemCapabilities: SystemCapability[] = [
  {
    id: "workos-task-core",
    module: "Work OS",
    title: "Task & Project Core",
    status: "foundation",
    description: "Taskuri, proiecte, board, table, drawer și API mock/prisma-ready.",
    requiredPermissions: ["task:read", "task:write", "project:read", "project:write"],
    routes: ["/taskuri", "/proiecte", "/api/v1/tasks", "/api/v1/projects"]
  },
  {
    id: "action-center-v09",
    module: "Work OS",
    title: "Action Center task-first",
    status: "foundation",
    description: "Coadă unificată pentru taskuri urgente, alerte IoT, aprobări, tickete, dosare și riscuri de proiect.",
    requiredPermissions: ["task:read", "project:read"],
    routes: ["/action-center", "/api/v1/action-center"]
  },
  {
    id: "release-console-v10",
    module: "Administrare",
    title: "Release Console v1",
    status: "ready",
    description: "Manifest v1, release gates, checklist production readiness și roadmap de tranziție către DB/mobile/IoT real.",
    requiredPermissions: ["admin:manage"],
    routes: ["/admin/release", "/api/v1/release/manifest", "/api/v1/release/checklist"]
  },
  {
    id: "governance-rbac",
    module: "Administrare",
    title: "Protected App + RBAC",
    status: "foundation",
    description: "Sesiune demo cookie HTTP-only, autorizare API și permisiuni pe roluri Servelect.",
    requiredPermissions: ["admin:manage"],
    routes: ["/admin/users", "/api/v1/auth/session", "/api/v1/auth/authorize", "/api/v1/auth/impersonate"]
  },
  {
    id: "audit-log-v09",
    module: "Administrare",
    title: "Audit log operațional",
    status: "foundation",
    description: "Jurnal central pentru workflow-uri, RBAC, acțiuni critice și evenimente de sistem, pregătit pentru persistență DB.",
    requiredPermissions: ["admin:manage"],
    routes: ["/admin/audit", "/api/v1/audit/events"]
  },
  {
    id: "persistence-provider",
    module: "Backend",
    title: "Data Provider mock/prisma",
    status: "foundation",
    description: "Repository layer comutabil prin SERVELECT_DATA_PROVIDER. Mock implicit, Prisma/PostgreSQL pregătit.",
    requiredPermissions: ["admin:manage"],
    routes: ["/api/v1/system/status", "/api/v1/system/readiness"]
  },
  {
    id: "workflows-v08-v09",
    module: "Automatizări",
    title: "Workflow Templates & Executions",
    status: "foundation",
    description: "Template-uri operaționale și execuții demo cu audit event pentru alerte IoT, CRM, mentenanță și finanțări.",
    requiredPermissions: ["task:write"],
    routes: ["/workflows", "/api/v1/workflows/templates", "/api/v1/workflows/run", "/api/v1/workflows/executions"]
  },
  {
    id: "mobile-field",
    module: "Mobile",
    title: "Field Technician Mobile",
    status: "mock",
    description: "Expo skeleton și preview responsive pentru teren, dispatch, QR, GPS și offline sync conceptual.",
    requiredPermissions: ["task:read", "maintenance:read"],
    routes: ["/mobile"]
  },
  {
    id: "iot-real-connectors",
    module: "IoT / Energie",
    title: "Conectori reali MQTT/Modbus/API invertoare",
    status: "planned",
    description: "Următorul strat: ingestie reală telemetry, TimescaleDB, alerte reale și SLA automat.",
    requiredPermissions: ["iot:read", "iot:write"],
    routes: ["/iot"]
  }
];

export function getRoleMatrix() {
  const roles = Object.keys(rolePermissionMap) as Role[];
  return roles.map((role) => ({ role, permissions: rolePermissionMap[role], count: rolePermissionMap[role].length }));
}

export function countCapabilitiesByStatus() {
  return systemCapabilities.reduce<Record<CapabilityStatus, number>>(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { ready: 0, foundation: 0, mock: 0, planned: 0 }
  );
}
