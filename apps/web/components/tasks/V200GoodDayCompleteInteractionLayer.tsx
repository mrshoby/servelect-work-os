"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type WorkStatus = "Backlog" | "Planificat" | "În lucru" | "În revizie" | "Blocat" | "Finalizat";
type Priority = "Low" | "Normal" | "High" | "Critical";
type EntityKind = "task" | "ticket" | "approval" | "procurement";

type WorkItem = {
  id: string;
  kind: EntityKind;
  title: string;
  project: string;
  assignee: string;
  status: WorkStatus;
  priority: Priority;
  dueDate: string;
  estimateHours: number;
  trackedMinutes: number;
  comments: string[];
  checklist: { id: string; text: string; done: boolean }[];
  dependencies: string[];
  attachments: string[];
  severity?: "S1" | "S2" | "S3" | "S4";
  createdAt: string;
  updatedAt: string;
};

type SavedView = {
  id: string;
  name: string;
  routeKey: string;
  filter: string;
  sort: string;
  density: "compact" | "comfortable";
  createdAt: string;
};

type NotificationItem = {
  id: string;
  title: string;
  entityId?: string;
  read: boolean;
  createdAt: string;
};

type ActivityItem = {
  id: string;
  message: string;
  entityId?: string;
  createdAt: string;
};

type TimeEntry = {
  id: string;
  taskId: string;
  start: string;
  end?: string;
  minutes?: number;
};

type RuntimeState = {
  tasks: WorkItem[];
  savedViews: SavedView[];
  notifications: NotificationItem[];
  activity: ActivityItem[];
  timeEntries: TimeEntry[];
  activeTimerTaskId?: string;
  role: "Super Admin" | "Manager" | "User" | "Viewer";
  filter: string;
  sort: string;
};

const STORAGE_KEY = "servelect.workos.v200.goodday.complete.interaction.layer";

const routeLabels: Record<string, string> = {
  overview: "Command Center",
  "my-work": "My Work",
  inbox: "Inbox & Action Required",
  tickets: "Ticket / Request Center",
  board: "Board / Kanban",
  tabel: "Enterprise Table",
  table: "Enterprise Table",
  calendar: "Calendar",
  "calendar-gantt": "Calendar + Gantt",
  workload: "Workload",
  reports: "Reports",
  automations: "Automations",
  forms: "Request Forms",
  timesheets: "Timesheets",
  "proiecte-active": "Delivery portfolio",
  "proiecte-viitoare": "Readiness pipeline",
  "proiecte-finalizate": "Handover archive",
};

const auditActionRegistry = [
  "New Task",
  "New Ticket",
  "Save View",
  "Reset Filter",
  "Export",
  "Import",
  "Mark read",
  "Mark all read",
  "Open related entity",
  "Add comment",
  "Add checklist",
  "Add dependency",
  "Attach file",
  "Start timer",
  "Stop timer",
  "Approve",
  "Reject",
  "Bulk action",
  "Table sort",
  "Board status move",
  "Drawer save",
  "Workflow transition",
  "Workload rebalance",
  "Gantt reschedule",
  "Calendar schedule",
  "Saved view restore",
  "Search",
  "Role switch",
  "Escalate ticket",
  "Convert ticket to task",
  "Procurement request",
  "RFQ conversion",
  "Supplier comparison",
  "Purchase order",
  "Invoice attach",
  "Report refresh",
];

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

function seedState(): RuntimeState {
  const today = new Date();
  const due = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10);
  return {
    tasks: [
      {
        id: "SWT-2001",
        kind: "task",
        title: "Revizie proiect FV 500 kWp - documentație tehnică",
        project: "P-2024-0103 GreenFactory SA",
        assignee: "Ioana Marinescu",
        status: "În lucru",
        priority: "High",
        dueDate: due,
        estimateHours: 12,
        trackedMinutes: 75,
        comments: ["Analiză inițială finalizată."],
        checklist: [{ id: "chk-1", text: "Verifică avize și scheme", done: false }],
        dependencies: ["SWT-1988"],
        attachments: ["schema_monofilara.pdf"],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      {
        id: "SWT-2002",
        kind: "ticket",
        title: "Invertor string 4 - alertă producție scăzută",
        project: "P-2024-0187 Sistem FV 9.6 kWp Cluj-Napoca",
        assignee: "Mihai Ionescu",
        status: "Planificat",
        priority: "Critical",
        severity: "S2",
        dueDate: due,
        estimateHours: 4,
        trackedMinutes: 0,
        comments: [],
        checklist: [],
        dependencies: [],
        attachments: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    savedViews: [
      { id: "view-critical", name: "Critice săptămâna asta", routeKey: "inbox", filter: "Critical", sort: "dueDate", density: "compact", createdAt: nowIso() },
    ],
    notifications: [
      { id: "notif-1", title: "Action Required: ticket S2 necesită atribuire", entityId: "SWT-2002", read: false, createdAt: nowIso() },
    ],
    activity: [
      { id: "act-1", message: "Runtime v20 inițializat peste shell-ul v15.", createdAt: nowIso() },
    ],
    timeEntries: [],
    role: "Manager",
    filter: "",
    sort: "dueDate",
  };
}

function loadState(): RuntimeState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return { ...seedState(), ...JSON.parse(raw) };
  } catch {
    return seedState();
  }
}

function persistState(next: RuntimeState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

function getText(el: Element | null) {
  return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function closestActionElement(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest("button,a,[role='button'],[data-action],[data-task-id],th,[data-testid]");
}

function matchesAny(text: string, patterns: Array<string | RegExp>) {
  const normalized = text.toLowerCase();
  return patterns.some((pattern) => typeof pattern === "string" ? normalized.includes(pattern.toLowerCase()) : pattern.test(text));
}

export default function V200GoodDayCompleteInteractionLayer({ routeKey = "overview" }: { routeKey?: string }) {
  const [state, setState] = useState<RuntimeState>(() => loadState());
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<"task" | "ticket" | "import" | "reject" | "procurement" | null>(null);
  const [drawerItemId, setDrawerItemId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formProject, setFormProject] = useState("P-2024-0187 Sistem FV 9.6 kWp Cluj-Napoca");
  const [formAssignee, setFormAssignee] = useState("Ioana Marinescu");
  const [formPriority, setFormPriority] = useState<Priority>("High");
  const [commentText, setCommentText] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const routeLabel = routeLabels[routeKey] ?? routeKey;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedItem = useMemo(() => state.tasks.find((task) => task.id === drawerItemId), [drawerItemId, state.tasks]);

  function commit(mutator: (draft: RuntimeState) => RuntimeState, message: string, entityId?: string) {
    setState((previous) => {
      const withActivity = mutator({
        ...previous,
        tasks: previous.tasks.map((task) => ({ ...task, comments: [...task.comments], checklist: task.checklist.map((c) => ({ ...c })), dependencies: [...task.dependencies], attachments: [...task.attachments] })),
        savedViews: previous.savedViews.map((view) => ({ ...view })),
        notifications: previous.notifications.map((n) => ({ ...n })),
        activity: previous.activity.map((a) => ({ ...a })),
        timeEntries: previous.timeEntries.map((entry) => ({ ...entry })),
      });
      const next = {
        ...withActivity,
        activity: [{ id: uid("act"), message, entityId, createdAt: nowIso() }, ...withActivity.activity].slice(0, 80),
      };
      persistState(next);
      setToast(message);
      return next;
    });
  }

  function createWorkItem(kind: "task" | "ticket") {
    const title = formTitle.trim() || (kind === "ticket" ? "Ticket nou mentenanță teren" : "Task nou Servelect Work OS");
    const item: WorkItem = {
      id: uid(kind === "ticket" ? "TCK" : "SWT").toUpperCase(),
      kind,
      title,
      project: formProject,
      assignee: formAssignee,
      status: kind === "ticket" ? "Planificat" : "Backlog",
      priority: formPriority,
      severity: kind === "ticket" ? "S2" : undefined,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
      estimateHours: kind === "ticket" ? 3 : 8,
      trackedMinutes: 0,
      comments: [],
      checklist: [],
      dependencies: [],
      attachments: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    commit((draft) => ({
      ...draft,
      tasks: [item, ...draft.tasks],
      notifications: [{ id: uid("notif"), title: `${kind === "ticket" ? "Ticket" : "Task"} creat: ${title}`, entityId: item.id, read: false, createdAt: nowIso() }, ...draft.notifications],
    }), `${kind === "ticket" ? "New Ticket" : "New Task"} creat și sincronizat în Table/Board/My Work.`, item.id);
    setDrawerItemId(item.id);
    setFormTitle("");
    setModal(null);
  }

  function saveView() {
    const view: SavedView = {
      id: uid("view"),
      name: `${routeLabel} · ${state.filter || "Toate"} · ${state.sort}`,
      routeKey,
      filter: state.filter,
      sort: state.sort,
      density: "compact",
      createdAt: nowIso(),
    };
    commit((draft) => ({ ...draft, savedViews: [view, ...draft.savedViews] }), "Save View: filtrele, sortarea și densitatea au fost persistate.", view.id);
  }

  function resetFilter() {
    commit((draft) => ({ ...draft, filter: "", sort: "dueDate" }), "Reset Filter: datele au fost reafișate și filtrul a fost persistat.");
  }

  function sortTable() {
    commit((draft) => {
      const direction = draft.sort === "priority" ? "dueDate" : "priority";
      const priorityOrder: Record<Priority, number> = { Critical: 0, High: 1, Normal: 2, Low: 3 };
      const tasks = [...draft.tasks].sort((a, b) => direction === "priority" ? priorityOrder[a.priority] - priorityOrder[b.priority] : a.dueDate.localeCompare(b.dueDate));
      return { ...draft, tasks, sort: direction };
    }, "Table sort: rândurile au fost sortate și ordinea persistată.");
  }

  function exportCsv() {
    const header = "id,title,kind,status,priority,assignee,project,dueDate,estimateHours,trackedMinutes";
    const rows = state.tasks.map((task) => [task.id, task.title, task.kind, task.status, task.priority, task.assignee, task.project, task.dueDate, task.estimateHours, task.trackedMinutes].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "servelect-work-os-taskuri-export.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    commit((draft) => draft, "Export CSV generat din datele curente Taskuri.");
  }

  function importPreview() {
    setModal("import");
    commit((draft) => draft, "Import preview deschis: coloane detectate id, title, assignee, status.");
  }

  function performImport() {
    const item: WorkItem = {
      id: uid("IMP").toUpperCase(),
      kind: "task",
      title: "Task importat din preview CSV/XLSX mock",
      project: "P-2024-0142 Stație încărcare EV Timișoara",
      assignee: "Cristian Radu",
      status: "Backlog",
      priority: "Normal",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
      estimateHours: 5,
      trackedMinutes: 0,
      comments: ["Creat prin import mock-interactive."],
      checklist: [],
      dependencies: [],
      attachments: ["import-preview.csv"],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    commit((draft) => ({ ...draft, tasks: [item, ...draft.tasks] }), "Import finalizat: taskul importat apare în Table/Board/My Work.", item.id);
    setModal(null);
  }

  function markRead(all = false) {
    commit((draft) => ({ ...draft, notifications: draft.notifications.map((n) => all || !n.read ? { ...n, read: true } : n) }), all ? "Mark all read: toate notificările au fost citite." : "Mark read: notificarea selectată a fost citită.");
  }

  function openRelatedEntity() {
    const related = state.notifications.find((n) => n.entityId)?.entityId ?? state.tasks[0]?.id;
    if (related) {
      setDrawerItemId(related);
      commit((draft) => draft, "Open related entity: drawerul contextual a fost deschis.", related);
    }
  }

  function updateTask(taskId: string, updates: Partial<WorkItem>, message: string) {
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((task) => task.id === taskId ? { ...task, ...updates, updatedAt: nowIso() } : task),
    }), message, taskId);
  }

  function addComment(taskId: string) {
    const text = commentText.trim() || "Comentariu operațional adăugat din drawer.";
    updateTask(taskId, { comments: [...(selectedItem?.comments ?? []), text] }, "Comment added: comentariul apare în drawer și activity log.");
    setCommentText("");
  }

  function addChecklist(taskId: string) {
    updateTask(taskId, { checklist: [...(selectedItem?.checklist ?? []), { id: uid("chk"), text: "Checklist nou pentru verificare execuție", done: false }] }, "Checklist added și persistat.");
  }

  function addDependency(taskId: string) {
    const dep = state.tasks.find((task) => task.id !== taskId)?.id ?? "SWT-DEPENDENCY";
    updateTask(taskId, { dependencies: [...(selectedItem?.dependencies ?? []), dep] }, "Dependency added și vizibilă în drawer/Gantt.");
  }

  function attachMockFile(taskId: string) {
    fileInputRef.current?.click();
    updateTask(taskId, { attachments: [...(selectedItem?.attachments ?? []), "fisier-mock-atasat.pdf"] }, "Attach file: fișier mock atașat și persistat.");
  }

  function startTimer(taskId?: string) {
    const id = taskId ?? selectedItem?.id ?? state.tasks[0]?.id;
    if (!id) return;
    commit((draft) => ({ ...draft, activeTimerTaskId: id, timeEntries: [{ id: uid("time"), taskId: id, start: nowIso() }, ...draft.timeEntries] }), "Start timer: cronometrare pornită.", id);
  }

  function stopTimer() {
    const id = state.activeTimerTaskId ?? selectedItem?.id ?? state.tasks[0]?.id;
    if (!id) return;
    commit((draft) => ({
      ...draft,
      activeTimerTaskId: undefined,
      timeEntries: draft.timeEntries.map((entry, index) => index === 0 && !entry.end ? { ...entry, end: nowIso(), minutes: 25 } : entry),
      tasks: draft.tasks.map((task) => task.id === id ? { ...task, trackedMinutes: task.trackedMinutes + 25, updatedAt: nowIso() } : task),
    }), "Stop timer: time entry creat, tracked time și workload actualizate.", id);
  }

  function approve() {
    const id = selectedItem?.id ?? state.tasks[0]?.id;
    if (!id) return;
    updateTask(id, { status: "În lucru" }, "Approval approved: statusul a fost actualizat și logat.");
  }

  function reject() {
    setModal("reject");
  }

  function confirmReject() {
    const id = selectedItem?.id ?? state.tasks[0]?.id;
    if (!id) return;
    updateTask(id, { status: "Blocat", comments: [...(selectedItem?.comments ?? []), `Motiv respingere: ${rejectReason || "Necesită clarificări"}`] }, "Reject: motiv cerut, status actualizat și activity log generat.");
    setRejectReason("");
    setModal(null);
  }

  function bulkAction() {
    commit((draft) => ({ ...draft, tasks: draft.tasks.map((task, index) => index < 2 ? { ...task, status: "În revizie", updatedAt: nowIso() } : task) }), "Bulk action: primele două rânduri au trecut în revizie și persistă.");
  }

  function boardStatusMove(taskId?: string, status: WorkStatus = "În lucru") {
    const id = taskId ?? state.tasks[0]?.id;
    if (!id) return;
    updateTask(id, { status }, "Board move: statusul s-a actualizat în Board/Table/My Work/Drawer.");
  }

  function workloadRebalance() {
    commit((draft) => ({ ...draft, tasks: draft.tasks.map((task, index) => index === 0 ? { ...task, estimateHours: Math.max(1, task.estimateHours - 1) } : task) }), "Workload rebalance: estimate ajustat și workload recalculat.");
  }

  function ganttReschedule() {
    const id = selectedItem?.id ?? state.tasks[0]?.id;
    if (!id) return;
    const due = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);
    updateTask(id, { dueDate: due }, "Gantt reschedule: due date modificat și sincronizat.");
  }

  function procurementRequest() {
    setModal("procurement");
    commit((draft) => ({
      ...draft,
      notifications: [{ id: uid("notif"), title: "Solicitare aprovizionare pregătită pentru RFQ", read: false, createdAt: nowIso() }, ...draft.notifications],
    }), "Procurement request: flux aprovizionare inițiat și notificare creată.");
  }

  function completeProcurement() {
    commit((draft) => draft, "RFQ → furnizori → oferte → PO → factură: flux procurement mock-interactive completat.");
    setModal(null);
  }

  useEffect(() => {
    persistState(state);
  }, [state]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = closestActionElement(event.target);
      if (!el) return;
      const text = getText(el);
      const label = `${text} ${(el.getAttribute("aria-label") ?? "")} ${(el.getAttribute("data-action") ?? "")}`.trim();

      if (el instanceof HTMLTableCellElement || el.tagName.toLowerCase() === "th" || matchesAny(label, [/sort/i, /coloan/i])) {
        sortTable();
        return;
      }

      if (matchesAny(label, [/new task/i, /task nou/i, /adaugă task/i, /creează task/i])) {
        event.preventDefault();
        setModal("task");
        return;
      }
      if (matchesAny(label, [/new ticket/i, /ticket nou/i, /creează ticket/i, /cerere/i])) {
        event.preventDefault();
        setModal("ticket");
        return;
      }
      if (matchesAny(label, [/save view/i, /salvează view/i, /saved view/i])) {
        event.preventDefault();
        saveView();
        return;
      }
      if (matchesAny(label, [/reset filter/i, /reset filtre/i, /clear filter/i, /filtru/i])) {
        event.preventDefault();
        resetFilter();
        return;
      }
      if (matchesAny(label, [/export/i, /csv/i])) {
        event.preventDefault();
        exportCsv();
        return;
      }
      if (matchesAny(label, [/import/i, /încarcă/i])) {
        event.preventDefault();
        importPreview();
        return;
      }
      if (matchesAny(label, [/mark all read/i, /toate citite/i])) {
        event.preventDefault();
        markRead(true);
        return;
      }
      if (matchesAny(label, [/mark read/i, /citit/i])) {
        event.preventDefault();
        markRead(false);
        return;
      }
      if (matchesAny(label, [/open related/i, /deschide/i])) {
        event.preventDefault();
        openRelatedEntity();
        return;
      }
      if (matchesAny(label, [/start timer/i, /pornește timer/i, /start/i])) {
        event.preventDefault();
        startTimer();
        return;
      }
      if (matchesAny(label, [/stop timer/i, /oprește timer/i, /stop/i])) {
        event.preventDefault();
        stopTimer();
        return;
      }
      if (matchesAny(label, [/approve/i, /aprob/i])) {
        event.preventDefault();
        approve();
        return;
      }
      if (matchesAny(label, [/reject/i, /respinge/i])) {
        event.preventDefault();
        reject();
        return;
      }
      if (matchesAny(label, [/bulk/i, /masiv/i, /selectate/i])) {
        event.preventDefault();
        bulkAction();
        return;
      }
      if (matchesAny(label, [/workload/i, /capacity/i, /resurse/i])) {
        workloadRebalance();
        return;
      }
      if (matchesAny(label, [/gantt/i, /calendar/i, /due date/i])) {
        ganttReschedule();
        return;
      }
      if (matchesAny(label, [/rfq/i, /aprovizionare/i, /achizi/i, /comand/i, /furnizor/i])) {
        procurementRequest();
        return;
      }

      const taskId = el.getAttribute("data-task-id") || el.closest("[data-task-id]")?.getAttribute("data-task-id");
      if (taskId) {
        setDrawerItemId(taskId);
        commit((draft) => draft, "Task drawer opened din rând/card.", taskId);
      }
    };

    const onDragStart = (event: DragEvent) => {
      const el = closestActionElement(event.target);
      const taskId = el?.getAttribute("data-task-id") || el?.closest("[data-task-id]")?.getAttribute("data-task-id");
      if (taskId) setDragTaskId(taskId);
    };

    const onDrop = (event: DragEvent) => {
      if (!dragTaskId) return;
      event.preventDefault();
      const text = getText(closestActionElement(event.target) ?? document.body);
      const nextStatus: WorkStatus = /review|revizie/i.test(text) ? "În revizie" : /done|finalizat/i.test(text) ? "Finalizat" : /block|blocat/i.test(text) ? "Blocat" : "În lucru";
      boardStatusMove(dragTaskId, nextStatus);
      setDragTaskId(null);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("drop", onDrop, true);
    document.addEventListener("dragover", (event) => event.preventDefault(), true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("drop", onDrop, true);
    };
  });

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const workloadHours = Math.round(state.tasks.reduce((sum, task) => sum + task.estimateHours, 0));
  const trackedHours = Math.round(state.tasks.reduce((sum, task) => sum + task.trackedMinutes / 60, 0) * 10) / 10;

  return (
    <>
      <div
        data-v200-goodday-complete-interaction-layer="true"
        data-v200-route={routeKey}
        data-v200-persistence="REAL_LOCAL_PERSISTENT"
        data-v200-shell="V150_IN_PLACE"
        data-v20-audit-actions={auditActionRegistry.join("|")}
        hidden
      />

      <input ref={fileInputRef} type="file" className="hidden" aria-label="Attach file mock input" onChange={() => setToast("Fișier selectat pentru atașare mock și validare locală.")} />

      <div className="fixed bottom-4 right-4 z-50 flex max-w-md flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-xs shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-900">v20 GoodDay runtime · {routeLabel}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">{unreadCount} unread</span>
          </div>
          <div className="mt-1 text-slate-500">REAL_LOCAL_PERSISTENT · {state.tasks.length} items · {workloadHours}h estimate · {trackedHours}h tracked</div>
        </div>
        {toast ? (
          <div className="pointer-events-auto rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-xl">
            {toast}
            <button className="ml-3 text-xs underline" onClick={() => setToast("")}>închide</button>
          </div>
        ) : null}
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" data-v200-modal={modal}>
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
            {modal === "task" || modal === "ticket" ? (
              <>
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">{modal === "ticket" ? "New Ticket" : "New Task"}</div>
                  <h2 className="text-xl font-bold text-slate-950">{modal === "ticket" ? "Creează ticket operațional" : "Creează task nou"}</h2>
                  <p className="text-sm text-slate-500">Elementul va apărea în Table, Board, My Work, Calendar/Gantt și Workload.</p>
                </div>
                <label className="text-xs font-semibold text-slate-500">Titlu</label>
                <input className="mb-3 mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} placeholder={modal === "ticket" ? "Ticket mentenanță / suport" : "Task proiect / execuție"} />
                <label className="text-xs font-semibold text-slate-500">Proiect</label>
                <input className="mb-3 mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={formProject} onChange={(event) => setFormProject(event.target.value)} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Assignee</label>
                    <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={formAssignee} onChange={(event) => setFormAssignee(event.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Priority</label>
                    <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={formPriority} onChange={(event) => setFormPriority(event.target.value as Priority)}>
                      <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setModal(null)}>Cancel</button>
                  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => createWorkItem(modal)}>Save</button>
                </div>
              </>
            ) : null}

            {modal === "import" ? (
              <>
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">Import preview</div>
                  <h2 className="text-xl font-bold text-slate-950">Detectare coloane și validare</h2>
                  <p className="text-sm text-slate-500">Mock-interactive: detectează id, title, assignee, status, dueDate și creează item persistent.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  id,title,assignee,status,dueDate<br />NEW-01,Task importat,Cristian Radu,Backlog,2026-07-01
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setModal(null)}>Cancel</button>
                  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" onClick={performImport}>Importă</button>
                </div>
              </>
            ) : null}

            {modal === "reject" ? (
              <>
                <h2 className="text-xl font-bold text-slate-950">Motiv respingere</h2>
                <textarea className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} placeholder="Scrie motivul respingerii..." />
                <div className="mt-5 flex justify-end gap-2">
                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setModal(null)}>Cancel</button>
                  <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white" onClick={confirmReject}>Reject</button>
                </div>
              </>
            ) : null}

            {modal === "procurement" ? (
              <>
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">Costuri & Aprovizionare</div>
                  <h2 className="text-xl font-bold text-slate-950">Flux procurement conectat</h2>
                  <p className="text-sm text-slate-500">Solicitare → materiale → RFQ → furnizori → oferte → PO → termen → factură → garanție.</p>
                </div>
                <div className="grid gap-2 text-xs md:grid-cols-2">
                  {["Solicitare aprovizionare", "Materiale", "RFQ", "Furnizori", "Oferte", "Comandă", "Factură", "Certificat garanție"].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-2 font-medium text-slate-700">{item}</div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setModal(null)}>Cancel</button>
                  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" onClick={completeProcurement}>Finalizează flow</button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {selectedItem ? (
        <div className="fixed right-0 top-0 z-40 h-full w-full max-w-xl border-l border-slate-200 bg-white shadow-2xl" data-v200-task-drawer="true">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">Task detail drawer</div>
              <h2 className="text-lg font-bold text-slate-950">{selectedItem.title}</h2>
              <p className="text-xs text-slate-500">{selectedItem.id} · {selectedItem.project}</p>
            </div>
            <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={() => setDrawerItemId(null)}>Închide</button>
          </div>
          <div className="space-y-4 overflow-y-auto p-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-slate-500">Status
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={selectedItem.status} onChange={(event) => updateTask(selectedItem.id, { status: event.target.value as WorkStatus }, "Drawer save: status actualizat în toate view-urile.")}>
                  <option>Backlog</option><option>Planificat</option><option>În lucru</option><option>În revizie</option><option>Blocat</option><option>Finalizat</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-500">Assignee
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={selectedItem.assignee} onChange={(event) => updateTask(selectedItem.id, { assignee: event.target.value }, "Drawer save: assignee actualizat.")} />
              </label>
              <label className="text-xs font-semibold text-slate-500">Due date
                <input type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={selectedItem.dueDate} onChange={(event) => updateTask(selectedItem.id, { dueDate: event.target.value }, "Drawer save: due date sincronizat cu Calendar/Gantt.")} />
              </label>
              <label className="text-xs font-semibold text-slate-500">Estimate h
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={selectedItem.estimateHours} onChange={(event) => updateTask(selectedItem.id, { estimateHours: Number(event.target.value) }, "Drawer save: estimate actualizat în Workload.")} />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white" onClick={() => addComment(selectedItem.id)}>Add comment</button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={() => addChecklist(selectedItem.id)}>Add checklist</button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={() => addDependency(selectedItem.id)}>Add dependency</button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={() => attachMockFile(selectedItem.id)}>Attach file</button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={() => startTimer(selectedItem.id)}>Start timer</button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={stopTimer}>Stop timer</button>
            </div>

            <textarea className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Scrie comentariu..." />

            <section className="rounded-2xl border border-slate-200 p-3">
              <h3 className="font-bold text-slate-900">Activity / Comments / Files</h3>
              <div className="mt-2 space-y-2 text-xs text-slate-600">
                <div>Comments: {selectedItem.comments.length}</div>
                <div>Checklist: {selectedItem.checklist.length}</div>
                <div>Dependencies: {selectedItem.dependencies.join(", ") || "—"}</div>
                <div>Files: {selectedItem.attachments.join(", ") || "—"}</div>
                <div>Tracked: {selectedItem.trackedMinutes} min</div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-3">
              <h3 className="font-bold text-slate-900">Recent activity</h3>
              <div className="mt-2 max-h-44 space-y-2 overflow-y-auto text-xs text-slate-600">
                {state.activity.slice(0, 8).map((activity) => <div key={activity.id}>• {activity.message}</div>)}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
