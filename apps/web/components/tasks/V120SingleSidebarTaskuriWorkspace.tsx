"use client";

import { useMemo, useState } from "react";

type TaskuriView =
  | "overview"
  | "my-work"
  | "inbox"
  | "tickets"
  | "projects-active"
  | "projects-future"
  | "projects-done"
  | "board"
  | "table"
  | "calendar"
  | "workload"
  | "forms"
  | "timesheets"
  | "reports"
  | "automations";

type Props = {
  route?: string;
};

const users = ["Andrei Popescu", "Ioana Marinescu", "Mihai Ionescu", "Cristian Radu", "Alexandra Rusu", "George Stan", "Vlad Neagu", "Radu Pavel", "Elena Toma", "Marius Dascăl"];
const projects = [
  "P-2026-0187 Sistem FV 9.6 kWp Cluj-Napoca",
  "P-2026-0214 GreenFactory 500 kWp",
  "P-2026-0201 Stație încărcare EV Timișoara",
  "P-2026-0175 Mentenanță invertor Huawei Brașov",
  "P-2026-0199 Audit energetic Hală Oradea",
  "P-2026-0222 PIF + documentație ANRE Bistrița",
];
const statuses = ["Backlog", "To do", "In progress", "Review", "Blocked", "Done"];
const priorities = ["Urgent", "High", "Medium", "Low"];

const seedTasks = Array.from({ length: 48 }, (_, index) => ({
  id: `TSK-${String(index + 1).padStart(4, "0")}`,
  title: [
    "Validare stringuri DC și fișă tehnică panouri",
    "Actualizare Gantt pentru echipa de teren",
    "Confirmare document PIF semnat client",
    "Rezolvare alertă IoT invertor offline",
    "Rezervare materiale din stoc pentru lucrare",
    "Pregătire ofertă suplimentară optimizare BESS",
    "Verificare aviz ATR și atașamente tehnice",
    "Sincronizare pontaj cu ore proiect",
  ][index % 8],
  project: projects[index % projects.length],
  status: statuses[index % statuses.length],
  priority: priorities[index % priorities.length],
  assignee: users[index % users.length],
  owner: users[(index + 3) % users.length],
  due: `2026-07-${String((index % 24) + 1).padStart(2, "0")}`,
  estimate: 2 + (index % 9),
  tracked: 1 + (index % 7),
  comments: 1 + (index % 6),
  files: index % 5,
  checklist: `${index % 5}/${5}`,
  department: ["Audit", "Administrativ", "Automatizări", "Audit energetic", "Comercial", "Marketing", "Producție"][index % 7],
}));

const tickets = Array.from({ length: 14 }, (_, index) => ({
  id: `TCK-${String(index + 1).padStart(4, "0")}`,
  title: ["Invertor offline", "Client a cerut update ofertă", "Poză lipsă la PIF", "Echipament nealocat", "SLA intervenție risc", "Aprobarea managerului blocată", "Cerere formular service"][(index % 7)],
  severity: ["Critical", "High", "Medium", "Low"][index % 4],
  requester: users[(index + 2) % users.length],
  status: ["New", "Triaged", "Assigned", "Waiting client", "Escalated", "Resolved"][index % 6],
  sla: `${2 + index}h`,
}));

function viewFromRoute(route?: string): TaskuriView {
  if (!route) return "overview";
  if (route.includes("my-work")) return "my-work";
  if (route.includes("inbox")) return "inbox";
  if (route.includes("tickets")) return "tickets";
  if (route.includes("proiecte-active")) return "projects-active";
  if (route.includes("proiecte-viitoare")) return "projects-future";
  if (route.includes("proiecte-finalizate")) return "projects-done";
  if (route.includes("board")) return "board";
  if (route.includes("tabel") || route.includes("table")) return "table";
  if (route.includes("calendar")) return "calendar";
  if (route.includes("workload")) return "workload";
  if (route.includes("forms")) return "forms";
  if (route.includes("timesheets")) return "timesheets";
  if (route.includes("reports")) return "reports";
  if (route.includes("automations")) return "automations";
  return "overview";
}

export function V120SingleSidebarTaskuriWorkspace({ route = "/taskuri" }: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState(seedTasks[0].id);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("Ready");
  const view = viewFromRoute(route);
  const selectedTask = seedTasks.find((task) => task.id === selectedTaskId) ?? seedTasks[0];
  const filteredTasks = useMemo(() => seedTasks.filter((task) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || task.title.toLowerCase().includes(q) || task.project.toLowerCase().includes(q) || task.assignee.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [query, statusFilter]);
  const blocked = seedTasks.filter((task) => task.status === "Blocked").length;
  const overdue = seedTasks.filter((task, index) => index % 7 === 0).length;
  const workloadHours = seedTasks.reduce((sum, task) => sum + task.estimate, 0);

  function action(label: string) {
    setToast(`${label} · acțiune aplicată în UI local`);
  }

  return (
    <main data-v120-single-canonical-sidebar="true" className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto flex max-w-[1680px] gap-4 p-4">
        <div className="min-w-0 flex-1 space-y-3">
          <header className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">SERVELECT WORK OS · Taskuri</p>
                <h1 className="text-xl font-black tracking-tight">Taskuri Command Center</h1>
                <p className="text-xs text-slate-500">Meniul intern a fost eliminat. Navigarea rămâne exclusiv în sidebar-ul global din stânga aplicației.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search task, proiect, user" className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-emerald-500" />
                <button onClick={() => action("New Task")} className="rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white">New Task</button>
                <button onClick={() => action("New Ticket")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold">New Ticket</button>
                <button onClick={() => action("Save View")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold">Save View</button>
              </div>
            </div>
          </header>

          <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm text-xs font-bold">
            {["Overview", "My Work", "Inbox", "Tickets", "Board", "Table", "Calendar", "Gantt", "Workload", "Reports", "Automations"].map((item) => (
              <button key={item} onClick={() => action(`Switch ${item}`)} className="rounded-xl border border-slate-200 px-3 py-2 hover:border-emerald-400 hover:bg-emerald-50">{item}</button>
            ))}
          </nav>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            {[
              ["Open tasks", seedTasks.length],
              ["Blocked", blocked],
              ["Overdue", overdue],
              ["Tickets", tickets.length],
              ["Workload h", workloadHours],
              ["Saved views", 9],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black">{value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h2 className="text-sm font-black">{view === "board" ? "Kanban Board" : view === "table" ? "Enterprise Task Table" : view === "tickets" ? "Ticket / Request Center" : view === "workload" ? "Resource Workload" : "Dense Task Workspace"}</h2>
                  <p className="text-xs text-slate-500">{filteredTasks.length} rezultate · status/shared state local</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                    {['All', ...statuses].map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <button onClick={() => { setQuery(""); setStatusFilter("All"); action("Reset filters"); }} className="rounded-xl border border-slate-200 px-3 py-2 font-bold">Reset</button>
                  <button onClick={() => action("Export CSV")} className="rounded-xl border border-slate-200 px-3 py-2 font-bold">Export CSV</button>
                </div>
              </div>

              {view === "board" ? (
                <div className="grid gap-3 p-3 lg:grid-cols-3 2xl:grid-cols-6">
                  {statuses.map((status) => {
                    const columnTasks = filteredTasks.filter((task) => task.status === status).slice(0, 6);
                    return <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
                      <div className="mb-2 flex items-center justify-between text-xs font-black"><span>{status}</span><span>{columnTasks.length}</span></div>
                      <div className="space-y-2">
                        {columnTasks.map((task) => <button key={task.id} onClick={() => { setSelectedTaskId(task.id); action("Open drawer"); }} className="w-full rounded-xl border border-slate-200 bg-white p-2 text-left shadow-sm hover:border-emerald-400">
                          <p className="text-xs font-black">{task.id}</p>
                          <p className="text-sm font-bold leading-tight">{task.title}</p>
                          <p className="mt-1 truncate text-[11px] text-slate-500">{task.project}</p>
                          <div className="mt-2 flex flex-wrap gap-1 text-[10px]"><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{task.assignee}</span><span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">{task.priority}</span><span className="rounded-full bg-slate-100 px-2 py-1">💬 {task.comments}</span></div>
                        </button>)}
                      </div>
                    </div>;
                  })}
                </div>
              ) : view === "tickets" ? (
                <div className="overflow-auto p-3">
                  <table className="w-full min-w-[900px] text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="p-2">Ticket</th><th>Severity</th><th>Status</th><th>Requester</th><th>SLA</th><th>Actions</th></tr></thead>
                    <tbody>{tickets.map((ticket) => <tr key={ticket.id} className="border-t border-slate-100"><td className="p-2 font-bold">{ticket.id} · {ticket.title}</td><td>{ticket.severity}</td><td>{ticket.status}</td><td>{ticket.requester}</td><td>{ticket.sla}</td><td><button onClick={() => action(`Escalate ${ticket.id}`)} className="rounded-lg border px-2 py-1 font-bold">Escalate</button></td></tr>)}</tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-auto p-3">
                  <table className="w-full min-w-[1180px] text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="p-2"><input type="checkbox" /></th><th>ID</th><th>Task</th><th>Project</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due</th><th>Est</th><th>Tracked</th><th>Deps</th><th>Files</th><th>Actions</th></tr></thead>
                    <tbody>{filteredTasks.slice(0, 28).map((task) => <tr key={task.id} className="border-t border-slate-100 hover:bg-emerald-50/40"><td className="p-2"><input type="checkbox" /></td><td className="font-black">{task.id}</td><td><button onClick={() => setSelectedTaskId(task.id)} className="text-left font-bold text-slate-900 hover:text-emerald-700">{task.title}</button></td><td className="max-w-[220px] truncate">{task.project}</td><td>{task.status}</td><td>{task.priority}</td><td>{task.assignee}</td><td>{task.due}</td><td>{task.estimate}h</td><td>{task.tracked}h</td><td>2</td><td>{task.files}</td><td><button onClick={() => { setSelectedTaskId(task.id); action("Open drawer"); }} className="rounded-lg border px-2 py-1 font-bold">Open</button></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Task drawer</p>
                <h2 className="text-lg font-black">{selectedTask.id}</h2>
                <p className="text-sm font-bold text-slate-800">{selectedTask.title}</p>
              </div>
              <div className="space-y-3 p-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <label>Status<select defaultValue={selectedTask.status} onChange={() => action("Status update")} className="mt-1 w-full rounded-xl border p-2">{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
                  <label>Assignee<select defaultValue={selectedTask.assignee} onChange={() => action("Assignee update")} className="mt-1 w-full rounded-xl border p-2">{users.map((u) => <option key={u}>{u}</option>)}</select></label>
                  <label>Due date<input defaultValue={selectedTask.due} onBlur={() => action("Due date saved")} className="mt-1 w-full rounded-xl border p-2" /></label>
                  <label>Estimate<input defaultValue={`${selectedTask.estimate}`} onBlur={() => action("Estimate saved")} className="mt-1 w-full rounded-xl border p-2" /></label>
                </div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-black">Checklist</p>{["Documente tehnice", "Poze teren", "Validare manager", "Client update"].map((item, index) => <label key={item} className="mt-2 flex items-center gap-2"><input type="checkbox" defaultChecked={index < 2} onChange={() => action(`Checklist ${item}`)} /> {item}</label>)}</div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-black">Comments / activity</p><textarea onBlur={() => action("Comment added")} placeholder="Adaugă comentariu..." className="mt-2 h-20 w-full rounded-xl border p-2" /><p className="mt-2 text-slate-500">{selectedTask.comments} comments · {selectedTask.files} files · automation history tracked</p></div>
                <div className="grid grid-cols-2 gap-2"><button onClick={() => action("Start timer")} className="rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white">Start timer</button><button onClick={() => action("Stop timer")} className="rounded-xl border px-3 py-2 font-bold">Stop timer</button></div>
              </div>
            </aside>
          </section>

          <footer className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">Feedback: <span className="font-bold text-emerald-700">{toast}</span></footer>
        </div>
      </section>
    </main>
  );
}

export default V120SingleSidebarTaskuriWorkspace;
