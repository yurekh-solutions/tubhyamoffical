Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$prodDir = Join-Path $root '..\public\images\products'

function Info([string]$p, [string]$label) {
  if (Test-Path $p) {
    $im = [System.Drawing.Image]::FromFile($p)
    Write-Output ("{0}: {1}x{2}" -f $label, $im.Width, $im.Height)
    $im.Dispose()
  } else {
    Write-Output ("{0}: MISSING" -f $label)
  }
}

foreach ($n in @('48','49','50','51','52','60','63','64','66','67','70','71','72','73','74','75','82','83','87')) {
  Info (Join-Path $root ($n + '.jpg')) ("raw " + $n)
}
Info (Join-Path $prodDir 'cord-set-002-wine.jpg') 'cord-set-002-wine'
Info (Join-Path $prodDir 'cord-set-003-black.jpg') 'cord-set-003-black'
Info (Join-Path $prodDir 'dr-006.jpg') 'dr-006 (dress ref)'
Write-Output 'DONE'
