import { V69ProductionRuntimeReadinessClient } from "../../../components/work-os/V69ProductionRuntimeReadinessClient";

export const metadata = {
  title: "v6.9.0 Production Runtime | SERVELECT WORK OS",
  description: "Production runtime readiness, route probes and release gates for SERVELECT WORK OS.",
};

export default function WorkOsProductionRuntimePage() {
  return <V69ProductionRuntimeReadinessClient view="runtime" />;
}
