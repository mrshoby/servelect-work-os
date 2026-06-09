import { V67GlobalCommandIntegrationClient } from "@/components/work-os/V67GlobalCommandIntegrationClient";

export const metadata = { title: "SERVELECT Work OS · Notification Center" };

export default function WorkOsNotificationCenterPage() {
  return <V67GlobalCommandIntegrationClient view="notifications" />;
}
