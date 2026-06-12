import { V73PrismaSchemaMigrationClient } from "@/components/work-os/V73PrismaSchemaMigrationClient";

export const metadata = { title: "SERVELECT Work OS v7.3 · Prisma migration" };

export default function Page() {
  return <V73PrismaSchemaMigrationClient view="overview" />;
}
