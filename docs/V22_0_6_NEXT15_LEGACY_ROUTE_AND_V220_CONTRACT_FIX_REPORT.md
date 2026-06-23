# v22.0.6 Next15 Legacy Route + V220 Contract Fix

Fixes the old v110 dynamic API route that was still breaking Next.js 15 builds and rewrites the V220 frontend acceptance layer as a passive no-duplicate-dialog layer.

- V15/V200/V210 shell is preserved.
- No new visual shell.
- V220 no longer opens New Task / New Ticket dialogs.
- V220 only records visible interactions in localStorage.
- Source audit tokens restored: client marker, event delegation, aria-live feedback host, save-view/reset-filter, mark-read/mark-all-read, drawer-save/inline-edit, procurement/RFQ/supplier/PO/invoice, time-entry, workload-assign.
- v110 dynamic [section] route is Next.js 15 compatible with params as Promise.
