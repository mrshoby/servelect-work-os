# V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT — v18.0.0

Scope: Costuri & Aprovizionare / Achiziții / Bugetare procurement flow. Buttons are real handlers inside the v18 in-place runtime and persist to localStorage.

| Button | Page | Handler | Changes state | Gives feedback | Persists | PASS/FAIL |
|---|---|---|---|---|---|---:|
| Creează solicitare | V180 procurement panel | createRequest | YES | YES | YES | PASS |
| Adaugă materiale | V180 procurement panel | addMaterials | YES | YES | YES | PASS |
| Convertește în RFQ | V180 procurement panel | convertToRfq | YES | YES | YES | PASS |
| Alege furnizori | V180 procurement panel | chooseSuppliers | YES | YES | YES | PASS |
| Adaugă oferte | V180 procurement panel | addOffers | YES | YES | YES | PASS |
| Compară oferte | V180 procurement panel | compareOffers | YES | YES | YES | PASS |
| Alege recomandată | V180 procurement panel | selectRecommendedOffer | YES | YES | YES | PASS |
| Generează comandă | V180 procurement panel | generatePurchaseOrder | YES | YES | YES | PASS |
| Setează livrare | V180 procurement panel | setDeliveryTerm | YES | YES | YES | PASS |
| Marchează întârziere | V180 procurement panel | markDelay | YES | YES | YES | PASS |
| Adaugă factură | V180 procurement panel | addInvoice | YES | YES | YES | PASS |
| Atașează garanție | V180 procurement panel | attachWarranty | YES | YES | YES | PASS |
| Leagă proiect | V180 procurement panel | linkProject | YES | YES | YES | PASS |
| Mark all read | V180 procurement panel | markAllRead | YES | YES | YES | PASS |
| Import preview | V180 procurement panel | importPreview | YES | YES | YES | PASS |
| Export CSV | V180 procurement panel | exportCsv | YES | YES | YES | PASS |

Passed: 16 / 16