param([string]$BaseUrl = "https://servelect-work-os-web.vercel.app")
$ErrorActionPreference = "Stop"
$endpoints = @(
  "/admin/source-of-truth-adapter-activation",
  "/admin/source-of-truth-adapter-activation-data-map",
  "/admin/source-of-truth-adapter-activation-adapter-registry",
  "/admin/source-of-truth-adapter-activation-contracts",
  "/admin/source-of-truth-adapter-activation-sync-plan",
  "/admin/source-of-truth-adapter-activation-reconciliation",
  "/admin/source-of-truth-adapter-activation-governance",
  "/admin/source-of-truth-adapter-activation-risks",
  "/admin/source-of-truth-adapter-activation-runbooks",
  "/admin/source-of-truth-adapter-activation-executive",
  "/api/v1/enterprise/source-of-truth-adapter-activation-health",
  "/api/v1/enterprise/source-of-truth-adapter-activation-adapters",
  "/api/v1/enterprise/source-of-truth-adapter-activation-contracts",
  "/api/v1/enterprise/source-of-truth-adapter-activation-source-map",
  "/api/v1/enterprise/source-of-truth-adapter-activation-sync-plan",
  "/api/v1/enterprise/source-of-truth-adapter-activation-reconciliation",
  "/api/v1/work-os/source-of-truth",
  "/api/v1/work-os/domain-readiness",
  "/api/v1/tasks/source-of-truth",
  "/api/v1/projects/source-of-truth",
  "/api/v1/stock/source-of-truth",
  "/api/v1/pontaj/source-of-truth",
  "/api/v1/audit/source-of-truth"
)
$failures=@()
foreach($endpoint in $endpoints){$url=$BaseUrl.TrimEnd("/")+$endpoint; try{$r=Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30; Write-Host "OK $($r.StatusCode) $endpoint" -ForegroundColor Green}catch{Write-Host "FAIL $endpoint $($_.Exception.Message)" -ForegroundColor Red; $failures+=$endpoint}}
if($failures.Count -gt 0){throw "v5.0 source-of-truth audit failed: $($failures -join ", ")"}
Write-Host "v5.0 source-of-truth adapter activation audit passed." -ForegroundColor Green
