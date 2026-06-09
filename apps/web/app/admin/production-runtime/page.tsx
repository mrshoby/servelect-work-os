import { V69ProductionRuntimeReadinessClient } from "../../../components/work-os/V69ProductionRuntimeReadinessClient";

export const metadata = {
  title: "Admin Production Runtime | SERVELECT WORK OS",
  description: "Admin production gates and release readiness for SERVELECT WORK OS.",
};

export default function AdminProductionRuntimePage() {
  return <V69ProductionRuntimeReadinessClient view="admin" />;
}
