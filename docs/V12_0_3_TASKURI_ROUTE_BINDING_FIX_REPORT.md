# v12.0.3 — Taskuri Route Binding Fix

Purpose: ensure every `/taskuri/*` page renders `V120SingleSidebarTaskuriWorkspace` and no longer imports old Taskuri workspace shells that contained the internal menu.

Status target:
- `/api/v1/work-os/v120-single-canonical-sidebar-taskuri`: PASS
- Taskuri page marker `data-v120-single-canonical-sidebar`: present
- old markers `Work OS · Taskuri`, `Workspace hierarchy`, `Canonical Work`: absent from Taskuri source/page output

This is a technical/UX binding fix before continuing to the next major build.
