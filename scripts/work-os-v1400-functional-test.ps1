param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)
$ErrorActionPreference = "Stop"
$RepoRoot = (Get-Location).Path
$ReportDir = Join-Path $RepoRoot "audit-results"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$ReportPath = Join-Path $ReportDir "v1400-goodday-route-specific-taskuri-routes.md"

function Convert-PagePathToRoute([string]$PagePath) {
  $rel = Resolve-Path -LiteralPath $PagePath | ForEach-Object { $_.Path.Substring((Resolve-Path -LiteralPath (Join-Path $RepoRoot "apps\web\app")).Path.Length) }
  $rel = $rel -replace "\\", "/"
  $rel = $rel -replace "/page\.tsx$", ""
  if ($rel -eq "/taskuri") { return "/taskuri" }
  return $rel
}

$taskuriPages = Get-ChildItem -LiteralPath (Join-Path $RepoRoot "apps\web\app\taskuri") -Filter "page.tsx" -Recurse | ForEach-Object { Convert-PagePathToRoute $_.FullName } | Sort-Object -Unique
$apiRoutes = @(
  "/api/v1/work-os/v140-goodday-route-specific-taskuri",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/health",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/routes",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/scores",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/buttons",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/flows",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/readiness",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/workspace",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/manual-ui",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/screenshots",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/route-specific-content",
  "/api/v1/work-os/v140-goodday-route-specific-taskuri/goodday-parity"
)
$routes = @($taskuriPages + $apiRoutes)
$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    $ok = $status -ge 200 -and $status -lt 300
    if ($ok) { $passed++ }
    $rows += [pscustomobject]@{ Route=$route; Result= if ($ok) {"PASS"} else {"FAIL"}; HTTP=$status; Bytes=($response.Content.Length); Note="OK" }
  } catch {
    $rows += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=0; Bytes=0; Note=$_.Exception.Message }
  }
}
$md = @()
$md += "# v14.0.0 GoodDay Route-Specific Taskuri Route/API Test"
$md += ""
$md += "BaseUrl: $BaseUrl"
$md += ""
$md += "| Route | Result | HTTP | Bytes | Note |"
$md += "|---|---:|---:|---:|---|"
foreach ($row in $rows) { $md += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $($row.Note -replace '\|','/') |" }
$md += ""
$md += "Passed: $passed / $($routes.Count)"
Set-Content -LiteralPath $ReportPath -Value ($md -join "`n") -Encoding UTF8
if ($passed -ne $routes.Count) { throw "v14.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $ReportPath" }
Write-Host "v14.0.0 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $ReportPath"
