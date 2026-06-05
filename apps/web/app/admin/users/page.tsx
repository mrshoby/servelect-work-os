import { ShieldCheck, UserPlus } from "lucide-react";
import { getAuthUsers, toPublicAuthUser } from "@/lib/auth/demo-users";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";
import { PageHeader } from "@/components/ui/Card";

export default function AdminUsersPage() {
  const users = getAuthUsers().map(toPublicAuthUser);

  return (
    <>
      <PageHeader
        title="Utilizatori & RBAC"
        subtitle="Administrare roluri, permisiuni, sesiuni demo și pregătire pentru protected app / SSO."
      >
        <a href="/api/v1/auth/users" className="btn-secondary">
          <ShieldCheck className="h-4 w-4" /> API users
        </a>
        <a href="/login" className="btn-primary">
          <UserPlus className="h-4 w-4" /> Login demo
        </a>
      </PageHeader>

      <UserManagementPanel initialUsers={users} />
    </>
  );
}
