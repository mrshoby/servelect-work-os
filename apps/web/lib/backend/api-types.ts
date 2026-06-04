import type {
  ActivityLog,
  ApprovalRequest,
  IoTAlert,
  MaintenanceTicket,
  Project,
  Task,
  TaskStatus
} from "@servelect/shared";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ListMeta = {
  total: number;
  limit: number;
  offset: number;
};

export type ProjectCreateInput = Pick<Project, "name" | "clientName" | "location"> &
  Partial<Pick<Project, "code" | "powerKwp" | "phase" | "progress" | "health" | "ownerId" | "ownerName" | "deadline" | "budgetRon">>;

export type ProjectUpdateInput = Partial<ProjectCreateInput> &
  Partial<Pick<Project, "workedHours" | "risks" | "documents">>;

export type TaskCreateInput = Pick<Task, "title"> &
  Partial<
    Pick<
      Task,
      | "description"
      | "projectId"
      | "projectCode"
      | "projectName"
      | "status"
      | "priority"
      | "assigneeId"
      | "assigneeName"
      | "ownerId"
      | "startDate"
      | "dueDate"
      | "estimateHours"
      | "trackedHours"
      | "tags"
      | "dependencies"
    >
  >;

export type TaskUpdateInput = Partial<TaskCreateInput> & {
  status?: TaskStatus;
};

export type CreateTaskFromAlertInput = {
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
};

export type DashboardAggregate = {
  projects: {
    total: number;
    active: number;
    risky: number;
  };
  tasks: {
    total: number;
    urgent: number;
    byStatus: Record<TaskStatus, number>;
  };
  operations: {
    openAlerts: number;
    openTickets: number;
    pendingApprovals: number;
  };
};

export type SearchResult = {
  id: string;
  type: "project" | "task" | "alert" | "ticket" | "approval";
  title: string;
  subtitle: string;
  href: string;
  status?: string;
};

export type AuditEvent = ActivityLog & {
  entityType: "project" | "task" | "alert" | "approval" | "system";
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export type BackendSnapshot = {
  projects: Project[];
  tasks: Task[];
  alerts: IoTAlert[];
  tickets: MaintenanceTicket[];
  approvals: ApprovalRequest[];
  auditLog: AuditEvent[];
};
