SERVELECT WORK OS v1.0.1 PERFORMANCE HOTFIX

1. Extrage arhiva ZIP în Downloads sau Desktop.
2. Deschide PowerShell 7.
3. Rulează:

cd "$env:USERPROFILE\Downloads\servelect-work-os-v101-performance-hotfix-patch\scripts"
.\apply-v101-performance-hotfix.ps1

Dacă ai extras în alt folder, intră în folderul scripts de acolo și rulează același script.

După deploy Vercel, testează:
- /taskuri
- /admin/performance
- /api/v1/performance/audit

Pentru test rute:
.\site-smoke-test.ps1
