# v22.0.5 Complete Stable Fix

Fixes the v22.0.4 patch script syntax failure and replaces V220 with a passive acceptance layer.

- keeps V15/V200/V210 shell unchanged;
- preserves V220 server marker and API contract;
- keeps NO_DUPLICATE_DIALOGS;
- V220 does not create New Task/New Ticket dialogs;
- V220 only records visible interactions to localStorage;
- restores time-entry and workload-assign source audit tokens;
- keeps root and section API endpoints aligned to Next.js 15.
