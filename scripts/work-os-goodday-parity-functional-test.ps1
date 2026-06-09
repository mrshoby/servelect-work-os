param(
  [string]$BaseUrl = "http://127.0.0.1:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os/goodday-parity",
  "/taskuri/goodday-parity",
  "/api/v1/work-os/goodday-parity"
)

$results = @()
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    $ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    $results += [pscustomobject]@{ Route = $route; StatusCode = $response.StatusCode; Result = $(if ($ok) { "PASS" } else { "FAIL" }) }
  } catch {
    $results += [pscustomobject]@{ Route = $route; StatusCode = 0; Result = "FAIL: $($_.Exception.Message)" }
  }
}

$results | Format-Table -AutoSize
if ($results.Result -match "FAIL") {
  throw "GoodDay parity route test failed."
}
