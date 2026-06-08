"use client";

import { useMemo, useState } from "react";
import {
  assignTask,
  canAssignTask,
  getAssignableUsersForUser,
  getRoleAwareDashboard,
  getUserById,
  getV60EnterpriseOperatingLayer,
  hasPermission,
  rolePermissionMap,
  v60GoodDayCompliance,
  v60Permissions,
  v60Tasks,
  v60Users,
  type V60RoleKey,
  type V60Task,
  type V60User
} from "../../lib/enterprise/work-os-v60-enterprise-operating-layer";

type ViewKey = "dashboard" | "accounts" | "team" | "tasks" | "approvals" | "notifications" | "rbac" | "compliance";

const views: { key: ViewKey; label: string; description: string }[] = [
  { key: "dashboard", label: "Role Dashboard", description: "dashboard diferit pe cont/rol" },
  { key: "accounts", label: "Accounts", description: "profile, settings, security" },
  { key: "team", label: "Team Command", description: "subordonați, status, workload" },
  { key: "tasks", label: "Task Control", description: "assign/reassign, watchers, approvals" },
  { key: "approvals", label: "Approvals", description: "coadă aprobare cross-module" },
  { key: "notifications", label: "Notifications", description: "bell center + unread" },
  { key: "rbac", label: "RBAC Matrix", description: "12 roluri + 37 permisiuni" },
  { key: "compliance", label: "GoodDay Audit", description: "scoruri și gap-uri" }
];

const roleLabel: Record<V60RoleKey, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  director: "Director",
  department_manager: "Manager Departament",
  project_manager: "Manager Proiect",
  project_responsible: "Responsabil Proiect",
  procurement_specialist: "Specialist Achiziții",
  finance: "Financiar",
  technician: "Tehnician",
  sales: "Vânzări",
  client: "Client",
  viewer: "Viewer"
};

function InitialsAvatar({ user, size = "md" }: { user: V60User; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm";
  return (
    <div className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white shadow-sm`}>
      {user.initials}
    </div>
  );
}

function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "green" | "blue" | "amber" | "red" | "purple" | "neutral" }) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700"
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, detail, tone = "green" }: { label: string; value: string | number; detail: string; tone?: "green" | "blue" | "amber" | "red" | "purple" }) {
  const dot = {
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500"><span className={`h-2 w-2 rounded-full ${dot[tone]}`} />{label}</div>
      <div className="mt-3 text-3xl font-bold text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{detail}</div>
    </div>
  );
}

function DashboardView({ currentUser }: { currentUser: V60User }) {
  const dashboard = useMemo(() => getRoleAwareDashboard(currentUser.id), [currentUser.id]);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Taskuri vizibile" value={dashboard.kpis.visibleTasks} detail="filtrate prin RBAC + ierarhie" />
        <Kpi label="Overdue" value={dashboard.kpis.overdue} detail="scadențe care cer atenție" tone="red" />
        <Kpi label="Aprobări" value={dashboard.kpis.approvals} detail="workflow-uri în coadă" tone="amber" />
        <Kpi label="Workload mediu" value={`${dashboard.kpis.workloadAverage}%`} detail="vizibil pentru rolul curent" tone="blue" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <SectionCard title={`Dashboard pentru ${currentUser.roleName}`} subtitle="Fiecare rol vede altă combinație de widgeturi, taskuri și acțiuni.">
          <div className="grid gap-3 md:grid-cols-2">
            {dashboard.focus.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{item}</div>
                <p className="mt-1 text-xs text-slate-500">Widget prioritar pentru {currentUser.roleName}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Notification Center" subtitle="Unread + evenimente operaționale">
          <div className="space-y-3">
            {dashboard.unreadNotifications.length ? dashboard.unreadNotifications.map((notification) => (
              <div key={notification.id} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="text-sm font-semibold text-emerald-950">{notification.title}</div>
                <div className="text-xs text-emerald-700">{notification.message}</div>
              </div>
            )) : <div className="text-sm text-slate-500">Nu există notificări necitite pentru rolul selectat.</div>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AccountsView() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <SectionCard title="Enterprise Accounts" subtitle="10 conturi demo persistente conceptual, cu avatar, rol, departament, manager și setări.">
        <div className="space-y-3">
          {v60Users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <InitialsAvatar user={user} />
                <div>
                  <div className="font-semibold text-slate-950">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email} · {user.departmentName} · manager: {user.managerId ?? "—"}</div>
                </div>
              </div>
              <StatusBadge label={user.roleName} tone={user.role === "client" ? "purple" : user.role === "technician" ? "blue" : "green"} />
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Profile / Settings / Security" subtitle="Ce este acoperit de account shell v6.0">
        <div className="grid gap-3 md:grid-cols-2">
          {["Avatar + initials peste tot", "Profile page", "Settings localStorage-ready", "Security mock", "Notification preferences", "Active sessions mock", "Role switcher demo", "Unauthorized route ready"].map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">{item}</div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function TeamView({ currentUser }: { currentUser: V60User }) {
  const dashboard = getRoleAwareDashboard(currentUser.id);
  return (
    <div className="space-y-5">
      <SectionCard title="Team Status & Workload" subtitle="Respectă vizibilitatea: managerii văd subordonați, tehnicienii văd doar ce au voie.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">User</th><th className="px-3 py-2">Rol</th><th className="px-3 py-2">Prezență</th><th className="px-3 py-2">Active</th><th className="px-3 py-2">Blocate</th><th className="px-3 py-2">Workload</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.workload.map((row) => (
                <tr key={row.userId} className="border-t border-slate-100">
                  <td className="px-3 py-3 font-semibold text-slate-950">{row.userName}</td>
                  <td className="px-3 py-3 text-slate-600">{row.roleName}</td>
                  <td className="px-3 py-3"><StatusBadge label={row.presenceStatus} tone={row.presenceStatus === "on_site" ? "blue" : row.presenceStatus === "busy" ? "amber" : "green"} /></td>
                  <td className="px-3 py-3">{row.activeTasks}</td>
                  <td className="px-3 py-3">{row.blockedTasks}</td>
                  <td className="px-3 py-3"><div className="h-2 w-36 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.min(row.workloadPercent, 100)}%` }} /></div><span className="text-xs text-slate-500">{row.workloadPercent}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function TasksView({ currentUser }: { currentUser: V60User }) {
  const [selectedTask, setSelectedTask] = useState<V60Task>(v60Tasks[0]);
  const assignable = getAssignableUsersForUser(currentUser);
  const assignmentPreview = assignable[0] ? assignTask(selectedTask.id, assignable[0].id, currentUser.id) : { ok: false, error: "Nu există user eligibil" };
  const dashboard = getRoleAwareDashboard(currentUser.id);
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <SectionCard title="Task Manager GoodDay-like" subtitle="Taskuri cu owner, reviewer, watchers, approvals, dependencies și module Servelect.">
        <div className="space-y-3">
          {dashboard.visibleTasks.map((task) => (
            <button key={task.id} onClick={() => setSelectedTask(task)} className={`w-full rounded-xl border p-4 text-left transition hover:border-emerald-300 ${selectedTask.id === task.id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-slate-950">{task.title}</div>
                <div className="flex gap-2"><StatusBadge label={task.status} tone={task.status === "blocked" ? "red" : task.status === "review" ? "amber" : "blue"} /><StatusBadge label={task.priority} tone={task.priority === "critical" ? "red" : task.priority === "high" ? "amber" : "neutral"} /></div>
              </div>
              <div className="mt-2 text-xs text-slate-500">{task.projectName} · {task.assigneeName} · due {task.dueDate} · {task.sourceModule}</div>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Task Drawer / Assignment Workflow" subtitle="Preview pentru assign/reassign + activity + notification.">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-950">{selectedTask.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{selectedTask.description}</p>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Assignee</span><span className="font-medium">{selectedTask.assigneeName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Owner</span><span className="font-medium">{selectedTask.ownerName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Reviewer</span><span className="font-medium">{selectedTask.reviewerName ?? "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Watchers</span><span className="font-medium">{selectedTask.watchers.length}</span></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assignment preview</div>
            <div className="mt-2 text-sm text-slate-700">{assignmentPreview.ok ? `OK: ${currentUser.name} poate asigna către ${assignable[0]?.name}.` : assignmentPreview.error}</div>
          </div>
          <div className="space-y-2">
            {selectedTask.activityLog.map((entry) => <div key={entry.id} className="rounded-lg bg-white p-2 text-xs text-slate-600 ring-1 ring-slate-100">{entry.actorName}: {entry.action}</div>)}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ApprovalsView({ currentUser }: { currentUser: V60User }) {
  const dashboard = getRoleAwareDashboard(currentUser.id);
  return (
    <SectionCard title="Approvals & Workflow Inbox" subtitle="task, procurement, invoice, payment, budget și faze proiect.">
      <div className="grid gap-3 lg:grid-cols-3">
        {dashboard.pendingApprovals.map((approval) => (
          <div key={approval.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-semibold text-amber-950">{approval.title}</div>
            <div className="mt-1 text-xs text-amber-700">{approval.type} · {approval.reason}</div>
            <div className="mt-3 flex gap-2"><StatusBadge label="Approve" tone="green" /><StatusBadge label="Reject" tone="red" /></div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function NotificationsView({ currentUser }: { currentUser: V60User }) {
  const dashboard = getRoleAwareDashboard(currentUser.id);
  return (
    <SectionCard title="Notification Center" subtitle="unread count, mark read-ready și tipuri operaționale.">
      <div className="space-y-3">
        {dashboard.unreadNotifications.map((notification) => (
          <div key={notification.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between"><div className="font-semibold text-slate-950">{notification.title}</div><StatusBadge label={notification.type} tone="blue" /></div>
            <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function RbacView({ currentUser }: { currentUser: V60User }) {
  const roles = Object.keys(rolePermissionMap) as V60RoleKey[];
  return (
    <SectionCard title="RBAC Matrix" subtitle={`Cont curent: ${currentUser.name}. Permisiune admin_settings: ${hasPermission(currentUser, "admin_settings") ? "DA" : "NU"}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Permission</th>{roles.map((role) => <th key={role} className="px-3 py-2">{roleLabel[role]}</th>)}</tr></thead>
          <tbody>
            {v60Permissions.slice(0, 18).map((permission) => (
              <tr key={permission.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-800">{permission.label}</td>
                {roles.map((role) => <td key={role} className="px-3 py-2">{rolePermissionMap[role]?.includes(permission.key) ? "✓" : "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function ComplianceView() {
  return (
    <SectionCard title="GoodDay Compliance Audit" subtitle="Scoruri 0–5 după consolidarea v6.0.">
      <div className="grid gap-3 lg:grid-cols-3">
        {v60GoodDayCompliance.map((row) => (
          <div key={row.feature} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between"><div className="font-semibold text-slate-950">{row.feature}</div><StatusBadge label={`${row.quality}/5`} tone={row.quality >= 4 ? "green" : "amber"} /></div>
            <div className="mt-2 text-xs text-slate-500">Implemented: {row.implemented}</div>
            <div className="mt-1 text-xs text-slate-400">Missing: {row.missing}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function V60EnterpriseOperatingLayer({ defaultView = "dashboard" as ViewKey, defaultUserId = "u1" }: { defaultView?: ViewKey; defaultUserId?: string }) {
  const layer = useMemo(() => getV60EnterpriseOperatingLayer(), []);
  const [view, setView] = useState<ViewKey>(defaultView);
  const [currentUserId, setCurrentUserId] = useState(defaultUserId);
  const currentUser = getUserById(currentUserId) ?? layer.users[0];
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">SERVELECT WORK OS · v6.0.0</div>
              <h1 className="mt-2 text-3xl font-bold">Enterprise Operating Layer</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">Accounts, RBAC, team hierarchy, role dashboards, assignment workflows, notifications și GoodDay parity într-un singur strat Work OS.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
              <InitialsAvatar user={currentUser} size="lg" />
              <div>
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-sm text-slate-300">{currentUser.roleName} · {currentUser.departmentName}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Switch demo account</label>
              <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {layer.users.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.roleName}</option>)}
              </select>
            </div>
            <nav className="space-y-2">
              {views.map((item) => (
                <button key={item.key} onClick={() => setView(item.key)} className={`w-full rounded-xl px-3 py-3 text-left transition ${view === item.key ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className={`text-xs ${view === item.key ? "text-emerald-100" : "text-slate-500"}`}>{item.description}</div>
                </button>
              ))}
            </nav>
          </aside>
          <main>
            {view === "dashboard" && <DashboardView currentUser={currentUser} />}
            {view === "accounts" && <AccountsView />}
            {view === "team" && <TeamView currentUser={currentUser} />}
            {view === "tasks" && <TasksView currentUser={currentUser} />}
            {view === "approvals" && <ApprovalsView currentUser={currentUser} />}
            {view === "notifications" && <NotificationsView currentUser={currentUser} />}
            {view === "rbac" && <RbacView currentUser={currentUser} />}
            {view === "compliance" && <ComplianceView />}
          </main>
        </div>
      </div>
    </div>
  );
}
