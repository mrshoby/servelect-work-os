# v6.4.17 — Real screenshot capture fix

Motiv: în v6.4.16 folderul de screenshot conținea doar `01_taskuri_overview.png`, deși raportul lista toate cele 10 rute. Asta indică o problemă de audit/captură, nu o confirmare vizuală completă.

Fix:
- fiecare rută folosește propriul `--user-data-dir`, ca Edge să nu blocheze profilul comun;
- se salvează DOM-ul fiecărei pagini în HTML;
- se salvează stdout/stderr pentru fiecare rută;
- statusul raportului este calculat din fișier real + dimensiune + semne de client-side error;
- dacă orice rută nu este `CAPTURED`, scriptul se oprește cu eroare după ce salvează raportul.

Acest fix nu declară 95% și nu schimbă designul.
