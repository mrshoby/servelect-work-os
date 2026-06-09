import { V67GlobalCommandIntegrationClient } from "@/components/work-os/V67GlobalCommandIntegrationClient";

export const metadata = { title: "SERVELECT Work OS · Approvals" };

export default function WorkOsApprovalsPage() {
  return <V67GlobalCommandIntegrationClient view="approvals" />;
}
