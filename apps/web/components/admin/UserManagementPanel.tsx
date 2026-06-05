"use client";

import { useMemo, useState } from "react";
import type { Permission, Role } from "@servelect/shared";
import { rolePermissionMap } from "@/lib/auth/permissions";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, UserCog, Users } from "lucide-react";

const roles = Object.keys(rolePermissionMap) as Role[];
const permissions = Array.from(new Set(Object.values(rolePermissionMap).flat())) as Permission[];

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatar: string;
  team: string;
  workload: number;
  online?: boolean;
  permissionsCount: number;
};

export function UserManagementPanel({ initialUsers }: { initialUsers: DemoUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedRole, setSelectedRole] = useState<Role | "Toate">("Toate");
  const [message, setMessage] = useState<string>("");

  const filteredUsers = useMemo(() => {
    return selectedRole === "Toate" ? users : users.filter((user) => user.role === selectedRole);
  }, [selectedRole, users]);

  async function simulateLogin(email: string) {
    setMessage("Se schimbă sesiunea demo...");

    const response = await fetch("/api/v1/auth/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    }).catch(() => null);

    if (!response?.ok) {
      setMessage("Nu am putut schimba sesiunea demo. Verifică deploy-ul API.");
      return;
    }

    setMessage("Sesiune demo schimbată. Reîmprospătez aplicația...");
    window.setTimeout(() => window.location.reload(), 650);
  }

  function previewRoleChange(userId: string, role: Role) {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, role, permissionsCount: rolePermissionMap[role].length } : user)));
    setMessage("Rol modificat local pentru previzualizare. Persistarea reală va veni după DB/Auth complet.");
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {message}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <Card>
          <CardHeader
            title="Utilizatori & roluri"
            subtitle="Management demo RBAC: roluri, permisiuni, workload și impersonare controlată."
            action={
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value as Role | "Toate")}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none"
              >
                <option value="Toate">Toate rolurile</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            }
          />

          <div className="divide-y divide-slate-100 p-5 pt-0">
            {filteredUsers.map((user) => (
              <div key={user.id} className="grid gap-4 py-4 lg:grid-cols-[1fr_150px_190px_150px] lg:items-center">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">{user.avatar}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-slate-950">{user.name}</div>
                    <div className="truncate text-xs font-semibold text-slate-500">{user.email}</div>
                    <div className="mt-1 text-xs text-slate-500">{user.title} · {user.team}</div>
                  </div>
                </div>

                <div>
                  <select
                    value={user.role}
                    onChange={(event) => previewRoleChange(user.id, event.target.value as Role)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 outline-none"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                    <span>Workload</span>
                    <span>{user.workload}%</span>
                  </div>
                  <ProgressBar value={user.workload} tone={user.workload > 100 ? "red" : user.workload > 85 ? "orange" : "green"} />
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <Badge tone={user.online ? "green" : "gray"}>{user.online ? "online" : "offline"}</Badge>
                  <Badge tone="blue">{user.permissionsCount} perm.</Badge>
                  <button onClick={() => simulateLogin(user.email)} className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50">
                    Login demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Matrice permisiuni" subtitle="Pregătită pentru policy enforcement pe API și UI." />
          <div className="p-5 pt-0">
            <div className="grid gap-2 text-xs">
              {roles.map((role) => (
                <div key={role} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-black text-slate-900">{role}</span>
                    <Badge tone={role === "Administrator" ? "green" : role === "Viewer" ? "gray" : "blue"}>{rolePermissionMap[role].length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rolePermissionMap[role].slice(0, 10).map((permission) => (
                      <span key={permission} className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">{permission}</span>
                    ))}
                    {rolePermissionMap[role].length > 10 && <span className="rounded-full bg-slate-900 px-2 py-1 font-black text-white">+{rolePermissionMap[role].length - 10}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <SecurityCard icon={ShieldCheck} title="Protected app" value="Ready" text="Middleware pregătit pentru SERVELECT_REQUIRE_AUTH=true." />
        <SecurityCard icon={KeyRound} title="RBAC API" value="Central" text="Endpoint /api/v1/auth/authorize pentru policy checks." />
        <SecurityCard icon={UserCog} title="User admin" value="Demo" text="Roluri și sesiuni demo, fără risc pentru producție." />
        <SecurityCard icon={LockKeyhole} title="Next step" value="SSO" text="v0.8 poate adăuga Auth.js / Google / Microsoft." />
      </div>

      <Card>
        <CardHeader title="Permisiuni disponibile" subtitle="Lista completă folosită de modulele Work OS, Operațiuni și Companie." />
        <div className="flex flex-wrap gap-2 p-5 pt-0">
          {permissions.map((permission) => (
            <span key={permission} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-servelect-600" /> {permission}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SecurityCard({ icon: Icon, title, value, text }: { icon: typeof Users; title: string; value: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-servelect-700 ring-1 ring-emerald-100">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500">{title}</div>
          <div className="text-lg font-black text-slate-950">{value}</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}
