import { V92ProviderLedgerTaskMutationPilot } from "@/components/tasks/V92ProviderLedgerTaskMutationPilot";

export const metadata = {
  title: "Taskuri Dispatch Ledger v9.2 | SERVELECT EMP"
};

export default function Page() {
  return <V92ProviderLedgerTaskMutationPilot surface="dispatch-ledger" />;
}
