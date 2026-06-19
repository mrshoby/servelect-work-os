# NEXT_BUILD_PLAN.md

## Current safe UI baseline

`taskuri-ui-v15-goodday-baseline-restored` / `91c4036`.

Do not rebuild Taskuri UI on `V160RealProviderMutationTaskuriWorkspace`.

## Current build

`v17.0.0 — GoodDay Functional Parity Layer on V15 UI Baseline`

Goal: keep v15 visual structure and add real connected functionality.

## Next major build recommendation

`v18.0.0 — Costuri, Achiziții & Bugetare Full Procurement Flow`

Why: lowest categories after v17 are Costuri & Aprovizionare, Achiziții, Bugetare.

Scope:

1. Procurement store with supply requests, materials, RFQ, suppliers, offers, purchase orders, delivery terms, delays, invoices and warranty certificates.
2. Real UI pages for `/costuri`, `/achizitii`, `/bugetare`, plus links from project/task drawer.
3. Full flow audit:
   - create supply request
   - add materials
   - convert to RFQ
   - choose suppliers
   - add offers
   - compare price vs delivery term
   - choose recommended offer
   - generate PO
   - set delivery date
   - mark delay
   - receive alert
   - add invoice
   - attach warranty certificate
   - link to project
4. Dead buttons zero tolerance for procurement module.
5. Honest percentage scorecard, no false 100%.
