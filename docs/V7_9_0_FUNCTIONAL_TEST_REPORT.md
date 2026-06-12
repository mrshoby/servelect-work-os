# v7.9.0 Functional Test Report

Run after GitHub push and Vercel auto-deploy:

```powershell
$env:VERCEL_AUTOMATION_BYPASS_SECRET = "<secret>"
.\scripts\work-os-v790-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```
