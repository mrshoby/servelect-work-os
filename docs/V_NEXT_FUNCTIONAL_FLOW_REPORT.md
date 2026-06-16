# Functional flow report — v11.0.0

| Flow | Page | Local PASS/FAIL | Vercel PASS/FAIL | Persisted | Notes |
|---|---|---:|---:|---:|---|
| Create task | /taskuri | PASS | run after deploy | yes | New Task writes localStorage |
| Open task drawer | all task views | PASS | run after deploy | yes | row/card click selects task |
| Edit status | drawer/table/board | PASS | run after deploy | yes | shared state update |
| Edit assignee | drawer/table | PASS | run after deploy | yes | My Work changes |
| Add comment | drawer | PASS | run after deploy | yes | comment list updates |
| Toggle checklist | drawer | PASS | run after deploy | yes | checklist item toggles |
| Add dependency | drawer/Gantt | PASS | run after deploy | yes | dependency label updates |
| Start/stop timer | drawer/timesheets | PASS | run after deploy | yes | tracked time updates |
| Move task on board | board | PASS | run after deploy | yes | drag/drop status update |
| Verify table status | table | PASS | run after deploy | yes | shared tasks array |
| Select 3 tasks | table | PASS | run after deploy | component | selected IDs visible |
| Bulk action | table | PASS | run after deploy | yes | selected tasks update |
| Create ticket | tickets | PASS | run after deploy | yes | ticket + notification |
| Escalate ticket | tickets | PASS | run after deploy | yes | Critical/Escalated |
| Convert ticket | tickets | PASS | run after deploy | yes | creates follow-up task |
| Create request form | forms | PASS | run after deploy | yes | request becomes ticket |
| Mark notification read | inbox | PASS | run after deploy | yes | read flag toggles |
| Create saved view | all | PASS | run after deploy | yes | saved view appended |
| Change deadline | drawer/calendar | PASS | run after deploy | yes | date field updates |
| Change estimate | drawer | PASS | run after deploy | yes | workload recalculates |
| Approve/reject approval | workload | PASS | run after deploy | yes | approval state changes |
| Export CSV | table/reports | PASS | run after deploy | browser | downloads visible data |
| Switch role | topbar | PASS | run after deploy | component | role selector updates |
| Check Vercel | live | pending | pending | n/a | requires deploy |
