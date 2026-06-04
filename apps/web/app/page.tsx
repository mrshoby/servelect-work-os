"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  Gauge,
  Plus,
  Users,
  Zap
} from "lucide-react";
import { calendarEvents, priorityTone, statusTone, users, type TaskStatus } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";

const statusColumns: TaskStatus[] = ["De făcut", "În lucru", "Review / QA", "Finalizat"];

const sparkPoints = "0,44 16,38 32,41 48,29 64,34 80,22 96,25 112,13";

export default function HomePage() {
  const { tasks, projects } = useWorkOsStore();

  const urgent = tasks.filter(
    (task) => task.priority === "Urgent" || task.priority === "Critic" || task.status === "Blocat"
  ).length;

  const activeProjects = projects.filter((project) => project.phase !== "Finalizat").length;
  const todayTasks = tasks.slice(0, 6);
  const activeWork = tasks.filter((task) => task.status === "În lucru" || task.status === "Review / QA").slice(0, 5);

  return (
    <>
<PageHeader
  title="Home / Command Center"
  subtitle="Platformă unificată pentru proiecte, taskuri, echipe și operațiuni energetice."
>
  <Link href="/taskuri" className="btn-secondary">
    Vezi taskuri
  </Link>

  <Link href="/proiecte" className="btn-secondary">
    <Plus className="h-4 w-4" />
    Proiect rapid
  </Link>

  <Link href="/taskuri" className="btn-primary">
    <Plus className="h-4 w-4" />
    Task rapid
  </Link>
</PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50 shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
          <div className="p-6 lg:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
              SERVELECT WORK OS · v0.2 Task & Project Core
            </div>

            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">
              Command Center task-first, rapid și stabil pentru producție.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Homepage-ul este acum versiune light: overview, taskuri critice, proiecte active, workload și operațiuni live.
              Tabelele grele, Kanban-ul complet și drawer-ele sunt în paginile dedicate.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/taskuri" className="btn-primary">
                Deschide Task Center
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/proiecte" className="btn-secondary">
                Deschide Proiecte
              </Link>
              <Link href="/iot" className="btn-secondary">
                Monitorizare IoT
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-950 p-6 text-white xl:border-l xl:border-t-0">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-servelect-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-black">Live work graph</div>
                <div className="text-xs text-slate-400">
                  {tasks.length} taskuri · {projects.length} proiecte
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <b className="text-2xl">{urgent}</b>
                <p className="text-xs text-slate-300">urgente/blocate</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <b className="text-2xl">{activeProjects}</b>
                <p className="text-xs text-slate-300">proiecte active</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span>Workload operațional</span>
                <span>Live</span>
              </div>
              <svg viewBox="0 0 112 52" className="h-20 w-full overflow-visible">
                <polyline
                  points={sparkPoints}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={`0,52 ${sparkPoints} 112,52`}
                  fill="#22C55E"
                  opacity="0.12"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LiteKpi icon={FolderKanban} label="Proiecte active" value={String(activeProjects)} sub={`${projects.length} totale`} tone="green" />
        <LiteKpi icon={ClipboardList} label="Taskuri urgente" value={String(urgent)} sub={`din ${tasks.length} totale`} tone="red" />
        <LiteKpi icon={Gauge} label="Instalații monitorizate" value="152" sub="online 84%" tone="blue" />
        <LiteKpi icon={BriefcaseBusiness} label="Pipeline vânzări" value="12,45 mil. RON" sub="18 oportunități" tone="green" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr_.8fr]">
        <Card>
          <CardHeader
            title="My Tasks / Inbox"
            subtitle="Overview rapid. Pentru tabel complet intră în Taskuri."
            action={
              <Link href="/taskuri" className="text-xs font-black text-servelect-600">
                Vezi toate
              </Link>
            }
          />

          <div className="space-y-3 p-5 pt-0">
            {todayTasks.map((task) => (
              <Link
                href="/taskuri"
                key={task.id}
                className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-950">{task.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {task.projectCode} · {task.projectName}
                    </div>
                  </div>
                  <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{task.assigneeName}</span>
                  <span>·</span>
                  <span>{task.dueDate}</span>
                  <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Proiecte în desfășurare"
            action={
              <Link href="/proiecte" className="text-xs font-black text-servelect-600">
                Vezi proiecte
              </Link>
            }
          />

          <div className="divide-y divide-slate-100 p-5 pt-0">
            {projects.slice(0, 5).map((project) => (
              <Link href="/proiecte" key={project.id} className="block py-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <b>{project.code}</b>
                    <div className="text-xs text-slate-500">{project.name}</div>
                  </div>
                  <Badge tone={project.health === "Bun" ? "green" : project.health === "Atenție" ? "orange" : "red"}>
                    {project.phase}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <ProgressBar value={project.progress} />
                  <span className="w-10 text-right text-xs font-black text-slate-500">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Snapshot taskuri" subtitle="Distribuție după status" />

          <div className="grid grid-cols-2 gap-3 p-5 pt-0">
            {statusColumns.map((status) => {
              const count = tasks.filter((task) => task.status === status).length;
              return (
                <Link
                  href="/taskuri"
                  key={status}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-sm text-slate-900">{status}</b>
                    <Badge tone={statusTone(status)}>{count}</Badge>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500">Work queue</p>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_.75fr_.75fr_1fr]">
        <Card>
          <CardHeader title="Activitate echipă" />

          <div className="space-y-4 p-5 pt-0">
            {users.slice(0, 4).map((user, index) => (
              <div key={user.id} className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                  {user.avatar}
                </div>
                <div className="text-sm">
                  <b>{user.name}</b> {index % 2 ? "a încărcat documentul" : "a actualizat statusul proiectului"}
                  <div className="text-xs text-slate-500">acum {15 + index * 17} min</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Agenda mea"
            action={
              <Link href="/calendar" className="text-xs font-black text-servelect-600">
                Vezi calendar
              </Link>
            }
          />

          <div className="space-y-3 p-5 pt-0">
            {calendarEvents.map((event) => (
              <div key={event.id} className="border-l-2 border-servelect-600 pl-3">
                <div className="text-sm font-black">
                  {event.startsAt.slice(11, 16)} · {event.title}
                </div>
                <div className="text-xs text-slate-500">{event.type}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Încărcare echipă" />

          <div className="space-y-4 p-5 pt-0">
            {users.slice(0, 5).map((user) => (
              <div key={user.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{user.name}</span>
                  <b>{user.workload}%</b>
                </div>
                <ProgressBar value={user.workload} tone={user.workload > 100 ? "red" : "green"} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Operațiuni energie live"
            action={
              <Link href="/iot" className="text-xs font-black text-servelect-600">
                Vezi IoT
              </Link>
            }
          />

          <div className="p-5 pt-0">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <Metric icon={Zap} label="Putere" value="8.42 MW" />
              <Metric icon={Activity} label="Producție" value="42.85 MWh" />
              <Metric icon={Gauge} label="Randament" value="98.7%" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Producție reală vs estimat</span>
                <span>Live</span>
              </div>
              <svg viewBox="0 0 320 120" className="h-32 w-full overflow-visible">
                <line x1="0" x2="320" y1="100" y2="100" stroke="#E2E8F0" strokeDasharray="5 6" />
                <line x1="0" x2="320" y1="65" y2="65" stroke="#E2E8F0" strokeDasharray="5 6" />
                <line x1="0" x2="320" y1="30" y2="30" stroke="#E2E8F0" strokeDasharray="5 6" />
                <polyline
                  points="0,100 32,92 64,74 96,53 128,39 160,28 192,35 224,50 256,66 288,82 320,96"
                  fill="none"
                  stroke="#0B8F43"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,104 32,96 64,82 96,61 128,45 160,36 192,40 224,48 256,57 288,70 320,90"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.85fr]">
        <Card>
          <CardHeader
            title="Work OS — coadă operațională"
            subtitle="Rezumat rapid. Pentru board drag/drop complet folosește modulul Taskuri."
            action={
              <Link href="/taskuri" className="btn-secondary">
                Deschide board
              </Link>
            }
          />

          <div className="grid gap-3 p-5 pt-0 md:grid-cols-4">
            {statusColumns.map((status) => (
              <div key={status} className="rounded-[1.45rem] border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">{status}</span>
                  <Badge tone={statusTone(status)}>{tasks.filter((task) => task.status === status).length}</Badge>
                </div>

                <div className="space-y-2">
                  {tasks
                    .filter((task) => task.status === status)
                    .slice(0, 2)
                    .map((task) => (
                      <Link key={task.id} href="/taskuri" className="block rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
                        <b className="line-clamp-1 text-slate-950">{task.title}</b>
                        <div className="mt-1 text-xs text-slate-500">{task.projectCode}</div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Alerte & aprobări" />

          <div className="space-y-3 p-5 pt-0">
            <AlertRow icon={AlertTriangle} title="Invertor offline" meta="P-2024-0187 · creează ticket" tone="red" />
            <AlertRow icon={Clock3} title="SLA în risc" meta="Intervenție Cluj-Napoca · ETA 18 min" tone="orange" />
            <AlertRow icon={CheckCircle2} title="Aprobare ofertă" meta="TechConstruct SRL · 450.000 RON" tone="green" />
            <AlertRow icon={CalendarDays} title="Revizie programată" meta="P-2024-0142 · mâine 10:00" tone="blue" />
          </div>
        </Card>
      </div>

    </>
  );
}

function LiteKpi({
  icon: Icon,
  label,
  value,
  sub,
  tone
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
  sub: string;
  tone: "green" | "red" | "blue";
}) {
  const toneClass = {
    green: "bg-emerald-50 text-emerald-700 stroke-emerald-600",
    red: "bg-red-50 text-red-700 stroke-red-600",
    blue: "bg-blue-50 text-blue-700 stroke-blue-600"
  }[tone];

  return (
    <div className="card-tight min-h-[132px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</div>
            <div className="text-xs text-slate-500">{sub}</div>
          </div>
        </div>

        <svg viewBox="0 0 112 52" className="h-16 w-28 overflow-visible">
          <polyline
            points={sparkPoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={toneClass}
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <Activity className="h-4 w-4" />
        actualizat live
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <Icon className="mx-auto mb-2 h-5 w-5 text-servelect-600" />
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-extrabold text-slate-950">{value}</div>
    </div>
  );
}

function AlertRow({
  icon: Icon,
  title,
  meta,
  tone
}: {
  icon: typeof AlertTriangle;
  title: string;
  meta: string;
  tone: "red" | "orange" | "green" | "blue";
}) {
  const colors = {
    red: "bg-red-50 text-red-700",
    orange: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700"
  };

  return (
    <Link href="/taskuri" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-card">
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${colors[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-black text-slate-950">{title}</div>
        <div className="text-xs text-slate-500">{meta}</div>
      </div>
    </Link>
  );
}
