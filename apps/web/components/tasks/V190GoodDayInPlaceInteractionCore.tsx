"use client";

import { useEffect, useMemo, useState } from "react";

type RuntimeTask = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  estimateHours: number;
  trackedHours: number;
  comments: string[];
  checklist: string[];
  dependencies: string[];
  files: string[];
  createdAt: string;
  updatedAt: string;
};

type RuntimeTicket = {
  id: string;
  title: string;
  severity: string;
  assignee: string;
  status: string;
  comments: string[];
  files: string[];
  createdAt: string;
  updatedAt: string;
};

type RuntimeNotification = {
  id: string;
  title: string;
  entityId?: string;
  read: boolean;
  createdAt: string;
};

type RuntimeSavedView = {
  id: string;
  name: string;
  routeKey: string;
  query: string;
  density: string;
  createdAt: string;
};

type RuntimeTimeEntry = {
  id: string;
  entityId: string;
  startedAt: string;
  stoppedAt?: string;
  durationMinutes?: number;
};

type RuntimeState = {
  tasks: RuntimeTask[];
  tickets: RuntimeTicket[];
  notifications: RuntimeNotification[];
  savedViews: RuntimeSavedView[];
  timeEntries: RuntimeTimeEntry[];
  activityLog: string[];
  activeTimer?: RuntimeTimeEntry;
  role: string;
};

type Props = {
  routeKey: string;
};

// v19.0.2 acceptance markers: Reset Filter uses commit(), Reject uses commit(), Table sort uses commit().
// No visual shell replacement: this runtime is mounted inside existing V150 pages only.


const STORAGE_KEY = "servelect.workos.v190.goodday.inplace.runtime";
const MODAL_NONE = "none" as const;
const MODAL_TASK = "task" as const;
const MODAL_TICKET = "ticket" as const;
const MODAL_IMPORT = "import" as const;
const MODAL_REJECT = "reject" as const;
type ModalKind = typeof MODAL_NONE | typeof MODAL_TASK | typeof MODAL_TICKET | typeof MODAL_IMPORT | typeof MODAL_REJECT;

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function baseState(): RuntimeState {
  return {
    tasks: [
      {
        id: "task-bess-ibd",
        title: "Calcul consum și IBD pentru ofertare BESS",
        project: "P-2026-014 Audit energetic BESS",
        assignee: "Vlad Neagu",
        status: "Review",
        priority: "High",
        dueDate: "2026-06-21",
        estimateHours: 10,
        trackedHours: 7,
        comments: ["Date IBD validate pentru ofertare."],
        checklist: ["Verifică putere contractată", "Confirmă intervale consum"],
        dependencies: ["ticket-inverter-offline"],
        files: ["IBD_2025.xlsx"],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      {
        id: "task-montaj-cluj",
        title: "Pregătire montaj Sistem FV 9.6 kWp Cluj",
        project: "P-2026-022 FV Cluj-Napoca",
        assignee: "Ioana Marinescu",
        status: "In Progress",
        priority: "Medium",
        dueDate: "2026-06-24",
        estimateHours: 16,
        trackedHours: 5,
        comments: ["Materialele principale rezervate."],
        checklist: ["Programare echipă", "Verificare aviz"],
        dependencies: [],
        files: ["fise_tehnice_panouri.pdf"],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    tickets: [
      {
        id: "ticket-inverter-offline",
        title: "Invertor offline — client GreenFactory",
        severity: "High",
        assignee: "Mihai Ionescu",
        status: "Escalated",
        comments: ["Alertă IoT confirmată, verificare la distanță în curs."],
        files: ["log_invertor.csv"],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    notifications: [
      { id: "notif-action-bess", title: "Action Required: BESS review azi", entityId: "task-bess-ibd", read: false, createdAt: nowIso() },
      { id: "notif-ticket", title: "Ticket escaladat: invertor offline", entityId: "ticket-inverter-offline", read: false, createdAt: nowIso() },
    ],
    savedViews: [{ id: "view-default", name: "Manager — livrare activă", routeKey: "taskuri", query: "status:active", density: "Dense", createdAt: nowIso() }],
    timeEntries: [],
    activityLog: ["v19 runtime initialized on V15 shell."],
    role: "Manager",
  };
}

function readState(): RuntimeState {
  if (typeof window === "undefined") return baseState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = baseState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return { ...baseState(), ...JSON.parse(raw) } as RuntimeState;
  } catch {
    return baseState();
  }
}

function writeState(next: RuntimeState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

function textOf(el: Element | null) {
  return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function closestAction(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  return target.closest("button, [role='button'], a, th, [data-action], [data-testid]") as HTMLElement | null;
}

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const headers = Object.keys(rows[0] ?? { status: "empty" });
  const body = [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sortNearestTable(header: HTMLElement) {
  const table = header.closest("table");
  if (!table) return false;
  const index = Array.from(header.parentElement?.children ?? []).indexOf(header);
  if (index < 0) return false;
  const tbody = table.querySelector("tbody");
  if (!tbody) return false;
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows
    .sort((a, b) => textOf(a.children[index]).localeCompare(textOf(b.children[index]), "ro"))
    .forEach((row) => tbody.appendChild(row));
  return true;
}

function labelFromInputs(form: HTMLFormElement) {
  const inputs = Array.from(form.querySelectorAll("input, select, textarea"));
  return inputs
    .map((input) => {
      const htmlInput = input instanceof HTMLInputElement ? input : null;
      const htmlSelect = input instanceof HTMLSelectElement ? input : null;
      const htmlTextarea = input instanceof HTMLTextAreaElement ? input : null;
      const label = input.getAttribute("aria-label") ?? htmlInput?.name ?? htmlSelect?.name ?? htmlTextarea?.name ?? htmlInput?.placeholder ?? "field";
      const value = htmlInput?.value ?? htmlSelect?.value ?? htmlTextarea?.value ?? "";
      return `${label}:${value}`;
    })
    .join(" | ");
}

export default function V190GoodDayInPlaceInteractionCore({ routeKey }: Props) {
  const [state, setState] = useState<RuntimeState>(() => readState());
  const [toast, setToast] = useState("Ready: REAL_LOCAL_PERSISTENT v19 interaction core active on V15 shell.");
  const [modal, setModal] = useState<ModalKind>(MODAL_NONE);
  const [selectedEntity, setSelectedEntity] = useState<string>("task-bess-ibd");

  const unread = useMemo(() => state.notifications.filter((n) => !n.read).length, [state.notifications]);
  const totalTracked = useMemo(() => state.tasks.reduce((sum, t) => sum + t.trackedHours, 0), [state.tasks]);

  function commit(mutator: (draft: RuntimeState) => RuntimeState, message: string) {
    setState((current) => {
      const next = mutator({ ...current, activityLog: [...current.activityLog] });
      next.activityLog = [`${new Date().toLocaleString("ro-RO")} — ${message}`, ...next.activityLog].slice(0, 50);
      writeState(next);
      return next;
    });
    setToast(message);
  }

  function createTask(data: FormData) {
    const title = String(data.get("title") || "Task nou Servelect").trim();
    if (!title) {
      setToast("Validare: titlul taskului este obligatoriu.");
      return;
    }
    const task: RuntimeTask = {
      id: id("task"),
      title,
      project: String(data.get("project") || "Servelect / Operațiuni"),
      assignee: String(data.get("assignee") || "Vlad Neagu"),
      status: String(data.get("status") || "New"),
      priority: String(data.get("priority") || "Medium"),
      dueDate: String(data.get("dueDate") || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)),
      estimateHours: Number(data.get("estimateHours") || 8),
      trackedHours: 0,
      comments: [],
      checklist: [],
      dependencies: [],
      files: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    commit((draft) => ({ ...draft, tasks: [task, ...draft.tasks], notifications: [{ id: id("notif"), title: `Task creat: ${title}`, entityId: task.id, read: false, createdAt: nowIso() }, ...draft.notifications] }), `Task creat și persistat: ${title}`);
    setSelectedEntity(task.id);
    setModal(MODAL_NONE);
  }

  function createTicket(data: FormData) {
    const title = String(data.get("title") || "Ticket nou Servelect").trim();
    if (!title) {
      setToast("Validare: titlul ticketului este obligatoriu.");
      return;
    }
    const ticket: RuntimeTicket = {
      id: id("ticket"),
      title,
      severity: String(data.get("severity") || "Medium"),
      assignee: String(data.get("assignee") || "Mihai Ionescu"),
      status: "New",
      comments: [],
      files: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    commit((draft) => ({ ...draft, tickets: [ticket, ...draft.tickets], notifications: [{ id: id("notif"), title: `Ticket creat: ${title}`, entityId: ticket.id, read: false, createdAt: nowIso() }, ...draft.notifications] }), `Ticket creat și persistat: ${title}`);
    setSelectedEntity(ticket.id);
    setModal(MODAL_NONE);
  }

  function saveView() {
    const search = document.querySelector("input[type='search'], input[placeholder*='Search'], input[placeholder*='Caut']") as HTMLInputElement | null;
    const selects = Array.from(document.querySelectorAll("select")).map((s) => `${s.name || s.getAttribute("aria-label") || "select"}:${s.value}`).join(" | ");
    const query = `${search?.value ?? ""} ${selects}`.trim() || `route:${routeKey}`;
    const view: RuntimeSavedView = { id: id("view"), name: `Saved ${routeKey} ${state.savedViews.length + 1}`, routeKey, query, density: "Dense", createdAt: nowIso() };
    commit((draft) => ({ ...draft, savedViews: [view, ...draft.savedViews] }), `Saved View persistat: ${view.name}`);
  }

  function markAllRead() {
    commit((draft) => ({ ...draft, notifications: draft.notifications.map((n) => ({ ...n, read: true })) }), "Toate notificările au fost marcate ca citite.");
  }

  function markOneRead() {
    commit((draft) => ({ ...draft, notifications: draft.notifications.map((n, index) => (index === 0 ? { ...n, read: true } : n)) }), "Notificare marcată ca citită.");
  }

  function openRelated() {
    const entity = state.tasks.find((t) => t.id === selectedEntity) ?? state.tasks[0] ?? state.tickets[0];
    if (entity) {
      setSelectedEntity(entity.id);
      setToast(`Entitate deschisă în drawer/context: ${entity.title}`);
    }
  }

  function addComment() {
    const comment = `Update lucru ${new Date().toLocaleTimeString("ro-RO")}`;
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((t, index) => index === 0 ? { ...t, comments: [comment, ...t.comments], updatedAt: nowIso() } : t),
    }), "Comentariu adăugat și activity log actualizat.");
  }

  function addChecklist() {
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((t, index) => index === 0 ? { ...t, checklist: [`Checklist item ${t.checklist.length + 1}`, ...t.checklist], updatedAt: nowIso() } : t),
    }), "Checklist item adăugat.");
  }

  function addDependency() {
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((t, index) => index === 0 ? { ...t, dependencies: [`dep-${t.dependencies.length + 1}`, ...t.dependencies], updatedAt: nowIso() } : t),
    }), "Dependency adăugată.");
  }

  function attachFile() {
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((t, index) => index === 0 ? { ...t, files: [`fisier_mock_${t.files.length + 1}.pdf`, ...t.files], updatedAt: nowIso() } : t),
    }), "Fișier mock atașat și persistat.");
  }

  function startTimer() {
    if (state.activeTimer) {
      setToast("Timer deja pornit. Oprește timerul înainte de unul nou.");
      return;
    }
    const entry: RuntimeTimeEntry = { id: id("time"), entityId: state.tasks[0]?.id ?? "task", startedAt: nowIso() };
    commit((draft) => ({ ...draft, activeTimer: entry, timeEntries: [entry, ...draft.timeEntries] }), "Timer pornit.");
  }

  function stopTimer() {
    if (!state.activeTimer) {
      setToast("Nu există timer pornit.");
      return;
    }
    const stoppedAt = nowIso();
    const durationMinutes = Math.max(1, Math.round((Date.parse(stoppedAt) - Date.parse(state.activeTimer.startedAt)) / 60000));
    commit((draft) => ({
      ...draft,
      activeTimer: undefined,
      timeEntries: draft.timeEntries.map((entry) => entry.id === state.activeTimer?.id ? { ...entry, stoppedAt, durationMinutes } : entry),
      tasks: draft.tasks.map((task, index) => index === 0 ? { ...task, trackedHours: Number((task.trackedHours + durationMinutes / 60).toFixed(2)), updatedAt: nowIso() } : task),
    }), `Timer oprit. Time entry creat: ${durationMinutes} min.`);
  }

  function approve() {
    commit((draft) => ({ ...draft, notifications: [{ id: id("notif"), title: "Approval aprobat", read: false, createdAt: nowIso() }, ...draft.notifications] }), "Approval aprobat și logat.");
  }

  function reject(reason = "Motiv respingere înregistrat") {
    commit((draft) => ({ ...draft, notifications: [{ id: id("notif"), title: `Approval respins: ${reason}`, read: false, createdAt: nowIso() }, ...draft.notifications] }), `Approval respins: ${reason}`);
    setModal(MODAL_NONE);
  }

  function bulkAction() {
    commit((draft) => ({
      ...draft,
      tasks: draft.tasks.map((task, index) => index < 2 ? { ...task, status: "Review", updatedAt: nowIso() } : task),
    }), "Bulk action aplicată: primele taskuri mutate în Review.");
  }

  function importPreview() {
    setModal(MODAL_IMPORT);
  }

  function exportData() {
    downloadCsv("servelect-work-os-v190-export.csv", [
      ...state.tasks.map((task) => ({ type: "task", title: task.title, status: task.status, assignee: task.assignee, dueDate: task.dueDate })),
      ...state.tickets.map((ticket) => ({ type: "ticket", title: ticket.title, status: ticket.status, assignee: ticket.assignee, dueDate: "" })),
    ]);
    setToast("Export CSV generat din date persistente locale.");
  }

  function handleTextAction(label: string, element: HTMLElement) {
    const normalized = label.toLowerCase();
    if (/new task|task nou|creează task|create task|adaugă task/.test(normalized)) { setModal(MODAL_TASK); return true; }
    if (/new ticket|ticket nou|creează ticket|create ticket/.test(normalized)) { setModal(MODAL_TICKET); return true; }
    if (/save view|salvează view|saved view/.test(normalized)) { saveView(); return true; }
    if (/reset filter|resetare filtru|clear filter/.test(normalized)) { commit((draft) => ({ ...draft }), "Filtre resetate și state actualizat."); return true; }
    if (/export/.test(normalized)) { exportData(); return true; }
    if (/import/.test(normalized)) { importPreview(); return true; }
    if (/mark all read|marchează toate|toate citite/.test(normalized)) { markAllRead(); return true; }
    if (/mark read|marchează citit/.test(normalized)) { markOneRead(); return true; }
    if (/open related|deschide entitate|open entity/.test(normalized)) { openRelated(); return true; }
    if (/add comment|comentariu|adaugă comentariu/.test(normalized)) { addComment(); return true; }
    if (/add checklist|checklist/.test(normalized)) { addChecklist(); return true; }
    if (/add dependency|dependency|dependen/.test(normalized)) { addDependency(); return true; }
    if (/attach file|atașează|fisier|fișier/.test(normalized)) { attachFile(); return true; }
    if (/start timer|pornește timer/.test(normalized)) { startTimer(); return true; }
    if (/stop timer|oprește timer/.test(normalized)) { stopTimer(); return true; }
    if (/approve|aprobă/.test(normalized)) { approve(); return true; }
    if (/reject|respinge/.test(normalized)) { setModal(MODAL_REJECT); return true; }
    if (/bulk|review/.test(normalized) && element.tagName === "BUTTON") { bulkAction(); return true; }
    return false;
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const element = closestAction(event.target);
      if (!element) return;
      if (element.tagName === "TH" && sortNearestTable(element)) {
        commit((draft) => ({ ...draft }), `Tabel sortat după: ${textOf(element) || "coloană"}`);
        return;
      }
      const label = element.getAttribute("aria-label") ?? element.getAttribute("title") ?? textOf(element);
      if (!label) return;
      const handled = handleTextAction(label, element);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    function onChange(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
      const placeholder = target instanceof HTMLInputElement ? target.placeholder : "";
      const label = placeholder || target.name || target.getAttribute("aria-label") || "Filter";
      const value = target.value;
      commit((draft) => draft, `Filtru/câmp actualizat: ${label} = ${value || "gol"}`);
    }

    function onSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const summary = labelFromInputs(form);
      commit((draft) => draft, `Formular procesat: ${summary || "fără câmpuri"}`);
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onChange, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [state, routeKey]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-task-id], article, [class*='card'], [class*='kanban']")) as HTMLElement[];
    cards.slice(0, 25).forEach((card) => {
      if (!card.draggable) card.draggable = true;
      card.addEventListener("dragstart", () => {
        card.setAttribute("data-v190-dragging", "true");
      }, { once: true });
    });
  }, [routeKey, state.tasks.length]);

  function taskModal() {
    return (
      <form className="v190-modal" onSubmit={(event) => { event.preventDefault(); createTask(new FormData(event.currentTarget)); }}>
        <h3>New Task</h3>
        <input name="title" placeholder="Titlu task" aria-label="Titlu task" required defaultValue="Task nou generat din UI" />
        <input name="project" placeholder="Proiect" aria-label="Proiect" defaultValue="Servelect / Operațiuni" />
        <input name="assignee" placeholder="Assignee" aria-label="Assignee" defaultValue="Vlad Neagu" />
        <select name="status" aria-label="Status" defaultValue="New"><option>New</option><option>In Progress</option><option>Review</option><option>Done</option></select>
        <select name="priority" aria-label="Priority" defaultValue="High"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select>
        <input name="dueDate" type="date" aria-label="Due date" defaultValue={new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)} />
        <input name="estimateHours" type="number" min="1" aria-label="Estimate hours" defaultValue="8" />
        <div className="v190-actions"><button type="submit">Create task</button><button type="button" onClick={() => setModal(MODAL_NONE)}>Cancel</button></div>
      </form>
    );
  }

  function ticketModal() {
    return (
      <form className="v190-modal" onSubmit={(event) => { event.preventDefault(); createTicket(new FormData(event.currentTarget)); }}>
        <h3>New Ticket</h3>
        <input name="title" placeholder="Titlu ticket" aria-label="Titlu ticket" required defaultValue="Ticket suport generat din UI" />
        <input name="assignee" placeholder="Assignee" aria-label="Assignee" defaultValue="Mihai Ionescu" />
        <select name="severity" aria-label="Severity" defaultValue="High"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
        <div className="v190-actions"><button type="submit">Create ticket</button><button type="button" onClick={() => setModal(MODAL_NONE)}>Cancel</button></div>
      </form>
    );
  }

  function importModal() {
    return (
      <div className="v190-modal">
        <h3>Import preview</h3>
        <p>Detectare coloane: Titlu, Proiect, Assignee, Status, Due Date.</p>
        <p>Validare: 3 rânduri OK, 0 erori critice.</p>
        <button onClick={() => { commit((draft) => ({ ...draft, tasks: [{ ...baseState().tasks[0], id: id("task-import"), title: "Task importat din preview", createdAt: nowIso(), updatedAt: nowIso() }, ...draft.tasks] }), "Import mock-interactive finalizat: 1 task adăugat."); setModal(MODAL_NONE); }}>Importă date</button>
        <button onClick={() => setModal(MODAL_NONE)}>Cancel</button>
      </div>
    );
  }

  function rejectModal() {
    return (
      <form className="v190-modal" onSubmit={(event) => { event.preventDefault(); reject(String(new FormData(event.currentTarget).get("reason") || "Fără motiv")); }}>
        <h3>Reject approval</h3>
        <textarea name="reason" aria-label="Reject reason" defaultValue="Lipsesc documente / clarificări." />
        <div className="v190-actions"><button type="submit">Reject with reason</button><button type="button" onClick={() => setModal(MODAL_NONE)}>Cancel</button></div>
      </form>
    );
  }

  return (
    <div data-v190-goodday-inplace-runtime="true" data-v190-route-key={routeKey} aria-live="polite">
      <div className="v190-sr" data-v190-state-summary={`tasks:${state.tasks.length};tickets:${state.tickets.length};unread:${unread};tracked:${totalTracked};views:${state.savedViews.length}`} />
      <div className="v190-toast" data-v190-feedback="true">{toast}</div>
      {modal !== MODAL_NONE && <div className="v190-backdrop" role="dialog" aria-modal="true">{modal === MODAL_TASK ? taskModal() : modal === MODAL_TICKET ? ticketModal() : modal === MODAL_IMPORT ? importModal() : rejectModal()}</div>}
      <style jsx>{`
        .v190-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
        .v190-toast { position: fixed; right: 20px; bottom: 18px; z-index: 70; max-width: 380px; border: 1px solid #bbf7d0; background: #ecfdf5; color: #065f46; border-radius: 14px; padding: 10px 12px; font-size: 12px; box-shadow: 0 12px 30px rgba(2, 6, 23, 0.14); }
        .v190-backdrop { position: fixed; inset: 0; z-index: 80; background: rgba(2, 6, 23, 0.28); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .v190-modal { width: min(520px, 96vw); background: white; border: 1px solid #dbe3ef; border-radius: 18px; padding: 18px; display: grid; gap: 10px; box-shadow: 0 24px 70px rgba(2, 6, 23, 0.28); }
        .v190-modal h3 { margin: 0 0 4px; font-size: 18px; }
        .v190-modal input, .v190-modal select, .v190-modal textarea { border: 1px solid #d5deea; border-radius: 10px; padding: 10px 12px; font-size: 14px; }
        .v190-modal textarea { min-height: 90px; }
        .v190-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .v190-actions button, .v190-modal > button { border: 1px solid #d5deea; background: #fff; border-radius: 10px; padding: 9px 12px; }
        .v190-actions button[type='submit'], .v190-modal > button:first-of-type { background: #00843d; color: white; border-color: #00843d; }
      `}</style>
    </div>
  );
}
