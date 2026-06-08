# v5.6.0 Changelog

## Added

- Persistent Records cockpit at `/work-os/persistent-records`.
- Status/procente page at `/work-os/status`.
- Read-only API endpoints for v5.6 status and persistent records.
- Inline edit table for task records: status, priority, assignee, deadline.
- Activity comments timeline with comments, status, time, attachment and approval events.
- Record families model for tasks, projects, approvals, materials and IoT/maintenance.
- Status categories matching the original chat: Website/Web App, Task & Project Core, Backend/API, Database/Prisma/Seed, Auth/RBAC, IoT/Ops, Mobile App.

## Changed

- Release manifest updated to 5.6.0.
- Main Work OS page links to v5.6 Persistent Records and Status pages.
- README documents v5.6 routes and safety behavior.

## Safety

- No dangerous production writes enabled.
- Real DB mutations remain planned for v5.7 behind adapter switchboard and write-mode gates.

## Next

- v5.7.0 — Real Database Adapter Switchboard & Record Mutations.
