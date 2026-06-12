import { V74DbBackedShadowWritesClient } from "@/components/work-os/V74DbBackedShadowWritesClient";

export const metadata = { title: "SERVELECT Work OS v7.4 · Admin DB shadow writes" };

export default function Page() {
  return <V74DbBackedShadowWritesClient view="admin" />;
}
