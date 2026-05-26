# Push environment variables to Vercel production
# Reads from .env.local and pushes each non-comment, non-empty variable.

$ErrorActionPreference = "Stop"
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
  Write-Error ".env.local not found"
  exit 1
}

$SKIP = @("NEXT_PUBLIC_APP_URL","NODE_ENV","SUPABASE_DB_URL","OPENROUTER_API_KEY_DISABLED","OLLAMA_BASE_URL","OLLAMA_MODEL","WAHA_BASE_URL","WAHA_API_KEY","WAHA_SESSION","APP_NAME")

$lines = Get-Content $envFile
$pushed = 0
$skipped = 0

foreach ($line in $lines) {
  $trim = $line.Trim()
  if ($trim -eq "" -or $trim.StartsWith("#")) { continue }
  $eq = $trim.IndexOf("=")
  if ($eq -lt 1) { continue }
  $key = $trim.Substring(0, $eq).Trim()
  $value = $trim.Substring($eq + 1).Trim()
  if ($key -in $SKIP) {
    Write-Host "  skip $key"
    $skipped++
    continue
  }
  Write-Host "Pushing $key..."
  $value | & npx vercel env add $key production --force 2>&1 | Select-Object -Last 2 | Out-Null
  $pushed++
}

Write-Host ""
Write-Host "Pushed $pushed vars. Skipped $skipped."
