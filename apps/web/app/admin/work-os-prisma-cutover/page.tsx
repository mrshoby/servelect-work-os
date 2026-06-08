import { V58ControlledPrismaCutover } from "@/components/work-os/V58ControlledPrismaCutover";
import { getV58CutoverSummary } from "@/lib/enterprise/work-os-prisma-cutover";

export default function AdminPrismaCutoverPage() {
  const summary = getV58CutoverSummary();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Admin · v5.8.0</div>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Prisma Cutover Control Room</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Panou admin pentru controlul trecerii la Prisma/PostgreSQL: write mode, seed parity, rollback coverage, mutații aprobate,
          wave plan și audit live. Scor producție curent: <b>{summary.scores.productionReady}%</b>.
        </p>
      </div>
      <V58ControlledPrismaCutover mode="admin" />
    </div>
  );
}
