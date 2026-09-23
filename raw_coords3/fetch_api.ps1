$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$hdrs = @{ 'Referer' = 'https://a202512111740223802002854.wgstores.com/' }
$root = $PSScriptRoot
$base = 'https://a202512111740223802002854.wgstores.com/commodity/view?targetAlbumId=_dfsqfASbWjTTBpStZ24GMPA50pdUEaa_cbOY-4g&itemId='

$items = @(
  @('item1', '_dd7qfmECjwRx5Z-Vhk-WvRgpP337X97IUGyVkRw'),
  @('item2', '_d__qf6YHqzf67ZqQgi_-scde5hRYslF2lfDbzmA')
)

foreach ($it in $items) {
  $out = Join-Path $root ($it[0] + '.json')
  try {
    Invoke-WebRequest -Uri ($base + $it[1]) -OutFile $out -UseBasicParsing -Headers $hdrs -UserAgent $ua -TimeoutSec 40
    $len = (Get-Item $out).Length
    Write-Output ("OK {0} :: {1} bytes" -f $it[0], $len)
  } catch {
    Write-Output ("FAIL {0} :: {1}" -f $it[0], $_.Exception.Message)
  }
}
Write-Output 'DONE'
