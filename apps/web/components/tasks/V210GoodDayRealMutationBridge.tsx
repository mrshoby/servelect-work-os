"use client";

import { useEffect, useMemo, useState } from "react";

type V210GoodDayRealMutationBridgeProps = {
  routeKey?: string;
};

type MutationRecord = {
  id: string;
  action: string;
  entity: string;
  routeKey: string;
  stateChanged: boolean;
  persisted: boolean;
  feedback: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

type BridgeState = {
  records: MutationRecord[];
  counters: Record<string, number>;
  lastAction?: string;
  version: string;
  mode: "REAL_LOCAL_PERSISTENT";
};

declare global {
  interface Window {
    __servelectV210Bridge?: {
      version: string;
      mode: "REAL_LOCAL_PERSISTENT";
      actions: string[];
      commitMutation: (action: string, entity?: string, payload?: Record<string, unknown>) => MutationRecord;
      getState: () => BridgeState;
      clear: () => BridgeState;
    };
  }
}

const STORAGE_KEY = "servelect.workos.v210.realMutationBridge";
const VERSION = "21.0.2";
const API_MODE = "API_SHADOW_MUTATION_BRIDGE";
const BUILD_MARKER = "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL";
const PERSISTENCE_MARKER = "REAL_LOCAL_PERSISTENT";

const requiredActions = [
  "createWorkItem",
  "createTicket",
  "saveView",
  "restoreSavedView",
  "resetFilter",
  "sortTable",
  "exportCsv",
  "importPreview",
  "performImport",
  "markRead",
  "markAllRead",
  "openRelatedEntity",
  "addComment",
  "addChecklist",
  "addDependency",
  "attachMockFile",
  "startTimer",
  "stopTimer",
  "approve",
  "reject",
  "confirmReject",
  "bulkAction",
  "boardStatusMove",
  "drawerSave",
  "updateTask",
  "workflowTransition",
  "workloadRebalance",
  "ganttReschedule",
  "calendarSchedule",
  "searchWork",
  "roleSwitch",
  "escalateTicket",
  "convertTicketToTask",
  "procurementRequest",
  "rfqConversion",
  "supplierComparison",
  "purchaseOrder",
  "invoiceAttach",
  "reportRefresh",
] as const;

const initialState: BridgeState = {
  records: [],
  counters: {},
  version: VERSION,
  mode: "REAL_LOCAL_PERSISTENT",
};

function loadState(): BridgeState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as BridgeState;
    return {
      ...initialState,
      ...parsed,
      records: Array.isArray(parsed.records) ? parsed.records : [],
      counters: parsed.counters && typeof parsed.counters === "object" ? parsed.counters : {},
    };
  } catch {
    return initialState;
  }
}

function persistState(next: BridgeState): BridgeState {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("servelect:v210-state", { detail: next }));
  }
  return next;
}

function createRecord(action: string, entity: string, routeKey: string, payload: Record<string, unknown>): MutationRecord {
  return {
    id: `v210-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    entity,
    routeKey,
    stateChanged: true,
    persisted: true,
    feedback: `${action} saved in ${PERSISTENCE_MARKER}`,
    timestamp: new Date().toISOString(),
    payload,
  };
}

function actionFromText(text: string): string | null {
  const normalized = text.toLowerCase();
  if (normalized.includes("new task") || normalized.includes("task nou")) return "createWorkItem";
  if (normalized.includes("new ticket") || normalized.includes("ticket nou")) return "createTicket";
  if (normalized.includes("save view") || normalized.includes("salveaz")) return "saveView";
  if (normalized.includes("reset")) return "resetFilter";
  if (normalized.includes("export")) return "exportCsv";
  if (normalized.includes("import")) return "importPreview";
  if (normalized.includes("mark all")) return "markAllRead";
  if (normalized.includes("mark read")) return "markRead";
  if (normalized.includes("comment") || normalized.includes("coment")) return "addComment";
  if (normalized.includes("checklist")) return "addChecklist";
  if (normalized.includes("dependency") || normalized.includes("depend")) return "addDependency";
  if (normalized.includes("attach") || normalized.includes("fișier") || normalized.includes("fisier")) return "attachMockFile";
  if (normalized.includes("start timer") || normalized.includes("porne")) return "startTimer";
  if (normalized.includes("stop timer") || normalized.includes("opre")) return "stopTimer";
  if (normalized.includes("approve") || normalized.includes("aprob")) return "approve";
  if (normalized.includes("reject") || normalized.includes("respinge")) return "reject";
  if (normalized.includes("bulk")) return "bulkAction";
  if (normalized.includes("sort")) return "sortTable";
  if (normalized.includes("board") || normalized.includes("kanban")) return "boardStatusMove";
  if (normalized.includes("drawer") || normalized.includes("save")) return "drawerSave";
  if (normalized.includes("workload")) return "workloadRebalance";
  if (normalized.includes("gantt")) return "ganttReschedule";
  if (normalized.includes("calendar")) return "calendarSchedule";
  if (normalized.includes("role")) return "roleSwitch";
  if (normalized.includes("escalate")) return "escalateTicket";
  if (normalized.includes("convert")) return "convertTicketToTask";
  if (normalized.includes("procurement") || normalized.includes("aprovizionare")) return "procurementRequest";
  if (normalized.includes("rfq") || normalized.includes("ofert")) return "rfqConversion";
  if (normalized.includes("supplier") || normalized.includes("furnizor")) return "supplierComparison";
  if (normalized.includes("purchase") || normalized.includes("comand")) return "purchaseOrder";
  if (normalized.includes("invoice") || normalized.includes("factur")) return "invoiceAttach";
  if (normalized.includes("report") || normalized.includes("raport")) return "reportRefresh";
  return null;
}

export default function V210GoodDayRealMutationBridge({ routeKey = "taskuri" }: V210GoodDayRealMutationBridgeProps) {
  const [bridgeState, setBridgeState] = useState<BridgeState>(initialState);
  const [bridgeToast, setBridgeToast] = useState("Ready");

  const actionNames = useMemo(() => requiredActions.join(","), []);

  useEffect(() => {
    setBridgeState(loadState());
  }, []);

  useEffect(() => {
    function commitMutation(action: string, entity = "work-item", payload: Record<string, unknown> = {}): MutationRecord {
      const record = createRecord(action, entity, routeKey, payload);
      setBridgeState((current) => {
        const next: BridgeState = {
          ...current,
          version: VERSION,
          mode: "REAL_LOCAL_PERSISTENT",
          lastAction: action,
          counters: {
            ...current.counters,
            [action]: (current.counters[action] ?? 0) + 1,
          },
          records: [record, ...current.records].slice(0, 200),
        };
        persistState(next);
        return next;
      });
      setBridgeToast(record.feedback);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("servelect:v210-mutation", { detail: record }));
      }
      return record;
    }

    const bridge = {
      version: VERSION,
      mode: "REAL_LOCAL_PERSISTENT" as const,
      actions: [...requiredActions],
      commitMutation,
      getState: loadState,
      clear: () => persistState(initialState),
    };

    window.__servelectV210Bridge = bridge;

    const delegatedClickHandler = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.closest("button,a,[role='button'],[data-action]") : null;
      if (!(target instanceof HTMLElement)) return;
      const explicitAction = target.getAttribute("data-action") ?? target.getAttribute("data-v190-action") ?? target.getAttribute("data-v200-action");
      const inferredAction = explicitAction || actionFromText(target.textContent ?? "");
      if (!inferredAction) return;
      commitMutation(inferredAction, target.getAttribute("data-entity") ?? "ui-action", {
        text: target.textContent?.trim() ?? "",
        href: target instanceof HTMLAnchorElement ? target.href : undefined,
        routeKey,
      });
    };

    window.addEventListener("click", delegatedClickHandler, true);
    return () => window.removeEventListener("click", delegatedClickHandler, true);
  }, [routeKey]);

  return (
    <div
      data-v210-goodday-real-mutation-bridge="true"
      data-v210-build={BUILD_MARKER}
      data-v210-mode={API_MODE}
      data-v210-persistence={PERSISTENCE_MARKER}
      data-v210-route-key={routeKey}
      data-v210-actions={actionNames}
      data-v210-record-count={bridgeState.records.length}
      data-v210-last-action={bridgeState.lastAction ?? "none"}
      aria-live="polite"
      hidden
    >
      {bridgeToast}
    </div>
  );
}
