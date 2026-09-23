$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$hdrs = @{ 'Referer' = 'https://a202512111740223802002854.wgstores.com/'; 'Accept' = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
$root = $PSScriptRoot
$dir = Join-Path $root 'raw3'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$urls = Get-Content (Join-Path $root 'urls_item1.txt') | Where-Object { $_ -match '^https' }
$i = 0
$ok = 0; $fail = 0
foreach ($u in $urls) {
  $name = '{0:d2}.jpg' -f $i
  $out = Join-Path $dir $name
  try {
    Invoke-WebRequest -Uri $u.Trim() -OutFile $out -UseBasicParsing -Headers $hdrs -UserAgent $ua -TimeoutSec 40
    $ok++
    Write-Output "OK $name"
  } catch {
    $fail++
    Write-Output "FAIL $name :: $($_.Exception.Message)"
  }
  $i++
}
Write-Output ("DONE total={0} ok={1} fail={2}" -f $i, $ok, $fail)
