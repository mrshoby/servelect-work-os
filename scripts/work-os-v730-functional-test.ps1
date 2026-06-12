param(
  [string]$BaseUrl = 'http://127.0.0.1:3100'
)

$ErrorActionPreference = 'Stop'
$Routes = @(
  '/work-os/prisma-migration',
  '/admin/prisma-migration',
  '/api/v1/work-os/v73-schema-migration',
  '/api/v1/work-os/v73-schema-migration/health',
  '/api/v1/work-os/v73-schema-migration/shadow-writes',
  '/api/v1/work-os/v73-schema-migration/notification-queue',
  '/api/v1/work-os/v73-schema-migration/rollback',
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
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$ReportPath = Join-Path $OutDir 'v730-prisma-schema-functional-routes.md'
$Rows = @('# v7.3.0 Functional Route Smoke', '', 'BaseUrl: ' + $BaseUrl, '', '| Route | Result | HTTP | Bytes |', '|---|---:|---:|---:|')
$Failed = 0
foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 30
    $Rows += ('| ' + $Route + ' | PASS | ' + $Response.StatusCode + ' | ' + $Response.Content.Length + ' |')
    Write-Host ($Route + ' -> PASS HTTP ' + $Response.StatusCode + ' | ' + $Response.Content.Length + ' bytes') -ForegroundColor Green
  } catch {
    $Failed += 1
    $Rows += ('| ' + $Route + ' | FAIL: ' + $_.Exception.Message.Replace('|','/') + ' | 0 | 0 |')
    Write-Host ($Route + ' -> FAIL | ' + $_.Exception.Message) -ForegroundColor Red
  }
}
Set-Content -Path $ReportPath -Value $Rows -Encoding UTF8
if ($Failed -gt 0) { throw ('v7.3.0 functional route smoke failed: ' + $Failed + ' route(s). See ' + $ReportPath) }
Write-Host ('v7.3.0 functional route smoke passed: ' + $Routes.Count + ' / ' + $Routes.Count) -ForegroundColor Green
Write-Host ('Report: ' + $ReportPath)
