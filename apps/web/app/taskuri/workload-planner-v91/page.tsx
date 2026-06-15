import { V91GoodDayTaskExecutionParity } from "@/components/tasks/V91GoodDayTaskExecutionParity";
import { getV91Workspace } from "@/lib/enterprise/work-os-v91-goodday-task-execution";

export const metadata = { title: "Taskuri Workload Planner v9.1 | SERVELECT EMP" };

export default function Page() {
  return <V91GoodDayTaskExecutionParity initial={getV91Workspace()} view="workload" surface="taskuri" />;
}
