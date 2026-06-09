import { V69ProductionRuntimeReadinessClient } from "../../../components/work-os/V69ProductionRuntimeReadinessClient";

export const metadata = {
  title: "v6.9.0 Deployment Command | SERVELECT WORK OS",
  description: "GitHub to Vercel deployment command center for SERVELECT WORK OS.",
};

export default function WorkOsDeploymentCommandPage() {
  return <V69ProductionRuntimeReadinessClient view="deployment" />;
}
