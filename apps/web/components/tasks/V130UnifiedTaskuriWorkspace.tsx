'use client';

import { useEffect, useMemo, useState } from 'react';

type V130Task = {
  id: string;
  title: string;
  project: string;
  client: string;
  department: string;
  type: string;
  status: 'Backlog' | 'To do' | 'In progress' | 'Review' | 'Blocked' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  owner: string;
  dueDate: string;
  startDate: string;
  estimate: number;
  tracked: number;
  progress: number;
  comments: number;
  files: number;
  checklistDone: number;
  checklistTotal: number;
  tags: string[];
};

type V130Ticket = {
  id: string;
  title: string;
  client: string;
  project: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Triaged' | 'Assigned' | 'Escalated' | 'Resolved';
  slaHours: number;
  technician: string;
};

type Props = {
  route?: string;
};

const users = ['Andrei Popescu', 'Ioana Marinescu', 'Mihai Ionescu', 'Cristian Radu', 'Alexandra Rusu', 'George Stan', 'Vlad Neagu', 'Elena Pavel', 'Radu Matei', 'Bianca Dima'];
const projects = [
  'P-2026-0187 FV 9.6 kWp Cluj-Napoca',
  'P-2026-0142 Stație încărcare EV Timișoara',
  'P-2026-0103 FV 500 kWp GreenFactory SA',
  'P-2026-0201 BESS 1.2 MWh Baia Mare',
  'P-2026-0214 Audit energetic Primăria Oradea',
  'P-2026-0220 Mentenanță Huawei invertoare',
  'P-2026-0225 PIF sistem prosumator Bistrița',
  'P-2026-0232 Ofertare parc FV industrial',
];
const statuses: V130Task['status'][] = ['Backlog', 'To do', 'In progress', 'Review', 'Blocked', 'Done'];
const priorities: V130Task['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
const departments = ['Audit energetic', 'Comercial', 'Producție', 'Automatizări', 'Administrativ', 'Mentenanță', 'Marketing'];
const types = ['Task', 'Subtask', 'Intervenție', 'Document', 'Aprobare', 'Achiziție', 'IoT alert', 'Pontaj'];

function createTasks(): V130Task[] {
  return Array.from({ length: 64 }, (_, index) => {
    const status = statuses[index % statuses.length];
    const priority = priorities[(index + 1) % priorities.length];
    const project = projects[index % projects.length];
    const assignee = users[index % users.length];
    return {
      id: `TSK-${String(index + 1).padStart(4, '0')}`,
      title: [
        'Verifică documentație PIF și anexele tehnice',
        'Actualizează grafic montaj panouri și echipa teren',
        'Rezolvă alertă invertor offline și atașează poze',
        'Pregătește ofertă finală cu deviz și timeline',
        'Confirmă achiziția cablurilor și seriile QR',
        'Revizuiește checklist ANRE/SSM pentru intervenție',
        'Completează raport audit energetic și concluzii',
        'Sincronizează ore pontaj cu workload-ul proiectului',
      ][index % 8],
      project,
      client: ['GreenFactory SA', 'Primăria Oradea', 'Otel Inox', 'Solar Retail SRL', 'Eco Campus'][index % 5],
      department: departments[index % departments.length],
      type: types[index % types.length],
      status,
      priority,
      assignee,
      owner: users[(index + 3) % users.length],
      dueDate: `2026-06-${String((index % 24) + 3).padStart(2, '0')}`,
      startDate: `2026-06-${String((index % 18) + 1).padStart(2, '0')}`,
      estimate: 2 + (index % 18),
      tracked: 1 + (index % 11),
      progress: status === 'Done' ? 100 : Math.min(95, 12 + index * 7 % 84),
      comments: index % 9,
      files: index % 6,
      checklistDone: index % 5,
      checklistTotal: 5,
      tags: ['PV', 'PIF', 'ANRE', 'IoT', 'BESS', 'CRM', 'Pontaj'].slice(0, (index % 4) + 2),
    };
  });
}

function createTickets(): V130Ticket[] {
  return Array.from({ length: 18 }, (_, index) => ({
    id: `TCK-${String(index + 1).padStart(4, '0')}`,
    title: ['Invertor Huawei offline', 'Client a trimis document lipsă', 'Echipament fără serie QR', 'SLA depășit la intervenție', 'Cerere ofertare urgentă'][index % 5],
    client: ['GreenFactory SA', 'Primăria Oradea', 'Otel Inox', 'Solar Retail SRL'][index % 4],
    project: projects[index % projects.length],
    severity: priorities[(index + 2) % priorities.length] as V130Ticket['severity'],
    status: ['New', 'Triaged', 'Assigned', 'Escalated', 'Resolved'][index % 5] as V130Ticket['status'],
    slaHours: 4 + index * 2,
    technician: users[(index + 4) % users.length],
  }));
}

function usePersistentTasks() {
  const [tasks, setTasks] = useState<V130Task[]>(() => createTasks());
  const [tickets, setTickets] = useState<V130Ticket[]>(() => createTickets());
  const [selectedTaskId, setSelectedTaskId] = useState('TSK-0001');
  const [role, setRole] = useState('Manager');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('Workspace pregătit. Toate acțiunile vizibile modifică starea locală.');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('servelect:v130:taskuri-state');
      if (raw) {
        const parsed = JSON.parse(raw) as { tasks?: V130Task[]; tickets?: V130Ticket[]; role?: string };
        if (parsed.tasks?.length) setTasks(parsed.tasks);
        if (parsed.tickets?.length) setTickets(parsed.tickets);
        if (parsed.role) setRole(parsed.role);
      }
    } catch {
      // local recovery keeps seeded state
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('servelect:v130:taskuri-state', JSON.stringify({ tasks, tickets, role }));
    } catch {
      // local persistence boundary only
    }
  }, [tasks, tickets, role]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const filteredTasks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tasks;
    return tasks.filter((task) => `${task.id} ${task.title} ${task.project} ${task.client} ${task.assignee} ${task.status}`.toLowerCase().includes(needle));
  }, [tasks, query]);

  const updateTask = (id: string, patch: Partial<V130Task>, action: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
    setSelectedTaskId(id);
    setMessage(`${action}: ${id}`);
  };

  const addTask = () => {
    const id = `TSK-${String(tasks.length + 1).padStart(4, '0')}`;
    const task: V130Task = {
      ...createTasks()[0],
      id,
      title: 'Task nou creat din Quick Create — verificare Servelect',
      status: 'To do',
      assignee: users[tasks.length % users.length],
      owner: role,
      dueDate: '2026-06-28',
    };
    setTasks((current) => [task, ...current]);
    setSelectedTaskId(id);
    setMessage(`New Task creat: ${id}`);
  };

  const addTicket = () => {
    const id = `TCK-${String(tickets.length + 1).padStart(4, '0')}`;
    setTickets((current) => [{ ...createTickets()[0], id, status: 'New', title: 'Ticket nou — solicitare teren Servelect' }, ...current]);
    setMessage(`New Ticket creat: ${id}`);
  };

  const convertTicket = (ticket: V130Ticket) => {
    const id = `TSK-${String(tasks.length + 1).padStart(4, '0')}`;
    setTasks((current) => [{ ...createTasks()[1], id, title: `Task din ticket: ${ticket.title}`, project: ticket.project, assignee: ticket.technician, priority: ticket.severity, status: 'To do' }, ...current]);
    setTickets((current) => current.map((item) => (item.id === ticket.id ? { ...item, status: 'Assigned' } : item)));
    setSelectedTaskId(id);
    setMessage(`Ticket convertit în task: ${ticket.id} → ${id}`);
  };

  const bulkMoveToReview = () => {
    const ids = filteredTasks.slice(0, 3).map((task) => task.id);
    setTasks((current) => current.map((task) => (ids.includes(task.id) ? { ...task, status: 'Review' } : task)));
    setMessage(`Bulk Action: ${ids.length} taskuri mutate în Review`);
  };

  const exportCsv = () => {
    const header = 'id,title,project,status,priority,assignee,dueDate,estimate,tracked';
    const rows = filteredTasks.map((task) => [task.id, task.title, task.project, task.status, task.priority, task.assignee, task.dueDate, task.estimate, task.tracked].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','));
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'servelect-taskuri-v13-export.csv';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Export CSV generat pentru lista filtrată');
  };

  return { tasks, tickets, selectedTask, selectedTaskId, setSelectedTaskId, filteredTasks, updateTask, addTask, addTicket, convertTicket, bulkMoveToReview, exportCsv, role, setRole, query, setQuery, message };
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">{children}</span>;
}

function ToneBadge({ value }: { value: string }) {
  const tone = value === 'Critical' || value === 'Blocked' || value === 'Escalated' ? 'border-red-200 bg-red-50 text-red-700' : value === 'High' || value === 'Review' ? 'border-amber-200 bg-amber-50 text-amber-700' : value === 'Done' || value === 'Resolved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700';
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${tone}`}>{value}</span>;
}

export function V130UnifiedTaskuriWorkspace({ route = '/taskuri' }: Props) {
  const state = usePersistentTasks();
  const { filteredTasks, selectedTask, updateTask, setSelectedTaskId, tickets } = state;
  const byStatus = statuses.map((status) => ({ status, tasks: filteredTasks.filter((task) => task.status === status) }));
  const activeTasks = filteredTasks.filter((task) => task.status !== 'Done').length;
  const overdue = filteredTasks.filter((task) => task.status !== 'Done' && Number(task.dueDate.slice(-2)) < 16).length;
  const workloadHours = filteredTasks.reduce((sum, task) => sum + task.estimate, 0);
  const trackedHours = filteredTasks.reduce((sum, task) => sum + task.tracked, 0);
  const viewTitle = route.split('/').filter(Boolean).pop()?.replaceAll('-', ' ') ?? 'taskuri';

  return (
    <main data-v130-taskuri-route-unification="true" data-v120-single-canonical-sidebar="true" className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto flex max-w-[1680px] flex-col gap-3 px-4 py-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">SERVELECT WORK OS · Taskuri</p>
              <h1 className="text-2xl font-black tracking-tight">Taskuri enterprise workspace</h1>
              <p className="text-sm text-slate-500">Meniul intern a fost eliminat. Rutele Taskuri folosesc exclusiv sidebar-ul global al aplicației. View curent: {viewTitle}.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input value={state.query} onChange={(event) => state.setQuery(event.target.value)} placeholder="Search task, project, client, owner..." className="h-9 w-72 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
              <select value={state.role} onChange={(event) => state.setRole(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                {['Manager', 'Technician', 'Admin departament', 'Viewer'].map((role) => <option key={role}>{role}</option>)}
              </select>
              <button onClick={state.addTask} className="h-9 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white">New Task</button>
              <button onClick={state.addTicket} className="h-9 rounded-xl border border-slate-200 px-3 text-sm font-bold">New Ticket</button>
              <button onClick={state.exportCsv} className="h-9 rounded-xl border border-slate-200 px-3 text-sm font-bold">Export CSV</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['Overview', 'My Work', 'Inbox', 'Board', 'Table', 'Calendar', 'Gantt', 'Workload', 'Tickets', 'Reports', 'Automations'].map((view) => <Badge key={view}>{view}</Badge>)}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
          <section className="flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-6">
              {[
                ['Active', activeTasks],
                ['Overdue', overdue],
                ['Tickets', tickets.length],
                ['Workload', `${workloadHours}h`],
                ['Tracked', `${trackedHours}h`],
                ['Saved views', 9],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-[11px] font-bold uppercase text-slate-400">{label}</p>
                  <p className="mt-1 text-xl font-black">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-wide">Enterprise table/list</h2>
                  <div className="flex gap-2">
                    <button onClick={state.bulkMoveToReview} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold">Bulk to Review</button>
                    <button onClick={() => state.setQuery('Blocked')} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold">Filter Blocked</button>
                    <button onClick={() => state.setQuery('')} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold">Reset</button>
                  </div>
                </div>
                <div className="max-h-[520px] overflow-auto rounded-2xl border border-slate-100">
                  <table className="min-w-[1180px] text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase text-slate-500">
                      <tr>
                        {['', 'ID', 'Task', 'Project', 'Type', 'Status', 'Priority', 'Assignee', 'Due', 'Estimate', 'Tracked', 'Deps', 'Files', 'Actions'].map((head) => <th key={head} className="border-b border-slate-200 px-3 py-2 font-black">{head}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.slice(0, 32).map((task) => (
                        <tr key={task.id} className="border-b border-slate-100 hover:bg-emerald-50/40">
                          <td className="px-3 py-2"><input type="checkbox" /></td>
                          <td className="px-3 py-2 font-bold text-slate-500">{task.id}</td>
                          <td className="max-w-[260px] px-3 py-2"><button onClick={() => setSelectedTaskId(task.id)} className="text-left font-bold text-slate-900 hover:text-emerald-700">{task.title}</button><div className="mt-1 flex gap-1">{task.tags.map((tag) => <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{tag}</span>)}</div></td>
                          <td className="px-3 py-2 text-slate-600">{task.project}</td>
                          <td className="px-3 py-2">{task.type}</td>
                          <td className="px-3 py-2"><select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as V130Task['status'] }, 'Status actualizat')} className="rounded-lg border border-slate-200 bg-white px-2 py-1"><option>Backlog</option><option>To do</option><option>In progress</option><option>Review</option><option>Blocked</option><option>Done</option></select></td>
                          <td className="px-3 py-2"><ToneBadge value={task.priority} /></td>
                          <td className="px-3 py-2"><select value={task.assignee} onChange={(event) => updateTask(task.id, { assignee: event.target.value }, 'Assignee actualizat')} className="rounded-lg border border-slate-200 bg-white px-2 py-1">{users.map((user) => <option key={user}>{user}</option>)}</select></td>
                          <td className="px-3 py-2"><input value={task.dueDate} onChange={(event) => updateTask(task.id, { dueDate: event.target.value }, 'Deadline actualizat')} className="w-28 rounded-lg border border-slate-200 px-2 py-1" /></td>
                          <td className="px-3 py-2"><input type="number" value={task.estimate} onChange={(event) => updateTask(task.id, { estimate: Number(event.target.value) }, 'Estimate actualizat')} className="w-16 rounded-lg border border-slate-200 px-2 py-1" /></td>
                          <td className="px-3 py-2">{task.tracked}h</td>
                          <td className="px-3 py-2">{task.id !== 'TSK-0001' ? '1' : '0'}</td>
                          <td className="px-3 py-2">{task.files}</td>
                          <td className="px-3 py-2"><button onClick={() => setSelectedTaskId(task.id)} className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">Open</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-wide">Board / workload / tickets</h2>
                  <ToneBadge value={state.message.includes('creat') ? 'Done' : 'In progress'} />
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-1">
                  {byStatus.map((column) => (
                    <div key={column.status} className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
                      <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black">{column.status}</span><Badge>{column.tasks.length}</Badge></div>
                      <div className="space-y-2">
                        {column.tasks.slice(0, 3).map((task) => <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className="w-full rounded-xl border border-slate-200 bg-white p-2 text-left text-xs shadow-sm"><span className="font-black">{task.id}</span> · {task.title}<div className="mt-1 flex items-center gap-2"><ToneBadge value={task.priority} /><span>{task.assignee}</span><span>{task.estimate}h</span></div></button>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="sticky top-4 h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-emerald-700">Task detail drawer</p>
                <h2 className="text-lg font-black">{selectedTask?.id}</h2>
              </div>
              {selectedTask ? <ToneBadge value={selectedTask.status} /> : null}
            </div>
            {selectedTask ? (
              <div className="mt-3 space-y-3 text-sm">
                <label className="block"><span className="text-xs font-bold uppercase text-slate-400">Title</span><textarea value={selectedTask.title} onChange={(event) => updateTask(selectedTask.id, { title: event.target.value }, 'Titlu salvat')} className="mt-1 min-h-16 w-full rounded-xl border border-slate-200 p-2 font-semibold" /></label>
                <div className="grid grid-cols-2 gap-2">
                  <label><span className="text-xs font-bold uppercase text-slate-400">Status</span><select value={selectedTask.status} onChange={(event) => updateTask(selectedTask.id, { status: event.target.value as V130Task['status'] }, 'Status salvat')} className="mt-1 w-full rounded-xl border border-slate-200 p-2"><option>Backlog</option><option>To do</option><option>In progress</option><option>Review</option><option>Blocked</option><option>Done</option></select></label>
                  <label><span className="text-xs font-bold uppercase text-slate-400">Priority</span><select value={selectedTask.priority} onChange={(event) => updateTask(selectedTask.id, { priority: event.target.value as V130Task['priority'] }, 'Prioritate salvată')} className="mt-1 w-full rounded-xl border border-slate-200 p-2"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
                  <label><span className="text-xs font-bold uppercase text-slate-400">Assignee</span><select value={selectedTask.assignee} onChange={(event) => updateTask(selectedTask.id, { assignee: event.target.value }, 'Assignee salvat')} className="mt-1 w-full rounded-xl border border-slate-200 p-2">{users.map((user) => <option key={user}>{user}</option>)}</select></label>
                  <label><span className="text-xs font-bold uppercase text-slate-400">Due date</span><input value={selectedTask.dueDate} onChange={(event) => updateTask(selectedTask.id, { dueDate: event.target.value }, 'Deadline salvat')} className="mt-1 w-full rounded-xl border border-slate-200 p-2" /></label>
                  <label><span className="text-xs font-bold uppercase text-slate-400">Estimate</span><input type="number" value={selectedTask.estimate} onChange={(event) => updateTask(selectedTask.id, { estimate: Number(event.target.value) }, 'Estimate salvat')} className="mt-1 w-full rounded-xl border border-slate-200 p-2" /></label>
                  <label><span className="text-xs font-bold uppercase text-slate-400">Progress</span><input type="number" value={selectedTask.progress} onChange={(event) => updateTask(selectedTask.id, { progress: Number(event.target.value) }, 'Progress salvat')} className="mt-1 w-full rounded-xl border border-slate-200 p-2" /></label>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase text-slate-500">Checklist / files / activity</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs"><Badge>{selectedTask.checklistDone}/{selectedTask.checklistTotal} checks</Badge><Badge>{selectedTask.comments} comments</Badge><Badge>{selectedTask.files} files</Badge></div>
                  <button onClick={() => updateTask(selectedTask.id, { checklistDone: Math.min(selectedTask.checklistTotal, selectedTask.checklistDone + 1) }, 'Checklist bifat')} className="mt-3 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Add checklist progress</button>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-900">{state.message}</div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default V130UnifiedTaskuriWorkspace;
