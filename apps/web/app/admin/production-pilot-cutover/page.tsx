import { V90ProductionPilotCommandSuite } from "@/components/work-os/V90ProductionPilotCommandSuite";

export const metadata = { title: "Admin Production Pilot Cutover | SERVELECT WORK OS" };

export default function Page() {
  return <V90ProductionPilotCommandSuite mode="admin-cutover" />;
}
