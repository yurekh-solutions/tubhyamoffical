Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

function Montage([string[]]$files, [string]$outPath, [int]$cols) {
  $cellW = 300; $cellH = 400
  $rows = [math]::Ceiling($files.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap(($cols * $cellW), ($rows * $cellH))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $i = 0
  foreach ($f in $files) {
    $im = [System.Drawing.Image]::FromFile($f)
    $ratio = [math]::Min($cellW / $im.Width, $cellH / $im.Height)
    $nw = [int]($im.Width * $ratio); $nh = [int]($im.Height * $ratio)
    $x = ($i % $cols) * $cellW + [int](($cellW - $nw) / 2)
    $y = [math]::Floor($i / $cols) * $cellH + [int](($cellH - $nh) / 2)
    $g.DrawImage($im, $x, $y, $nw, $nh)
    $im.Dispose()
    $i++
  }
  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "MONTAGE $outPath"
}

$all = @()
Get-ChildItem -Path (Join-Path $root 'raw3') -Filter '*.jpg' | Where-Object { $_.BaseName -match '^\d\d$' } | Sort-Object Name | ForEach-Object { $all += $_.FullName }

$sheet = 0
for ($start = 0; $start -lt $all.Count; $start += 24) {
  $end = [math]::Min($start + 23, $all.Count - 1)
  $slice = $all[$start..$end]
  $out = Join-Path $root ('sheet{0}.png' -f $sheet)
  Montage $slice $out 6
  $sheet++
}

# dimensions report
foreach ($f in $all) {
  $im = [System.Drawing.Image]::FromFile($f)
  Write-Output ("{0}: {1}x{2}" -f (Split-Path $f -Leaf), $im.Width, $im.Height)
  $im.Dispose()
  break
}
Write-Output 'DONE'
