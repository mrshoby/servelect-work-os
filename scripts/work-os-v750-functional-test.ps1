param([string]$BaseUrl = 'https://servelect-work-os-web.vercel.app')
$ErrorActionPreference = 'Stop'
$Routes = @(
  '/work-os/conflict-resolution',
  '/work-os/attachments',
  '/admin/access-inheritance',
  '/api/v1/work-os/v75-conflict-access-storage',
  '/api/v1/work-os/v75-conflict-access-storage/health',
  '/api/v1/work-os/v75-conflict-access-storage/conflicts',
  '/api/v1/work-os/v75-conflict-access-storage/access-rules',
  '/api/v1/work-os/v75-conflict-access-storage/attachments',
  '/work-os/db-shadow-writes',
  '/work-os/prisma-migration',
  '/work-os/prisma-shadow-records',
  '/taskuri/overview',
  '/taskuri/tickets-notificari',
  '/taskuri/forms',
  '/taskuri/timesheets',
  '/taskuri/workload-aprobari',
  '/taskuri/automations',
  '/taskuri/reports'
)
$OutDir = Join-Path (Get-Location) 'audit-results'
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
$Report = Join-Path $OutDir 'v750-conflict-access-attachments-functional-routes.md'
$Lines = @('# V7.5.0 Functional Route Smoke', '', 'BaseUrl: ' + $BaseUrl, '', '| Route | Result |', '|---|---|')
$Failed = 0
foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 30
    $Line = '| ' + $Route + ' | PASS HTTP ' + $Response.StatusCode + ' |'
    Write-Host ($Route + ' -> PASS HTTP ' + $Response.StatusCode + ' | ' + $Response.Content.Length + ' bytes') -ForegroundColor Green
  } catch {
    $Failed += 1
    $Line = '| ' + $Route + ' | FAIL ' + $_.Exception.Message.Replace('|','/') + ' |'
    Write-Host ($Route + ' -> FAIL | ' + $_.Exception.Message) -ForegroundColor Red
  }
  $Lines += $Line
}
Set-Content -Path $Report -Value ($Lines -join [Environment]::NewLine) -Encoding UTF8
if ($Failed -gt 0) { throw ('v7.5.0 functional route smoke failed: ' + $Failed + ' route(s). See ' + $Report) }
Write-Host ('v7.5.0 functional route smoke passed: ' + $Routes.Count + ' / ' + $Routes.Count) -ForegroundColor Green
Write-Host ('Report: ' + $Report)
