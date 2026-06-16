# V_NEXT_LIVE_TASKURI_UI_AUDIT

v12.0.3 proved the main `/taskuri` route can show the single-sidebar markers, but source audit found many historical route pages still not bound to the single-sidebar workspace. v13 fixes this by rebinding all existing `page.tsx` files under `apps/web/app/taskuri`.

| Finding | Status before v13 | v13 action |
|---|---|---|
| Main route marker | passing on user check | preserve marker |
| Old inner marker on main route | absent on user check | keep blocked |
| Historical Taskuri pages | many not bound | rebind all pages dynamically during apply |
| Screenshot delivery | missing from assistant output | add script producing PNG folder + zip |
