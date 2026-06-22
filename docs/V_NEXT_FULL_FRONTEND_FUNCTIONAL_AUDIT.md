# V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT — v19.0.2

| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |
|---|---|---|---|---|---:|---:|---:|
| Taskuri / V15 shell | New Task | Click/create task | Modal opens, task is created and stored | Handler creates task + notification | YES | YES | PASS |
| Taskuri / V15 shell | Reset Filter | Click reset/clear filter | Filters reset and feedback/activity state updated | commit() writes activity log | YES | YES | PASS |
| Taskuri / V15 shell | Reject | Click reject and submit reason | Reject modal records reason and notification | commit() writes notification/activity | YES | YES | PASS |
| Taskuri / V15 shell | Table sort | Click table header | DOM order changes and activity state updated | sortNearestTable + commit() | YES | YES | PASS |

Nu se declară 100%. Auditul browser complet pe toate elementele vizibile rămâne cerință pentru următorul build major.
