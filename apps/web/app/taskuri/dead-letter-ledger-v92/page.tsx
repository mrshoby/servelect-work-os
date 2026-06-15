import { V92ProviderLedgerTaskMutationPilot } from "@/components/tasks/V92ProviderLedgerTaskMutationPilot";

export const metadata = {
  title: "Taskuri Dead Letter v9.2 | SERVELECT EMP"
};

export default function Page() {
  return <V92ProviderLedgerTaskMutationPilot surface="dead-letter" />;
}
