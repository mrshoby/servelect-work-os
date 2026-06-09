import { getV68GlobalPersistenceHealth } from "../../../../../../lib/enterprise/work-os-v68-persistence-api-unification";

export async function GET() {
  const health = getV68GlobalPersistenceHealth();
  return Response.json({
    ok: true,
    version: health.version,
    contracts: health.contracts,
    commands: health.commands,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const commandId = typeof body.commandId === "string" ? body.commandId : "audit-required-global";
  const health = getV68GlobalPersistenceHealth();
  const command = health.commands.find((item) => item.id === commandId) ?? health.commands[0];

  return Response.json({
    ok: Boolean(command?.enabled),
    mode: "simulated-control-plane",
    command,
    auditEvent: {
      type: "persistence.command.executed",
      actor: "local-admin",
      commandId,
      createdAt: new Date().toISOString(),
      rollback: "This v6.8.0 local build does not perform destructive persistence changes.",
    },
  });
}
