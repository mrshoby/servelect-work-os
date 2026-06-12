# V7.2.3 Prisma Shadow Route Repair

Fixes the v7.2 route 404 problem after v7.2.2 by force-copying the missing Next.js route files and API route handlers.

Repair scope:
- /work-os/prisma-shadow-records
- /admin/prisma-shadow-records
- /api/v1/work-os/v72-shadow-records and child endpoints
- defensive TypeScript alignment for V72PrismaShadowRecordsClient

No redesign. No primary database writes enabled.
