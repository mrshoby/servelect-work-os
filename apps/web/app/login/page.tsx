"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UserRound } from "lucide-react";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatar: string;
  team: string;
  permissionsCount: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [email, setEmail] = useState("andrei.popescu@servelect.ro");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/users")
      .then((response) => response.json())
      .then((payload) => {
        if (payload?.ok && Array.isArray(payload.data)) setUsers(payload.data);
      })
      .catch(() => setUsers([]));
  }, []);

  const selectedUser = useMemo(() => users.find((user) => user.email === email), [email, users]);

  async function submitLogin() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        setError(payload?.error?.message ?? "Autentificarea a eșuat.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Nu s-a putut contacta endpointul de autentificare.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0,#f8fafc_34%,#e2e8f0_100%)] p-4 text-slate-950 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
            <Sparkles className="h-4 w-4" /> SERVELECT EMP · Auth Foundation
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-slate-950">
            Work OS securizat pentru proiecte, taskuri și operațiuni energetice.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            v0.6 introduce stratul de autentificare demo, sesiune cookie, roluri, permisiuni și endpointuri RBAC pregătite pentru auth real.
            Până la activarea completă, aplicația rămâne deployment-safe.
          </p>

          <div className="mt-8 grid max-w-2xl gap-4 md:grid-cols-3">
            {[
              ["RBAC", "Roluri și permisiuni granulare"],
              ["Session", "Cookie HTTP-only demo"],
              ["Protected-ready", "Pregătit pentru mod obligatoriu"]
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-card backdrop-blur-xl">
                <ShieldCheck className="mb-4 h-6 w-6 text-servelect-600" />
                <div className="font-black">{title}</div>
                <div className="mt-1 text-xs font-semibold leading-5 text-slate-500">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <div className="flex items-center gap-3">
            <div className="grid h-13 w-13 place-items-center rounded-2xl bg-slate-950 text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">Autentificare SERVELECT</h2>
              <p className="text-sm font-semibold text-slate-500">Selectează un utilizator demo.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Utilizator</span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <select
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.name} — {user.role}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Parolă demo</span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="Lasă gol dacă nu ai setat SERVELECT_DEMO_PASSWORD"
                  className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            {selectedUser && (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{selectedUser.avatar}</div>
                  <div>
                    <div className="font-black text-slate-950">{selectedUser.name}</div>
                    <div className="text-xs font-semibold text-emerald-700">
                      {selectedUser.role} · {selectedUser.permissionsCount} permisiuni
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}

            <button onClick={submitLogin} disabled={loading} className="btn-primary h-12 w-full rounded-2xl">
              <UserRound className="h-4 w-4" />
              {loading ? "Se autentifică..." : "Intră în Work OS"}
              <ArrowRight className="ml-auto h-4 w-4" />
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Acesta este strat demo de autentificare pentru v0.6. Pentru producție vom conecta SSO/Auth.js/JWT în v0.7+.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
