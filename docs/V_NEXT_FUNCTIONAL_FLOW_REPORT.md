# V_NEXT_FUNCTIONAL_FLOW_REPORT

| Flow | Page | Local expected | Vercel expected | Persisted | Notes |
|---|---|---:|---:|---:|---|
| Create task | any Taskuri | PASS | verify | localStorage | New row + drawer target |
| Open drawer | table/board | PASS | verify | UI state | right drawer only, not navigation |
| Edit status | table/drawer | PASS | verify | localStorage | board/table update |
| Edit assignee | table/drawer | PASS | verify | localStorage | My Work/filter updates |
| Edit due date | table/drawer | PASS | verify | localStorage | calendar/Gantt placeholder update |
| Edit estimate | table/drawer | PASS | verify | localStorage | workload number update |
| Bulk action | table/list | PASS | verify | localStorage | first three filtered tasks move to Review |
| Export CSV | reports/table | PASS | verify | browser download | current filtered task set |
| Screenshot delivery | audit script | PASS | verify | file output | creates PNG folder and zip |
