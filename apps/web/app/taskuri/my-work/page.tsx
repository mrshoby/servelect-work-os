import { V78ProviderTelemetrySavedViewsClient } from "@/components/work-os/V78ProviderTelemetrySavedViewsClient";

export const metadata = { title: "SERVELECT Work OS v7.8 · myWork" };

export default function Page() {
  return <V78ProviderTelemetrySavedViewsClient view="myWork" />;
}
