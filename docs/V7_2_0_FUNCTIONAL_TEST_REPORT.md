# v7.2.0 Functional Test Report

| Flow | Expected |
|---|---|
| Create task shadow | Creates shadow record + rollback evidence + notification |
| Update task shadow | Updates local runtime and records before/after hashes |
| Escalate ticket | Creates ticket shadow evidence |
| Convert ticket | Creates task mutation through v71 adapter and v72 record |
| Submit request | Creates requestForm shadow record |
| Add time | Creates timeEntry shadow record |
| Rollback first record | Marks shadow record rolled_back and consumes evidence |
| Mark notifications read | Sets server notification store to read |
| Export CSV | Exports shadow/rollback/notification evidence |

Result must be updated after running scripts/work-os-v720-functional-test.ps1.
