# Changelog — v6.7.0 Global Command Integration

## Added
- Global Work OS dashboard page.
- Notification center wired to GoodDay parity local store.
- Global approvals center with approve/reject actions.
- Global search page across tasks, tickets, projects, clients and approvals.
- Cross-module Action Center with Servelect-specific commands.
- API status route `/api/v1/work-os/global-command`.
- Functional route smoke script.
- Optional Playwright screenshot audit script.

## Changed
- Extends the v6.6 Taskuri GoodDay functional core beyond Taskuri into global Work OS surfaces.
- Adds version metadata to package files through apply script.

## Not changed
- No redesign of Taskuri pages.
- No production DB write activation.
- No GoodDay logo, brand assets, or commercial copy copied.

## Known limitations
- Persistence remains localStorage/mock for global actions.
- Backend real DB adapter is still pending.
- Topbar component is not forcibly overwritten to avoid breaking existing navigation.
