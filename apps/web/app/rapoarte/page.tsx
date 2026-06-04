import { PageHeader, Card, CardHeader } from "@/components/ui/Card";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";

export default function Page() {
  return <><PageHeader title="Rapoarte" subtitle="BI executiv, rapoarte proiecte, exporturi PDF/Excel și KPI operaționali." /><Card><CardHeader title="Taskuri și activități asociate" subtitle="Ecran pregătit pentru dezvoltare detaliată în următorul pachet." /><TaskTable limit={6} /></Card><TaskDrawer /></>;
}
