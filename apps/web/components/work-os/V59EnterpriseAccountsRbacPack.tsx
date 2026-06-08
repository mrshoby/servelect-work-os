"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Gauge,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Workflow,
  Zap
} from "lucide-react";

import {
  canAssignTask,
  canEditTask,
  canReassignTask,
  canViewTask,
  canViewUser,
  canViewUserWorkload,
  getAccountSystemSummary,
  getAllReports,
  getAssignableUsersForUser,
  getDashboardProfile,
  getDirectReports,
  getGoodDayComplianceAudit,
  getGoodDayComplianceScores,
  getPermissionsForRole,
  getTeamStatusForUser,
  getUserById,
  getVisibleProjectsForUser,
  getVisibleTasksForUser,
  hasPermission,
  isAdmin,
  roleCan,
  v59Approvals,
  v59Departments,
  v59Notifications,
  v59Permissions,
  v59RoleOrder,
  v59Teams,
  v59Tasks,
  v59Users,
  type V59EnterpriseUser,
  type V59TaskView,
  type V59Role
} from "@/lib/enterprise/work-os-enterprise-accounts";

export type V59EnterpriseAccountsMode =
  | "dashboard"
  | "profile"
  | "settings"
  | "security"
  | "notifications"
  | "adminUsers"
  | "adminUserDetail"
  | "roles"
  | "permissions"
  | "departments"
  | "teams"
  | "audit"
  | "team"
  | "teamStatus"
  | "teamWorkload"
  | "teamTasks"
  | "teamMembers"
  | "approvals"
  | "compliance";

const roleSamples: V59Role[] = ["Super Admin", "Manager Departament", "Manager Proiect", "Specialist Achiziții", "Financiar / Contabil", "Tehnician", "Vânzări", "Client"];

function toneClass(tone: string): string {
  if (tone === "green") return "border-emerald-100 bg-emerald-50 text-emerald-800";
  if (tone === "blue") return "border-blue-100 bg-blue-50 text-blue-800";
  if (tone === "amber") return "border-amber-100 bg-amber-50 text-amber-800";
  if (tone === "red") return "border-red-100 bg-red-50 text-red-800";
  if (tone === "purple") return "border-purple-100 bg-purple-50 text-purple-800";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

function presenceClass(status: string): string {
  if (status === "online") return "bg-emerald-500";
  if (status === "busy" || status === "in_meeting") return "bg-red-500";
  if (status === "away" || status === "on_leave") return "bg-amber-500";
  if (status === "on_site") return "bg-blue-500";
  return "bg-slate-300";
}

function roleLabel(role: V59Role): string {
  return role.replace(" / ", " / ");
}

export function V59EnterpriseAccountsRbacPack({ mode = "dashboard", selectedUserId }: { mode?: V59EnterpriseAccountsMode; selectedUserId?: string }) {
  const [currentUserId, setCurrentUserId] = useState(selectedUserId ?? "u1");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<V59Role>("Super Admin");
  const [selectedTaskId, setSelectedTaskId] = useState(v59Tasks[0]?.id ?? "");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("u6");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [unread, setUnread] = useState(v59Notifications.filter((item) => !item.read).length);

  const currentUser = useMemo(() => getUserById(currentUserId) ?? v59Users[0], [currentUserId]);
  const visibleUsers = useMemo(() => v59Users.filter((user) => canViewUser(currentUser, user)), [currentUser]);
  const visibleTasks = useMemo(() => getVisibleTasksForUser(currentUser), [currentUser]);
  const visibleProjects = useMemo(() => getVisibleProjectsForUser(currentUser), [currentUser]);
  const teamStatus = useMemo(() => getTeamStatusForUser(currentUser), [currentUser]);
  const dashboard = useMemo(() => getDashboardProfile(currentUser), [currentUser]);
  const summary = useMemo(() => getAccountSystemSummary(), []);
  const complianceRows = useMemo(() => getGoodDayComplianceAudit(), []);
  const complianceScores = useMemo(() => getGoodDayComplianceScores(), []);
  const selectedTask = useMemo(() => v59Tasks.find((task) => task.id === selectedTaskId) ?? v59Tasks[0], [selectedTaskId]);
  const selectedAssignee = useMemo(() => getUserById(selectedAssigneeId) ?? v59Users[0], [selectedAssigneeId]);
  const filteredUsers = visibleUsers.filter((user) => `${user.name} ${user.email} ${user.role} ${user.departmentName} ${user.teamName}`.toLowerCase().includes(search.toLowerCase()));
  const filteredTasks = visibleTasks.filter((task) => `${task.title} ${task.projectName} ${task.assigneeName} ${task.status} ${task.priority}`.toLowerCase().includes(search.toLowerCase()));
  const assignableUsers = getAssignableUsersForUser(currentUser);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white md:p-8">
          <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 md:block">v5.9.0 · GoodDay Compliance Hardening</div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" /> SERVELECT WORK OS / EMP
              </div>
              <h1 className="mt-4 max-w-5xl text-3xl font-black tracking-tight md:text-5xl">Enterprise Accounts, Team Hierarchy, Role-Based Dashboards & GoodDay Compliance</h1>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
                Update major pentru conturi demo persistente, profil, avatar, setări, RBAC extins, ierarhie manager/subordonat, dashboard per rol, team workload, approvals, notifications și audit Work OS.
              </p>
            </div>
            <div className="grid min-w-[280px] gap-2 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-emerald-100">Schimbă cont demo</label>
              <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm font-bold text-white outline-none">
                {v59Users.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.role}</option>)}
              </select>
              <div className="flex items-center gap-3 pt-2">
                <Avatar user={currentUser} size="lg" />
                <div>
                  <div className="font-black">{currentUser.name}</div>
                  <div className="text-xs font-semibold text-slate-300">{currentUser.roleName} · {currentUser.departmentName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-4 md:grid-cols-7">
          {summary.maturity.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{item.label}</div>
              <div className="mt-2 flex items-end justify-between gap-2"><span className="text-2xl font-black text-slate-950">{item.value}%</span><span className="text-xs font-bold text-emerald-700">v5.9</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.value}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <RoleNavigation mode={mode} />
          <CurrentUserCard user={currentUser} />
          <QuickSearch search={search} setSearch={setSearch} />
          <PermissionSnapshot user={currentUser} />
        </aside>

        <main className="space-y-4">
          {mode === "dashboard" && <DashboardView user={currentUser} dashboard={dashboard} visibleTasks={visibleTasks} visibleProjects={visibleProjects} teamStatus={teamStatus} unread={unread} setUnread={setUnread} />}
          {mode === "profile" && <ProfileView user={currentUser} visibleTasks={visibleTasks} visibleProjects={visibleProjects} />}
          {mode === "settings" && <SettingsView user={currentUser} saved={settingsSaved} onSave={() => setSettingsSaved(true)} />}
          {mode === "security" && <SecurityView user={currentUser} />}
          {mode === "notifications" && <NotificationsView user={currentUser} unread={unread} setUnread={setUnread} />}
          {mode === "adminUsers" && <AdminUsersView users={filteredUsers} currentUser={currentUser} />}
          {mode === "adminUserDetail" && <AdminUserDetailView user={getUserById(selectedUserId ?? currentUserId) ?? currentUser} viewer={currentUser} />}
          {mode === "roles" && <RolesView selectedRole={selectedRole} setSelectedRole={setSelectedRole} />}
          {mode === "permissions" && <PermissionsView selectedRole={selectedRole} setSelectedRole={setSelectedRole} />}
          {mode === "departments" && <DepartmentsView />}
          {mode === "teams" && <TeamsView />}
          {mode === "audit" && <AuditView />}
          {mode === "team" && <TeamOverviewView teamStatus={teamStatus} currentUser={currentUser} />}
          {mode === "teamStatus" && <TeamStatusView teamStatus={teamStatus} />}
          {mode === "teamWorkload" && <TeamWorkloadView teamStatus={teamStatus} />}
          {mode === "teamTasks" && <TeamTasksView tasks={filteredTasks} currentUser={currentUser} selectedTask={selectedTask} selectedAssignee={selectedAssignee} setSelectedTaskId={setSelectedTaskId} setSelectedAssigneeId={setSelectedAssigneeId} assignableUsers={assignableUsers} />}
          {mode === "teamMembers" && <TeamMembersView users={filteredUsers} currentUser={currentUser} />}
          {mode === "approvals" && <ApprovalsView user={currentUser} />}
          {mode === "compliance" && <ComplianceView rows={complianceRows} scores={complianceScores} />}
        </main>
      </div>
    </div>
  );
}

function RoleNavigation({ mode }: { mode: V59EnterpriseAccountsMode }) {
  const links: { href: string; label: string; icon: ComponentType<{ className?: string }>; active: boolean }[] = [
    { href: "/my-work", label: "My Work", icon: Gauge, active: mode === "dashboard" },
    { href: "/account/profile", label: "Profile", icon: UserCog, active: mode === "profile" },
    { href: "/account/settings", label: "Settings", icon: Pencil, active: mode === "settings" },
    { href: "/team/workload", label: "Team Workload", icon: Users, active: mode === "teamWorkload" },
    { href: "/team/tasks", label: "Team Tasks", icon: BriefcaseBusiness, active: mode === "teamTasks" },
    { href: "/work-os/approvals", label: "Approvals", icon: CheckCircle2, active: mode === "approvals" },
    { href: "/admin/roles", label: "Roles", icon: ShieldCheck, active: mode === "roles" },
    { href: "/admin/permissions", label: "Permissions", icon: KeyRound, active: mode === "permissions" },
    { href: "/work-os/goodday-compliance", label: "GoodDay Audit", icon: Sparkles, active: mode === "compliance" }
  ];
  return <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-card">{links.map((link) => <Link key={link.href} href={link.href} className={`mb-1 flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-black ${link.active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}><link.icon className="h-4 w-4" />{link.label}<ChevronRight className="ml-auto h-4 w-4 text-slate-300" /></Link>)}</div>;
}

function CurrentUserCard({ user }: { user: V59EnterpriseUser }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-center gap-3"><Avatar user={user} size="lg" /><div><div className="font-black text-slate-950">{user.name}</div><div className="text-xs font-semibold text-slate-500">{user.jobTitle}</div></div></div>
      <div className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
        <div className="flex justify-between"><span>Rol</span><span className="text-slate-950">{user.role}</span></div>
        <div className="flex justify-between"><span>Departament</span><span>{user.departmentName}</span></div>
        <div className="flex justify-between"><span>Manager</span><span>{user.managerId ? getUserById(user.managerId)?.name ?? "—" : "—"}</span></div>
        <div className="flex justify-between"><span>Prezență</span><span className="inline-flex items-center gap-1"><span className={`h-2 w-2 rounded-full ${presenceClass(user.presenceStatus)}`} />{user.presenceStatus}</span></div>
      </div>
    </div>
  );
}

function QuickSearch({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"><div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Global Work OS Search</div><div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Caută useri, taskuri, roluri..." className="w-full bg-transparent text-sm font-bold outline-none" /></div></div>;
}

function PermissionSnapshot({ user }: { user: V59EnterpriseUser }) {
  const critical = user.permissions.filter((permission) => v59Permissions.find((item) => item.key === permission)?.riskLevel === "critical").length;
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center gap-2 text-sm font-black"><ShieldCheck className="h-4 w-4 text-emerald-600" />Permission snapshot</div><div className="mt-3 grid grid-cols-2 gap-2"><MiniStat label="Permisiuni" value={String(user.permissions.length)} /><MiniStat label="Critice" value={String(critical)} /><MiniStat label="Assign" value={hasPermission(user, "assign_task") ? "Da" : "Nu"} /><MiniStat label="Admin" value={isAdmin(user) ? "Da" : "Nu"} /></div></div>;
}

function DashboardView({ user, dashboard, visibleTasks, visibleProjects, teamStatus, unread, setUnread }: { user: V59EnterpriseUser; dashboard: ReturnType<typeof getDashboardProfile>; visibleTasks: V59TaskView[]; visibleProjects: { id: string; code: string; name: string; progress: number; health: string; deadline: string }[]; teamStatus: ReturnType<typeof getTeamStatusForUser>; unread: number; setUnread: (value: number) => void }) {
  return (
    <div className="space-y-4">
      <Panel title={dashboard.title} subtitle={`Dashboard personalizat pentru ${roleLabel(user.role)}. Vizibilitatea este calculată pe rol, ierarhie și proiecte.`} icon={Gauge}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{dashboard.cards.map((card) => <div key={card.label} className={`rounded-3xl border p-4 ${toneClass(card.tone)}`}><div className="text-xs font-black uppercase tracking-[0.14em] opacity-70">{card.label}</div><div className="mt-2 text-3xl font-black">{card.value}</div><div className="mt-1 text-xs font-bold opacity-80">{card.detail}</div></div>)}</div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="My Work / Team Work Inbox" subtitle="Taskurile sunt filtrate cu canViewTask(user, task). Tehnicienii nu văd internul altora, managerii văd subordonații." icon={BriefcaseBusiness}>
          <div className="space-y-2">{visibleTasks.slice(0, 8).map((task) => <TaskRow key={task.id} task={task} user={user} />)}</div>
        </Panel>
        <Panel title="Role quick actions" subtitle="Acțiuni sugerate în funcție de rol și permisiuni." icon={Zap}>
          <div className="space-y-2">{dashboard.primaryActions.map((action) => <button key={action} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-black text-slate-700 hover:border-emerald-200 hover:bg-emerald-50">{action}<ChevronRight className="h-4 w-4" /></button>)}</div>
          <button onClick={() => setUnread(0)} className="mt-3 w-full rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white">Marchează {unread} notificări ca citite</button>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Proiecte vizibile" subtitle="Vizibilitate project/task-first; clientul vede doar proiectele lui." icon={FolderIcon}>{visibleProjects.slice(0, 5).map((project) => <div key={project.id} className="mb-2 rounded-2xl border border-slate-100 bg-white p-3"><div className="flex justify-between gap-2"><div><div className="font-black text-slate-900">{project.code} · {project.name}</div><div className="text-xs font-semibold text-slate-500">Deadline {project.deadline} · {project.health}</div></div><span className="text-sm font-black text-emerald-700">{project.progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div></div>)}</Panel>
        <Panel title="Status echipă" subtitle="Manager/subordonat, prezență, workload și blocaje." icon={Users}>{teamStatus.slice(0, 6).map((member) => <TeamStatusRow key={member.userId} member={member} />)}</Panel>
      </div>
    </div>
  );
}

function ProfileView({ user, visibleTasks, visibleProjects }: { user: V59EnterpriseUser; visibleTasks: V59TaskView[]; visibleProjects: { id: string }[] }) {
  const directReports = getDirectReports(user.id);
  const allReports = getAllReports(user.id);
  return <Panel title="Account Profile" subtitle="Profil complet cu avatar, rol, manager, task stats și activitate recentă." icon={UserCog}><div className="grid gap-5 xl:grid-cols-[280px_1fr]"><div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center"><Avatar user={user} size="xl" /><div className="mt-3 text-xl font-black">{user.name}</div><div className="text-sm font-bold text-emerald-700">{user.roleName}</div><p className="mt-3 text-sm leading-6 text-slate-600">{user.bio}</p><button className="mt-4 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">Upload avatar mock</button></div><div className="grid gap-3 md:grid-cols-2"><Info label="Email" value={user.email} /><Info label="Telefon" value={user.phone} /><Info label="Departament" value={user.departmentName} /><Info label="Echipă" value={user.teamName} /><Info label="Manager" value={user.managerId ? getUserById(user.managerId)?.name ?? "—" : "—"} /><Info label="Prezență" value={user.presenceStatus} /><MiniStat label="Taskuri vizibile" value={String(visibleTasks.length)} /><MiniStat label="Proiecte vizibile" value={String(visibleProjects.length)} /><MiniStat label="Direct reports" value={String(directReports.length)} /><MiniStat label="All reports" value={String(allReports.length)} /></div></div></Panel>;
}

function SettingsView({ user, saved, onSave }: { user: V59EnterpriseUser; saved: boolean; onSave: () => void }) {
  const rows = [["Theme", user.settings.theme], ["Compact mode", user.settings.compactMode ? "Activ" : "Inactiv"], ["Accent color", user.settings.accentColor], ["Language", user.settings.language], ["Timezone", user.settings.timezone], ["Default home", user.settings.defaultHomePage], ["Default task view", user.settings.defaultTaskView], ["Date format", user.settings.dateFormat]];
  return <Panel title="Account Settings" subtitle="Setări de cont pregătite pentru localStorage/store persistence." icon={Pencil}><div className="grid gap-3 md:grid-cols-2">{rows.map(([label, value]) => <Info key={label} label={label} value={String(value)} />)}</div><button onClick={onSave} className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">Salvează setări demo</button>{saved && <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Setările au fost salvate demo/local.</div>}</Panel>;
}

function SecurityView({ user }: { user: V59EnterpriseUser }) {
  return <Panel title="Security Center" subtitle="UI/mock pentru password, 2FA, sessions și login history." icon={LockKeyhole}><div className="grid gap-3 md:grid-cols-2"><Info label="Account status" value={user.status} /><Info label="Last login" value={user.lastLoginAt} /><Info label="2FA" value="Planned / mock" /><Info label="Active sessions" value="3 sesiuni demo" /></div><div className="mt-4 grid gap-2 md:grid-cols-3"><ActionButton label="Change password mock" /><ActionButton label="Enable 2FA planned" /><ActionButton label="Revoke sessions mock" /></div></Panel>;
}

function NotificationsView({ user, unread, setUnread }: { user: V59EnterpriseUser; unread: number; setUnread: (value: number) => void }) {
  const userNotifications = v59Notifications.filter((item) => item.userId === user.id || isAdmin(user));
  return <Panel title="Notification Center" subtitle="Unread count, mark as read, settings și tipuri operaționale." icon={Bell}><div className="grid gap-3 md:grid-cols-3"><MiniStat label="Unread" value={String(unread)} /><MiniStat label="Email" value={user.settings.emailNotifications ? "ON" : "OFF"} /><MiniStat label="Push" value={user.settings.pushNotifications ? "ON" : "OFF"} /></div><button onClick={() => setUnread(0)} className="mt-4 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">Mark all as read</button><div className="mt-4 space-y-2">{userNotifications.slice(0, 8).map((notification) => <div key={notification.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="font-black text-slate-900">{notification.title}</div><div className="text-sm text-slate-600">{notification.message}</div><div className="mt-1 text-xs font-bold text-slate-400">{notification.entityType} · {notification.createdAt}</div></div>)}</div></Panel>;
}

function AdminUsersView({ users, currentUser }: { users: V59EnterpriseUser[]; currentUser: V59EnterpriseUser }) {
  return <Panel title="Admin Users" subtitle="Listă useri cu avatar, rol, manager, status, task stats, impersonate și invite mock." icon={Users}><div className="mb-3 flex flex-wrap gap-2"><ActionButton label="Invite user mock" /><ActionButton label="Reset password mock" /><ActionButton label="Export users" /></div><div className="overflow-hidden rounded-3xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-400"><tr><th className="p-3">User</th><th className="p-3">Rol</th><th className="p-3">Manager</th><th className="p-3">Status</th><th className="p-3">Vizibil</th><th className="p-3">Acțiuni</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="p-3"><div className="flex items-center gap-3"><Avatar user={user} /><div><div className="font-black text-slate-900">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></div></div></td><td className="p-3"><Badge>{user.role}</Badge></td><td className="p-3 text-slate-600">{user.managerId ? getUserById(user.managerId)?.name ?? "—" : "—"}</td><td className="p-3"><span className="inline-flex items-center gap-1 text-xs font-black"><span className={`h-2 w-2 rounded-full ${presenceClass(user.presenceStatus)}`} />{user.status}</span></td><td className="p-3">{canViewUser(currentUser, user) ? "Da" : "Nu"}</td><td className="p-3"><Link className="font-black text-emerald-700" href={`/admin/users/${user.id}`}>Detalii</Link></td></tr>)}</tbody></table></div></Panel>;
}

function AdminUserDetailView({ user, viewer }: { user: V59EnterpriseUser; viewer: V59EnterpriseUser }) {
  const visible = canViewUser(viewer, user);
  return <Panel title={`Admin User Detail · ${user.name}`} subtitle="Profil, rol, permisiuni, manager, subordonați, task stats, activitate, sesiuni." icon={UserCog}>{!visible ? <div className="rounded-3xl border border-red-100 bg-red-50 p-4 font-bold text-red-800">Nu ai drept să vezi acest user.</div> : <div className="grid gap-4 xl:grid-cols-2"><ProfileView user={user} visibleTasks={getVisibleTasksForUser(user)} visibleProjects={getVisibleProjectsForUser(user)} /><PermissionMatrix role={user.role} /></div>}</Panel>;
}

function RolesView({ selectedRole, setSelectedRole }: { selectedRole: V59Role; setSelectedRole: (role: V59Role) => void }) {
  return <Panel title="Admin Roles" subtitle="12+ roluri enterprise și matrice de permisiuni pe module/risk." icon={ShieldCheck}><div className="mb-4 flex flex-wrap gap-2">{v59RoleOrder.map((role) => <button key={role} onClick={() => setSelectedRole(role)} className={`rounded-full px-3 py-1 text-xs font-black ${selectedRole === role ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{role}</button>)}</div><PermissionMatrix role={selectedRole} /></Panel>;
}

function PermissionsView({ selectedRole, setSelectedRole }: { selectedRole: V59Role; setSelectedRole: (role: V59Role) => void }) {
  return <Panel title="Admin Permissions" subtitle="Permission model: key, label, description, module, riskLevel, defaultRoles." icon={KeyRound}><div className="mb-4"><select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as V59Role)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">{v59RoleOrder.map((role) => <option key={role} value={role}>{role}</option>)}</select></div><div className="grid gap-2 md:grid-cols-2">{v59Permissions.map((permission) => <div key={permission.key} className={`rounded-2xl border p-3 ${roleCan(selectedRole, permission.key) ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-white"}`}><div className="flex items-start justify-between gap-2"><div><div className="font-black text-slate-900">{permission.label}</div><div className="text-xs text-slate-500">{permission.key}</div></div><Badge>{permission.riskLevel}</Badge></div><p className="mt-2 text-sm text-slate-600">{permission.description}</p><div className="mt-2 text-xs font-bold text-slate-400">{permission.module}</div></div>)}</div></Panel>;
}

function DepartmentsView() {
  return <Panel title="Admin Departments" subtitle="Departamente, manager, membri și workload sumar." icon={Network}><div className="grid gap-3 md:grid-cols-2">{v59Departments.map((department) => <div key={department.id} className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-lg font-black text-slate-950">{department.name}</div><p className="mt-1 text-sm text-slate-600">{department.description}</p></div><Badge>{department.workload}%</Badge></div><div className="mt-3 text-sm font-bold text-slate-500">Manager: {getUserById(department.managerId)?.name ?? "—"}</div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${department.workload}%` }} /></div></div>)}</div></Panel>;
}

function TeamsView() {
  return <Panel title="Admin Teams" subtitle="Echipe, membri, manager și proiecte active." icon={Users}><div className="grid gap-3 md:grid-cols-2">{v59Teams.map((team) => <div key={team.id} className="rounded-3xl border border-slate-200 bg-white p-4"><div className="text-lg font-black text-slate-950">{team.name}</div><div className="mt-1 text-sm font-bold text-slate-500">Manager: {getUserById(team.managerId)?.name ?? "—"}</div><div className="mt-3 flex flex-wrap gap-2">{team.members.map((memberId) => { const member = getUserById(memberId); return member ? <Avatar key={memberId} user={member} /> : null; })}</div><div className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{team.activeProjects.length} proiecte active</div></div>)}</div></Panel>;
}

function AuditView() {
  const events = ["login", "logout", "user_update", "role_change", "permission_change", "task_assignment", "approval_decision", "system_action"];
  return <Panel title="Admin Audit Log" subtitle="Evenimente demo pregătite pentru audit persistent." icon={Activity}><div className="space-y-2">{events.map((event, index) => <div key={event} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="flex items-center justify-between"><div className="font-black text-slate-900">{event.replace(/_/g, " ")}</div><span className="text-xs font-bold text-slate-400">2026-06-08 08:{String(index + 10).padStart(2, "0")}</span></div><div className="text-sm text-slate-600">Audit event generat pentru v5.9 RBAC/Accounts hardening.</div></div>)}</div></Panel>;
}

function TeamOverviewView({ teamStatus, currentUser }: { teamStatus: ReturnType<typeof getTeamStatusForUser>; currentUser: V59EnterpriseUser }) {
  return <Panel title="Team Overview" subtitle="Membri vizibili pentru userul curent, conform canViewUser/canViewUserWorkload." icon={Users}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{teamStatus.map((member) => <TeamCard key={member.userId} member={member} canViewWorkload={canViewUserWorkload(currentUser, getUserById(member.userId) ?? currentUser)} />)}</div></Panel>;
}

function TeamStatusView({ teamStatus }: { teamStatus: ReturnType<typeof getTeamStatusForUser> }) {
  return <Panel title="Team Status" subtitle="Online/offline/busy/on-site/on-leave + current task + last activity." icon={Gauge}><div className="space-y-2">{teamStatus.map((member) => <TeamStatusRow key={member.userId} member={member} />)}</div></Panel>;
}

function TeamWorkloadView({ teamStatus }: { teamStatus: ReturnType<typeof getTeamStatusForUser> }) {
  return <Panel title="Team Workload" subtitle="Heatmap demo: capacitate, estimate, tracked, overload și underload." icon={CalendarDays}><div className="space-y-3">{teamStatus.map((member) => <div key={member.userId} className="rounded-2xl border border-slate-100 bg-white p-3"><div className="flex justify-between gap-2"><div><div className="font-black text-slate-900">{member.name}</div><div className="text-xs text-slate-500">{member.estimateHours}h estimate · {member.trackedHours}h tracked · {member.activeTasks} taskuri active</div></div><span className={`font-black ${member.workload > 100 ? "text-red-600" : "text-emerald-700"}`}>{member.workload}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${member.workload > 100 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(member.workload, 100)}%` }} /></div></div>)}</div></Panel>;
}

function TeamTasksView({ tasks, currentUser, selectedTask, selectedAssignee, setSelectedTaskId, setSelectedAssigneeId, assignableUsers }: { tasks: V59TaskView[]; currentUser: V59EnterpriseUser; selectedTask: V59TaskView; selectedAssignee: V59EnterpriseUser; setSelectedTaskId: (id: string) => void; setSelectedAssigneeId: (id: string) => void; assignableUsers: V59EnterpriseUser[] }) {
  const canAssign = canAssignTask(currentUser, selectedAssignee);
  const canReassign = canReassignTask(currentUser, selectedTask, selectedAssignee);
  return <Panel title="Team Tasks & Assign/Reassign" subtitle="Select task + target user; UI verifică canAssignTask/canReassignTask și arată audit/notification result." icon={Workflow}><div className="grid gap-4 xl:grid-cols-[1fr_320px]"><div className="space-y-2">{tasks.map((task) => <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className={`w-full rounded-2xl border p-3 text-left ${selectedTask.id === task.id ? "border-emerald-300 bg-emerald-50" : "border-slate-100 bg-white"}`}><TaskRow task={task} user={currentUser} compact /></button>)}</div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-sm font-black text-slate-950">Assign / Reassign</div><div className="mt-3 text-xs font-bold text-slate-500">Task selectat</div><div className="font-black text-slate-900">{selectedTask.title}</div><div className="mt-3 text-xs font-bold text-slate-500">Target user</div><select value={selectedAssignee.id} onChange={(event) => setSelectedAssigneeId(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">{assignableUsers.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.role}</option>)}</select><div className="mt-4 grid gap-2"><MiniStat label="canAssignTask" value={canAssign ? "true" : "false"} /><MiniStat label="canReassignTask" value={canReassign ? "true" : "false"} /><MiniStat label="Audit log" value="generated" /><MiniStat label="Notification" value="queued" /></div><button disabled={!canReassign} className={`mt-4 w-full rounded-2xl px-4 py-2 text-sm font-black ${canReassign ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>Reassign task demo</button></div></div></Panel>;
}

function TeamMembersView({ users, currentUser }: { users: V59EnterpriseUser[]; currentUser: V59EnterpriseUser }) {
  return <Panel title="Team Members" subtitle="Membri vizibili, avatar, rol, departament, manager, prezență și drepturi." icon={Users}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{users.map((user) => <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><Avatar user={user} /><div><div className="font-black text-slate-900">{user.name}</div><div className="text-xs text-slate-500">{user.role}</div></div></div><div className="mt-3 grid gap-1 text-xs font-bold text-slate-500"><span>{user.departmentName}</span><span>{user.teamName}</span><span>Manager: {user.managerId ? getUserById(user.managerId)?.name ?? "—" : "—"}</span><span>canView: {canViewUser(currentUser, user) ? "true" : "false"}</span></div></div>)}</div></Panel>;
}

function ApprovalsView({ user }: { user: V59EnterpriseUser }) {
  const approvals = v59Approvals.filter((approval) => approval.approverId === user.id || isAdmin(user) || hasPermission(user, "approve_procurement") || hasPermission(user, "approve_payments"));
  return <Panel title="Approval Inbox" subtitle="Task, procurement, offer, invoice, payment, phase and budget approvals." icon={CheckCircle2}><div className="space-y-2">{approvals.map((approval) => <div key={approval.id} className="rounded-2xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="font-black text-slate-900">{approval.title}</div><div className="text-sm text-slate-600">{approval.reason}</div><div className="mt-1 text-xs font-bold text-slate-400">{approval.type} · requested by {getUserById(approval.requestedBy)?.name ?? approval.requestedBy}</div></div><Badge>{approval.status}</Badge></div><div className="mt-3 flex gap-2"><ActionButton label="Approve" /><ActionButton label="Reject" /><ActionButton label="Decision note" /></div></div>)}</div></Panel>;
}

function ComplianceView({ rows, scores }: { rows: ReturnType<typeof getGoodDayComplianceAudit>; scores: ReturnType<typeof getGoodDayComplianceScores> }) {
  return <Panel title="GoodDay Compliance Audit" subtitle="Audit real Work OS: scor 0–5 pe UI, accounts, RBAC, team, task management, workload, mobile readiness." icon={Sparkles}><div className="mb-4 grid gap-3 md:grid-cols-3 xl:grid-cols-7">{Object.entries(scores).map(([key, value]) => <MiniStat key={key} label={key.replace(/([A-Z])/g, " $1")} value={`${value}/5`} />)}</div><div className="overflow-hidden rounded-3xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-400"><tr><th className="p-3">Feature</th><th className="p-3">Exists</th><th className="p-3">Quality</th><th className="p-3">Missing</th><th className="p-3">Implemented</th></tr></thead><tbody>{rows.map((row) => <tr key={row.feature} className="border-t border-slate-100"><td className="p-3 font-black text-slate-900">{row.feature}</td><td className="p-3">{row.exists ? "Da" : "Nu"}</td><td className="p-3"><Badge>{row.quality}/5</Badge></td><td className="p-3 text-slate-600">{row.missing}</td><td className="p-3 text-slate-600">{row.implemented}</td></tr>)}</tbody></table></div></Panel>;
}

function PermissionMatrix({ role }: { role: V59Role }) {
  const permissions = getPermissionsForRole(role);
  return <div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="mb-3 flex items-center justify-between"><div><div className="font-black text-slate-950">{role}</div><div className="text-xs font-semibold text-slate-500">{permissions.length} permisiuni active</div></div><Badge>{permissions.length}</Badge></div><div className="grid gap-2 md:grid-cols-2">{permissions.slice(0, 18).map((key) => <div key={key} className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">{key}</div>)}</div></div>;
}

function TaskRow({ task, user, compact = false }: { task: V59TaskView; user: V59EnterpriseUser; compact?: boolean }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="font-black text-slate-950">{task.title}</div>{!compact && <div className="mt-1 text-xs font-semibold text-slate-500">{task.projectCode} · {task.projectName} · {task.assigneeName}</div>}</div><div className="flex flex-wrap gap-2"><Badge>{task.status}</Badge><Badge>{task.priority}</Badge>{!canEditTask(user, task) && <Badge>read-only</Badge>}</div></div>{!compact && <div className="mt-2 grid gap-2 text-xs font-bold text-slate-500 md:grid-cols-4"><span>Due: {task.dueDate}</span><span>Owner: {task.ownerName}</span><span>Reviewer: {task.reviewerName}</span><span>Approval: {task.approvalStatus}</span></div>}</div>;
}

function TeamStatusRow({ member }: { member: ReturnType<typeof getTeamStatusForUser>[number] }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-3"><div className="flex items-center justify-between gap-3"><div><div className="font-black text-slate-950">{member.name}</div><div className="text-xs font-semibold text-slate-500">{member.role} · {member.department} · {member.currentTask}</div></div><span className="inline-flex items-center gap-1 text-xs font-black"><span className={`h-2 w-2 rounded-full ${presenceClass(member.presenceStatus)}`} />{member.presenceStatus}</span></div><div className="mt-2 grid gap-2 text-xs font-bold text-slate-500 md:grid-cols-4"><span>Active {member.activeTasks}</span><span>Overdue {member.overdueTasks}</span><span>Blocked {member.blockedTasks}</span><span>{member.workload}% workload</span></div></div>;
}

function TeamCard({ member, canViewWorkload }: { member: ReturnType<typeof getTeamStatusForUser>[number]; canViewWorkload: boolean }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><div><div className="font-black text-slate-950">{member.name}</div><div className="text-xs font-semibold text-slate-500">{member.role}</div></div><span className={`h-3 w-3 rounded-full ${presenceClass(member.presenceStatus)}`} /></div><div className="mt-3 text-sm font-bold text-slate-600">{member.currentTask}</div>{canViewWorkload ? <div className="mt-3"><div className="flex justify-between text-xs font-black text-slate-500"><span>Workload</span><span>{member.workload}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(member.workload, 100)}%` }} /></div></div> : <div className="mt-3 rounded-2xl bg-slate-50 p-2 text-xs font-bold text-slate-500">Workload ascuns de RBAC</div>}</div>;
}

function Panel({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: ComponentType<{ className?: string }>; children: ReactNode }) {
  return <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-card md:p-5"><div className="mb-4 flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></div><div><h2 className="text-xl font-black text-slate-950">{title}</h2><p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{subtitle}</p></div></div>{children}</section>;
}

function Avatar({ user, size = "md" }: { user: V59EnterpriseUser; size?: "md" | "lg" | "xl" }) {
  const cls = size === "xl" ? "mx-auto h-24 w-24 text-2xl" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  return <div className={`relative grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-800 font-black text-white ${cls}`}>{user.avatarUrl ? user.initials : user.initials}<span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${presenceClass(user.presenceStatus)}`} /></div>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-600">{children}</span>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</div><div className="mt-1 text-lg font-black text-slate-950">{value}</div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-3"><div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</div><div className="mt-1 font-black text-slate-950">{value}</div></div>;
}

function ActionButton({ label }: { label: string }) {
  return <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">{label}</button>;
}

function FolderIcon(props: { className?: string }) {
  return <Layers3 {...props} />;
}
