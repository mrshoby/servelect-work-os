# V_NEXT_STATIC_UI_ELIMINATION_REPORT

All visible v13 Taskuri controls are classified as MOCK_INTERACTIVE or REAL_LOCAL_PERSISTENT. Backend/provider write mode remains gated.

| Component | Classification | Notes |
|---|---|---|
| Enterprise table/list | REAL_LOCAL_PERSISTENT | localStorage state update for status, assignee, due date, estimate |
| Board cards | MOCK_INTERACTIVE | clicking opens drawer and status can be changed |
| Task detail drawer | REAL_LOCAL_PERSISTENT | field edits update local store |
| Ticket queue | MOCK_INTERACTIVE | create/convert logic exists in component |
| CSV export | MOCK_INTERACTIVE | browser download generated from current filtered rows |
| Search/filter | REAL_LOCAL_PERSISTENT | query modifies visible rows |
