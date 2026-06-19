# V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT

BaseUrl: https://servelect-work-os-web.vercel.app

| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |
|---|---|---|---|---|---:|---:|---:|
| /taskuri | New Task | click | New Task created | New Task created | YES | YES | PASS |
| /taskuri/tickets | New Ticket | click | New Ticket created | New Ticket created | YES | YES | PASS |
| /taskuri/tabel | Save View | click | Saved View persisted | Saved View persisted | YES | YES | PASS |
| /taskuri/tabel | Export | click | Export generated | Export generated | YES | YES | PASS |
| /taskuri | Import | click | Import completed | Import completed | YES | YES | PASS |
| /taskuri/board | Bulk to review | click | Bulk validation | Bulk validation | YES | YES | PASS |
| /taskuri/timesheets | Start timer | click | Timer started | Timer started | YES | YES | PASS |
| /taskuri/timesheets | Stop timer | click | Timer stopped | Timer stopped | YES | YES | PASS |
| /taskuri/inbox | Mark all read | click | All notifications marked read | All notifications marked read | YES | YES | PASS |
| /taskuri/approvals | Approve | click | approved | approved | YES | YES | PASS |
| /taskuri/approvals | Reject | click | rejected | rejected | YES | YES | PASS |
| /taskuri/automations | Create automation | click | Automation created | Automation created | YES | YES | PASS |
| /taskuri | Add comment | click | Comment added | Comment added | YES | YES | PASS |
| /taskuri | Add dependency | click | Dependency added | Dependency added | YES | YES | PASS |
| /taskuri | Attach file | click | Mock attachment added | Mock attachment added | YES | YES | PASS |

Passed: 15 / 15

Note: this audit performs real browser clicks against the supplied BaseUrl. It does not claim full 100% GoodDay parity.