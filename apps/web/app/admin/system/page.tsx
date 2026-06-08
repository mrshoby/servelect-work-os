import Link from "next/link";

const systemAreas = [
  {
    title: "Utilizatori",
    href: "/admin/users",
    metric: "Conturi, status, roluri",
    description: "Administrare conturi demo/enterprise, activare, roluri, manageri si acces pe module.",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    title: "Roluri si permisiuni",
    href: "/admin/roles",
    metric: "RBAC enterprise",
    description: "Matrice de permisiuni pentru Admin, Manager, Tehnician, Financiar, Vanzari, Client si Viewer.",
    tone: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    title: "Departamente",
    href: "/admin/departments",
    metric: "Structura companie",
    description: "Management, Proiectare, Executie, Achizitii, Financiar, Vanzari si relatii manageriale.",
    tone: "bg-violet-50 text-violet-700 border-violet-200"
  },
  {
    title: "Echipe",
    href: "/admin/teams",
    metric: "Workload & alocari",
    description: "Echipe, membri, manageri, proiecte active, taskuri si capacitate pe roluri.",
    tone: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    title: "Audit log",
    href: "/admin/audit-log",
    metric: "Trasabilitate",
    description: "Login, schimbari roluri, asignari taskuri, aprobari, mutatii si actiuni de sistem.",
    tone: "bg-slate-50 text-slate-700 border-slate-200"
  },
  {
    title: "GoodDay compliance",
    href: "/work-os/goodday-compliance",
    metric: "Scor Work OS",
    description: "Auditul functional pentru Accounts, RBAC, Team Management, Task Manager si Workload.",
    tone: "bg-teal-50 text-teal-700 border-teal-200"
  }
];

const safetyChecks = [
  "Conturile demo si setarile raman persistente local/shadow-safe.",
  "Permisiunile enterprise sunt verificate inainte de actiuni sensibile.",
  "Write-mode real ramane dezactivat implicit pana la configurare explicita.",
  "Modificarile critice trebuie sa lase audit event si pot fi validate inainte de cutover."
];

export default function AdminSystemPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                SERVELECT WORK OS · Administrare sistem
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Control Center pentru conturi, roluri, echipe si guvernanta
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Zona admin consolideaza utilizatorii, RBAC, ierarhia manageriala, auditul si verificarea GoodDay-like pentru platforma. Linkurile interne folosesc Next Link pentru compatibilitate cu build-ul Vercel.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div className="font-semibold">v5.9.x build-safe</div>
              <div className="mt-1 text-xs">Next.js Link compliance · no HTML anchor blocker</div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {systemAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 group-hover:text-emerald-700">
                    {area.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{area.metric}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${area.tone}`}>
                  Deschide
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{area.description}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Actiuni rapide admin</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700" href="/admin/users">
                Gestioneaza utilizatori
              </Link>
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700" href="/admin/permissions">
                Verifica permisiuni
              </Link>
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700" href="/team/workload">
                Vezi workload echipa
              </Link>
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700" href="/work-os/status">
                Status platforma
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Safety gates</h2>
            <ul className="mt-4 space-y-3">
              {safetyChecks.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
