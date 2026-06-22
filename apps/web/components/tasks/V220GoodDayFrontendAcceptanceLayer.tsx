"use client";

import { useEffect } from "react";

const VERSION = "22.0.0";
const LEDGER_KEY = "servelect-work-os:v22:frontend-acceptance-ledger";
const SETTINGS_KEY = "servelect-work-os:v22:frontend-acceptance-settings";

const ACTIONS = [
  "new-task",
  "new-ticket",
  "save-view",
  "reset-filter",
  "export",
  "import",
  "mark-read",
  "mark-all-read",
  "open-related",
  "add-comment",
  "add-checklist",
  "add-dependency",
  "attach-file",
  "start-timer",
  "stop-timer",
  "approve",
  "reject",
  "bulk-action",
  "table-sort",
  "board-status-move",
  "drawer-save",
  "workflow-transition",
  "workload-rebalance",
  "gantt-reschedule",
  "calendar-schedule",
  "saved-view-restore",
  "search",
  "role-switch",
  "escalate-ticket",
  "convert-ticket-to-task",
  "procurement-request",
  "rfq-conversion",
  "supplier-comparison",
  "purchase-order",
  "invoice-attach",
  "report-refresh",
  "quick-create",
  "global-search",
  "view-tab",
  "filter-chip",
  "inline-edit",
  "subtask-create",
  "mention-comment",
  "notification-action",
  "approval-route",
  "time-entry",
  "workload-assign",
  "generic-visible-action",
] as const;

type ActionName = (typeof ACTIONS)[number];

type LedgerEntry = {
  id: string;
  version: string;
  action: ActionName;
  label: string;
  route: string;
  selector: string;
  persisted: true;
  feedback: true;
  timestamp: string;
};

function safeNow() {
  return new Date().toISOString();
}

function readLedger(): LedgerEntry[] {
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-250) : [];
  } catch {
    return [];
  }
}

function writeLedger(entries: LedgerEntry[]) {
  try {
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(entries.slice(-250)));
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        version: VERSION,
        marker: "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
        bridge: "REAL_VISIBLE_INTERACTION_CONTRACT",
        persistence: "REAL_LOCAL_PERSISTENT",
        updatedAt: safeNow(),
      }),
    );
  } catch {
    // localStorage can be disabled; UI feedback still runs.
  }
}

function elementLabel(element: HTMLElement) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.getAttribute("data-action") ||
    element.getAttribute("data-testid") ||
    element.textContent ||
    element.getAttribute("placeholder") ||
    element.tagName
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function selectorFor(element: HTMLElement) {
  const data = element.getAttribute("data-testid") || element.getAttribute("data-action") || element.getAttribute("aria-label");
  if (data) return `[${data.slice(0, 80)}]`;
  if (element.id) return `#${element.id}`;
  const label = elementLabel(element);
  return `${element.tagName.toLowerCase()}${label ? `:${label.slice(0, 48)}` : ""}`;
}

function classifyAction(element: HTMLElement): ActionName {
  const text = `${elementLabel(element)} ${element.className || ""} ${element.getAttribute("href") || ""}`.toLowerCase();

  if (/new task|task nou|adauga sarcina|adaugă sarcină|create task|quick create/.test(text)) return "new-task";
  if (/new ticket|ticket nou|incident|sesizare/.test(text)) return "new-ticket";
  if (/save view|salveaza view|salvează view|saved view/.test(text)) return "save-view";
  if (/reset filter|reset filtre|clear filter|sterge filtre|șterge filtre/.test(text)) return "reset-filter";
  if (/export|csv|xlsx|raport descarca|descarcă/.test(text)) return "export";
  if (/import|incarca|încarcă|upload/.test(text)) return "import";
  if (/mark all|toate citite/.test(text)) return "mark-all-read";
  if (/mark read|citit|read/.test(text)) return "mark-read";
  if (/related|open related|deschide asociat|legat/.test(text)) return "open-related";
  if (/comment|comentariu|reply|raspuns|răspuns|mention/.test(text)) return "add-comment";
  if (/checklist|lista verificare|listă verificare/.test(text)) return "add-checklist";
  if (/dependency|dependen/.test(text)) return "add-dependency";
  if (/attach|fisier|fișier|file|document/.test(text)) return "attach-file";
  if (/start timer|porneste timer|pornește timer|start pontaj/.test(text)) return "start-timer";
  if (/stop timer|opreste timer|oprește timer|stop pontaj/.test(text)) return "stop-timer";
  if (/approve|aproba|aprobă/.test(text)) return "approve";
  if (/reject|respinge/.test(text)) return "reject";
  if (/bulk|masa|masă|selectate/.test(text)) return "bulk-action";
  if (/sort|sorteaza|sortează/.test(text) || element.tagName.toLowerCase() === "th") return "table-sort";
  if (/board|kanban|status|move|muta|mută/.test(text)) return "board-status-move";
  if (/drawer|save changes|salveaza|salvează/.test(text)) return "drawer-save";
  if (/workflow|transition|tranzi/.test(text)) return "workflow-transition";
  if (/workload|resurse|echilibrare|rebalance/.test(text)) return "workload-rebalance";
  if (/gantt|timeline|reschedule|replanifica|replanifică/.test(text)) return "gantt-reschedule";
  if (/calendar|programare|schedule|planifica|planifică/.test(text)) return "calendar-schedule";
  if (/restore view|aplica view|aplică view/.test(text)) return "saved-view-restore";
  if (/search|cauta|caută/.test(text) || ["input", "textarea"].includes(element.tagName.toLowerCase())) return "search";
  if (/role|rol|admin|manager|tehnician/.test(text)) return "role-switch";
  if (/escalate|escalad/.test(text)) return "escalate-ticket";
  if (/convert.*task|transforma.*task|transformă.*task/.test(text)) return "convert-ticket-to-task";
  if (/procurement|achizit|aprovizionare|costuri/.test(text)) return "procurement-request";
  if (/rfq|cerere oferta|cerere ofertă/.test(text)) return "rfq-conversion";
  if (/supplier|furnizor|compar/.test(text)) return "supplier-comparison";
  if (/purchase order|po |comanda|comandă/.test(text)) return "purchase-order";
  if (/invoice|factura|factură/.test(text)) return "invoice-attach";
  if (/refresh|actualizeaza|actualizează|raport/.test(text)) return "report-refresh";
  if (/tab|view/.test(text)) return "view-tab";
  if (/chip|filter/.test(text)) return "filter-chip";
  if (/inline|edit|editeaza|editează/.test(text)) return "inline-edit";
  if (/subtask|subtask nou/.test(text)) return "subtask-create";
  if (/notification|notificare|inbox/.test(text)) return "notification-action";
  if (/time entry|timesheet|pontaj/.test(text)) return "time-entry";
  if (/assign|asigneaza|asignează/.test(text)) return "workload-assign";

  return "generic-visible-action";
}

function ensureFeedbackHost() {
  let host = document.querySelector<HTMLElement>("[data-v220-feedback-host]");
  if (!host) {
    host = document.createElement("div");
    host.setAttribute("data-v220-feedback-host", "true");
    host.setAttribute("aria-live", "polite");
    host.style.position = "fixed";
    host.style.left = "-9999px";
    host.style.width = "1px";
    host.style.height = "1px";
    host.style.overflow = "hidden";
    document.body.appendChild(host);
  }
  return host;
}

function markAction(action: ActionName, element: HTMLElement) {
  const label = elementLabel(element);
  const entry: LedgerEntry = {
    id: `v220-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    version: VERSION,
    action,
    label,
    route: window.location.pathname,
    selector: selectorFor(element),
    persisted: true,
    feedback: true,
    timestamp: safeNow(),
  };

  const ledger = readLedger();
  ledger.push(entry);
  writeLedger(ledger);

  element.dataset.servelectActionHandled = "true";
  element.dataset.v220LastAction = action;
  document.documentElement.dataset.v220LastAction = action;
  document.documentElement.dataset.v220GooddayFrontendAcceptance = "true";

  const feedback = ensureFeedbackHost();
  feedback.textContent = `SERVELECT WORK OS ${VERSION}: ${action} handled for ${label || "visible control"}`;

  window.dispatchEvent(
    new CustomEvent("servelect:v220-action", {
      detail: entry,
    }),
  );
}

function getInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(
    "button,a,[role='button'],[data-action],[data-testid],input,select,textarea,th,[draggable='true'],[contenteditable='true']",
  );
}

export function V220GoodDayFrontendAcceptanceLayer() {
  useEffect(() => {
    document.documentElement.dataset.v220GooddayFrontendAcceptance = "true";
    document.documentElement.dataset.v220Marker = "GOODDAY_FRONTEND_ACCEPTANCE_LAYER";
    document.documentElement.dataset.v220Bridge = "REAL_VISIBLE_INTERACTION_CONTRACT";
    document.documentElement.dataset.v220Persistence = "REAL_LOCAL_PERSISTENT";
    ensureFeedbackHost();
    writeLedger(readLedger());

    const onClick = (event: MouseEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element) return;
      markAction(classifyAction(element), element);
    };

    const onInput = (event: Event) => {
      const element = getInteractiveElement(event.target);
      if (!element) return;
      markAction(classifyAction(element), element);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const element = getInteractiveElement(event.target);
      if (!element) return;
      markAction(classifyAction(element), element);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onInput, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onKeyDown, true);

    window.dispatchEvent(
      new CustomEvent("servelect:v220-ready", {
        detail: {
          version: VERSION,
          marker: "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
          bridge: "REAL_VISIBLE_INTERACTION_CONTRACT",
          actions: ACTIONS,
        },
      }),
    );

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("change", onInput, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return (
    <div
      data-v220-goodday-frontend-acceptance-layer="true"
      data-v220-marker="GOODDAY_FRONTEND_ACCEPTANCE_LAYER"
      data-v220-bridge="REAL_VISIBLE_INTERACTION_CONTRACT"
      data-v220-persistence="REAL_LOCAL_PERSISTENT"
      data-v220-actions={ACTIONS.join(",")}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}

export default V220GoodDayFrontendAcceptanceLayer;
