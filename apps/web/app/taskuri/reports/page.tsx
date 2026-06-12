import { V72PrismaShadowRecordsClient } from "@/components/work-os/V72PrismaShadowRecordsClient";

export const metadata = { title: "SERVELECT Work OS v7.2 · Taskuri reports v7.2" };

export default function Page() {
  return <V72PrismaShadowRecordsClient view="reports" />;
}
