import { V71BackendMutationAdapterClient } from "@/components/work-os/V71BackendMutationAdapterClient";

export const metadata = { title: "SERVELECT Work OS v7.1 · timesheets" };

export default function Page() {
  return <V71BackendMutationAdapterClient view="timesheets" />;
}
