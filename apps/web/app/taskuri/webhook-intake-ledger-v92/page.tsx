import { V92ProviderLedgerTaskMutationPilot } from "@/components/tasks/V92ProviderLedgerTaskMutationPilot";

export const metadata = {
  title: "Taskuri Webhook Ledger v9.2 | SERVELECT EMP"
};

export default function Page() {
  return <V92ProviderLedgerTaskMutationPilot surface="webhook-ledger" />;
}
