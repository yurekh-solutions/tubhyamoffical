Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$outDir = Join-Path $root '..\public\images\products'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function CropTopSide([string]$inPath, [string]$outPath, [double]$topPct, [double]$aspect) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  $w = $img.Width; $h = $img.Height
  $cut = [int]($h * $topPct)
  $newH = $h - $cut
  $newW = [int][math]::Round($newH * $aspect)
  if ($newW -gt $w) { $newW = $w }
  $x0 = [int](($w - $newW) / 2)
  $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $dst = New-Object System.Drawing.Rectangle(0, 0, $newW, $newH)
  $srcR = New-Object System.Drawing.Rectangle($x0, $cut, $newW, $newH)
  $g.DrawImage($img, $dst, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)
  $bmp.Save($outPath, $codec, $ep)
  Write-Output ("CROP {0} -> {1}  {2}x{3} -> {4}x{5}" -f (Split-Path $inPath -Leaf), (Split-Path $outPath -Leaf), $w, $h, $newW, $newH)
  $bmp.Dispose(); $img.Dispose()
}

# cord-set-004: tailored single-breasted blazer + wide-leg pants suit, 7 colourways
# name, source raw, top crop pct
$jobs = @(
  @('24', 'cord-set-004-white',       0.09),
  @('21', 'cord-set-004-chocbrown',   0.09),
  @('49', 'cord-set-004-red',         0.10),
  @('48', 'cord-set-004-royalblue',   0.07),
  @('52', 'cord-set-004-black',       0.10),
  @('50', 'cord-set-004-yellow',      0.15),
  @('63', 'cord-set-004-powderblue',  0.09)
)
$outs = @()
foreach ($j in $jobs) {
  $inF = Join-Path $root ($j[0] + '.jpg')
  $outF = Join-Path $outDir ($j[1] + '.jpg')
  CropTopSide $inF $outF ([double]$j[2]) 0.94
  $outs += $outF
}

# montage of outputs for verification, larger cells
function Montage([string[]]$files, [string]$outPath, [int]$cols) {
  $cellW = 330; $cellH = 440
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

Montage $outs (Join-Path $root 'preview_004.png') 4
Write-Output 'DONE'
