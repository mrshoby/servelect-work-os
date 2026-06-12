# v7.3.0 Functional Test Report

Required local/Vercel checks:

| Flow | Expected |
|---|---|
| Open `/work-os/prisma-migration` | PASS 200 |
| Open `/admin/prisma-migration` | PASS 200 |
| GET `/api/v1/work-os/v73-schema-migration` | PASS JSON |
| GET `/health` | PASS JSON |
| POST `/shadow-writes` | returns shadow row + rollback + queue item |
| POST `/notification-queue` | marks queued items as delivered |
| GET `/rollback` | returns rollback checkpoint evidence |
| CSV export buttons | download client-side CSV |

Do not accept v7.3.0 as final if route smoke fails.
