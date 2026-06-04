param(
  [Parameter(Mandatory=$true)][string]$BaseUrl,
  [Parameter(Mandatory=$true)][string]$SeedToken
)

$ErrorActionPreference = "Stop"
$headers = @{ "x-servelect-seed-token" = $SeedToken }
Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/db/seed" -Headers $headers | ConvertTo-Json -Depth 8
