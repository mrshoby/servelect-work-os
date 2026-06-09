import { V67GlobalCommandIntegrationClient } from "@/components/work-os/V67GlobalCommandIntegrationClient";

export const metadata = { title: "SERVELECT Work OS · Global Dashboard" };

export default function WorkOsDashboardPage() {
  return <V67GlobalCommandIntegrationClient view="dashboard" />;
}
