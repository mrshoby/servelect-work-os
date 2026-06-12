# V7.2.1 Typecheck Fix Report

Build: v7.2.1
Previous build: v7.2.0

Fix scope:
- Replaced ticket.slaDue with ticket.slaDueAt.
- Replaced runtime.v70State.forms with runtime.v70State.requestForms.
- Replaced old workload field names assignedCount / estimated / weeklyCapacity with assignedTasks.length / plannedMinutes / capacityMinutes.
- Updated visible version text to 7.2.1.

No redesign. No demo route. No new roadmap deviation.

Next required step after QA passes:
- Commit and push v7.2.1.
- Run route smoke and screenshot audit on Vercel.
- Continue to v7.3.0 only after v7.2.1 passes.
