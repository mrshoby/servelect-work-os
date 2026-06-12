import { V76ProviderStorageClient } from "@/components/work-os/V76ProviderStorageClient";

export const metadata = { title: "SERVELECT Work OS v7.6 · Reports" };

export default function Page() {
  return <V76ProviderStorageClient view="reports" />;
}
