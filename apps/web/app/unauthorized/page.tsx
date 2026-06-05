import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="grid min-h-[calc(100vh-160px)] place-items-center px-4">
      <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Acces restricționat</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Rolul curent nu are permisiunea necesară pentru această zonă. În v0.7 permisiunile sunt centralizate în RBAC și pot fi testate în zona HR & Administrare.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Command Center
          </Link>
          <Link href="/login" className="btn-primary">
            <LockKeyhole className="h-4 w-4" /> Schimbă utilizatorul
          </Link>
        </div>
      </div>
    </div>
  );
}
