# v7.8.0 Functional Test Report

Run after GitHub push and Vercel deploy:

```powershell
$env:VERCEL_AUTOMATION_BYPASS_SECRET = "<secret>"
.\scripts\work-os-v780-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Expected: all v7.8 routes PASS HTTP 200.
