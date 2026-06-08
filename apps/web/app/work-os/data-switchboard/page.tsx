import { V57DatabaseAdapterSwitchboard } from "@/components/work-os/V57DatabaseAdapterSwitchboard";
import { WorkOsBadge, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getV57DataSwitchboard } from "@/lib/enterprise/work-os-data-switchboard";

export default function WorkOsDataSwitchboardPage() {
  const payload = getV57DataSwitchboard();

  return (
    <WorkOsShell
      eyebrow="SERVELECT WORK OS v5.7.0"
      title="Real Database Adapter Switchboard & Record Mutations"
      subtitle="Panou major pentru conectarea reală a surselor de date: mock/local records/API route handlers/Prisma/PostgreSQL/conectori externi. Fiecare mutație are write-mode, audit event, rollback și permisiune."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <WorkOsBadge value={`version ${payload.version}`} />
        <WorkOsBadge value={`write mode: ${payload.writeMode}`} />
        <WorkOsBadge value={payload.prismaEnabled ? "DATABASE_URL prezent" : "DATABASE_URL lipsă"} />
        <WorkOsBadge value={`readiness ${payload.readiness}%`} />
      </div>
      <V57DatabaseAdapterSwitchboard payload={payload} />
    </WorkOsShell>
  );
}
