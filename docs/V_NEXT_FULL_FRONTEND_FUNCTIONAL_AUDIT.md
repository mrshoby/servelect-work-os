# V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT

BaseUrl: http://localhost:3000

| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |
|---|---|---|---|---|---:|---:|---:|
| /taskuri | New Task | click | New Task created | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri
Call log:
[2m  - navigating to "http://localhost:3000/taskuri", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/tickets | New Ticket | click | New Ticket created | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/tickets
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/tickets", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/tabel | Save View | click | Saved View persisted | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/tabel
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/tabel", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/tabel | Export | click | Export generated | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/tabel
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/tabel", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri | Import | click | Import completed | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri
Call log:
[2m  - navigating to "http://localhost:3000/taskuri", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/board | Bulk to review | click | Bulk validation | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/board
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/board", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/timesheets | Start timer | click | Timer started | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/timesheets
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/timesheets", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/timesheets | Stop timer | click | Timer stopped | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/timesheets
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/timesheets", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/inbox | Mark all read | click | All notifications marked read | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/inbox
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/inbox", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/approvals | Approve | click | approved | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/approvals
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/approvals", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/approvals | Reject | click | rejected | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/approvals
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/approvals", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri/automations | Create automation | click | Automation created | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri/automations
Call log:
[2m  - navigating to "http://localhost:3000/taskuri/automations", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri | Add comment | click | Comment added | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri
Call log:
[2m  - navigating to "http://localhost:3000/taskuri", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri | Add dependency | click | Dependency added | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri
Call log:
[2m  - navigating to "http://localhost:3000/taskuri", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |
| /taskuri | Attach file | click | Mock attachment added | page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/taskuri
Call log:
[2m  - navigating to "http://localhost:3000/taskuri", waiting until "networkidle"[22m
 | NO | CHECK | FAIL |

Passed: 0 / 15