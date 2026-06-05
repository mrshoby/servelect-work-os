$ErrorActionPreference = "Stop"

$base = $env:SERVELECT_TEST_BASE_URL
if (-not $base) { $base = "http://localhost:3000" }

$endpoints = @(
  "/api/v1/action-center",
  "/api/v1/audit/events",
  "/api/v1/workflows/executions",
  "/api/v1/system/status",
  "/api/v1/system/readiness"
)

foreach ($endpoint in $endpoints) {
  $url = "$base$endpoint"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $result = Invoke-RestMethod -Uri $url -Method GET
  if (-not $result.ok) { throw "Endpoint failed: $endpoint" }
  Write-Host "OK $endpoint" -ForegroundColor Green
}

Write-Host "Testing workflow run" -ForegroundColor Cyan
$body = '{"templateId":"iot-inverter-offline-task","projectCode":"P-2024-0187","projectName":"Sistem FV 9.6 kWp"}'
$run = Invoke-RestMethod -Method POST -Uri "$base/api/v1/workflows/run" -ContentType "application/json" -Body $body
if (-not $run.ok) { throw "Workflow run failed" }
Write-Host "OK workflow run" -ForegroundColor Green
