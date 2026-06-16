# GoodDay UI parity acceptance — v11.0.0

| Page | Reference pattern | Current problem before v11 | Fix applied | UI density score | Functional score | PASS/FAIL |
|---|---|---|---|---:|---:|---:|
| /taskuri | workspace command center | too simple | hierarchy + KPI + inbox + drawer | 82 | 78 | PASS with review |
| /taskuri/overview | executive/action view | card-heavy | dense action required panels | 82 | 76 | PASS with review |
| /taskuri/my-work | daily work inbox | generic | dense shared task list + drawer | 84 | 80 | PASS with review |
| /taskuri/inbox | action inbox | shallow | notifications read/archive/convert | 80 | 78 | PASS with review |
| /taskuri/tickets | ticket/request center | incomplete | SLA queue, convert, escalate | 82 | 80 | PASS with review |
| /taskuri/proiecte-* | project hierarchy | repeated template | active/future/done project cards + links | 76 | 70 | NEEDS more depth |
| /taskuri/board | Kanban | simple cards | workflow columns, WIP, drag/drop | 84 | 80 | PASS with review |
| /taskuri/tabel/table | enterprise table | route/API hotfix only | bulk rows, filters, columns | 88 | 82 | PASS with review |
| /taskuri/calendar-gantt | planning | weak timeline | Gantt rows, due edit, dependencies | 80 | 74 | NEEDS real engine |
| /taskuri/workload | resource planning | weak cards | capacity allocation grid | 82 | 76 | PASS with review |
| /taskuri/forms | requests/forms | shallow | request forms create ticket | 72 | 70 | NEEDS form builder |
| /taskuri/timesheets | time tracking | weak timer | task timer + tracked time | 76 | 74 | PASS with review |
| /taskuri/reports | reporting | basic summary | SLA/workload/evidence reports | 78 | 72 | NEEDS charting |
| /taskuri/automations | workflow rules | decorative | create/test automation | 76 | 70 | NEEDS rule builder |

No page is declared 1:1. This is a major step toward mature Work OS behavior, not final parity.
