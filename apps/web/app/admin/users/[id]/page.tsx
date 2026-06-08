import { V59EnterpriseAccountsRbacPack } from "@/components/work-os/V59EnterpriseAccountsRbacPack";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <V59EnterpriseAccountsRbacPack mode="adminUserDetail" selectedUserId={id} />;
}
